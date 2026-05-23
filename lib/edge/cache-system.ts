/**
 * @file cache-system.ts
 * @description 边缘缓存系统 - 基于 Redis（替代已废弃的 @vercel/kv）
 * @module edge
 * @author YYC³
 * @version 2.0.0
 * @created 2025-01-19
 * @updated 2026-05-23
 */

import { redisCache } from "@/lib/cache/redis"

export enum CacheStrategy {
  LRU = "lru",
  LFU = "lfu",
  FIFO = "fifo",
  TTL = "ttl",
}

export interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  totalRequests: number
  avgResponseTime: number
  cacheSize: number
  evictions: number
}

export interface CacheConfig {
  maxSize: number
  defaultTTL: number
  strategy: CacheStrategy
  enableCompression: boolean
  enablePrefetch: boolean
}

export class EdgeCacheSystem {
  private config: CacheConfig
  private metrics: CacheMetrics
  private cacheKeys: Set<string>

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 3600,
      strategy: CacheStrategy.LRU,
      enableCompression: true,
      enablePrefetch: false,
      ...config,
    }

    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      avgResponseTime: 0,
      cacheSize: 0,
      evictions: 0,
    }

    this.cacheKeys = new Set()
  }

  async cacheData(
    key: string,
    data: any,
    ttl: number = this.config.defaultTTL,
    strategy: CacheStrategy = this.config.strategy,
  ): Promise<void> {
    try {
      const cachedData = this.config.enableCompression ? this.compressData(data) : data

      const cacheEntry = {
        data: cachedData,
        timestamp: Date.now(),
        ttl,
        strategy,
        accessCount: 0,
        lastAccess: Date.now(),
      }

      await redisCache.set(key, cacheEntry, ttl)
      this.cacheKeys.add(key)
      this.updateCacheSize()
    } catch (error) {
      console.error("[EdgeCache] 缓存失败:", error)
      throw error
    }
  }

  async getData(key: string): Promise<any | null> {
    const startTime = Date.now()
    this.metrics.totalRequests++

    try {
      const cacheEntry = await redisCache.get<any>(key)

      if (cacheEntry) {
        this.metrics.hits++
        await this.updateAccessInfo(key, cacheEntry, this.config.defaultTTL)
        const data = this.config.enableCompression
          ? this.decompressData(cacheEntry.data)
          : cacheEntry.data

        this.updateMetrics(Date.now() - startTime)
        return data
      } else {
        this.metrics.misses++
        this.updateMetrics(Date.now() - startTime)
        return null
      }
    } catch (error) {
      console.error("[EdgeCache] 获取缓存失败:", error)
      this.metrics.misses++
      return null
    }
  }

  async warmupCache(predictedRequests: Array<{ key: string; fetcher: () => Promise<any> }>): Promise<void> {
    if (!this.config.enablePrefetch) {
      return
    }

    console.log("[EdgeCache] 开始缓存预热...")

    const warmupPromises = predictedRequests.map(async ({ key, fetcher }) => {
      try {
        const cached = await this.getData(key)
        if (cached) return

        const data = await fetcher()
        await this.cacheData(key, data)
      } catch (error) {
        console.error(`[EdgeCache] 预热失败 ${key}:`, error)
      }
    })

    await Promise.all(warmupPromises)
    console.log("[EdgeCache] 缓存预热完成")
  }

  async invalidateCache(pattern: string): Promise<number> {
    try {
      let invalidatedCount = 0
      const regex = new RegExp(pattern.replace(/\*/g, ".*"))

      for (const key of this.cacheKeys) {
        if (regex.test(key)) {
          await redisCache.del(key)
          this.cacheKeys.delete(key)
          invalidatedCount++
        }
      }

      this.updateCacheSize()
      console.log(`[EdgeCache] 失效缓存: ${invalidatedCount} 条`)
      return invalidatedCount
    } catch (error) {
      console.error("[EdgeCache] 缓存失效失败:", error)
      throw error
    }
  }

  getCacheMetrics(): CacheMetrics {
    this.metrics.hitRate = this.metrics.totalRequests > 0 ? (this.metrics.hits / this.metrics.totalRequests) * 100 : 0
    return { ...this.metrics }
  }

  async clearAll(): Promise<void> {
    try {
      for (const key of this.cacheKeys) {
        await redisCache.del(key)
      }
      this.cacheKeys.clear()
      this.resetMetrics()
      console.log("[EdgeCache] 已清空所有缓存")
    } catch (error) {
      console.error("[EdgeCache] 清空缓存失败:", error)
      throw error
    }
  }

  private compressData(data: any): string {
    return JSON.stringify(data)
  }

  private decompressData(compressedData: string): any {
    return JSON.parse(compressedData)
  }

  private async updateAccessInfo(key: string, cacheEntry: any, ttl: number): Promise<void> {
    cacheEntry.accessCount++
    cacheEntry.lastAccess = Date.now()
    await redisCache.set(key, cacheEntry, ttl)
  }

  private updateCacheSize(): void {
    this.metrics.cacheSize = this.cacheKeys.size
  }

  private updateMetrics(responseTime: number): void {
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime * (this.metrics.totalRequests - 1) + responseTime) / this.metrics.totalRequests
  }

  private resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalRequests: 0,
      avgResponseTime: 0,
      cacheSize: 0,
      evictions: 0,
    }
  }
}

export const edgeCacheSystem = new EdgeCacheSystem({
  maxSize: 100,
  defaultTTL: 3600,
  strategy: CacheStrategy.LRU,
  enableCompression: true,
  enablePrefetch: true,
})

export function Cacheable(ttl = 3600) {
  return (_target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`

      const cached = await edgeCacheSystem.getData(cacheKey)
      if (cached !== null) {
        return cached
      }

      const result = await originalMethod.apply(this, args)
      await edgeCacheSystem.cacheData(cacheKey, result, ttl)
      return result
    }

    return descriptor
  }
}
