import { kv } from "@vercel/kv"

// 缓存策略枚举
export enum CacheStrategy {
  LRU = "lru", // 最近最少使用
  LFU = "lfu", // 最不经常使用
  FIFO = "fifo", // 先进先出
  TTL = "ttl", // 基于时间
}

// 缓存指标接口
export interface CacheMetrics {
  hits: number
  misses: number
  hitRate: number
  totalRequests: number
  avgResponseTime: number
  cacheSize: number
  evictions: number
}

// 缓存配置接口
export interface CacheConfig {
  maxSize: number // 最大缓存大小(MB)
  defaultTTL: number // 默认过期时间(秒)
  strategy: CacheStrategy
  enableCompression: boolean
  enablePrefetch: boolean
}

// 边缘缓存系统类
export class EdgeCacheSystem {
  private config: CacheConfig
  private metrics: CacheMetrics
  private cacheKeys: Set<string>

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100, // 100MB
      defaultTTL: 3600, // 1小时
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

  /**
   * 智能缓存数据
   */
  async cacheData(
    key: string,
    data: any,
    ttl: number = this.config.defaultTTL,
    strategy: CacheStrategy = this.config.strategy,
  ): Promise<void> {
    try {
      // 数据压缩
      const cachedData = this.config.enableCompression ? this.compressData(data) : data

      // 添加元数据
      const cacheEntry = {
        data: cachedData,
        timestamp: Date.now(),
        ttl,
        strategy,
        accessCount: 0,
        lastAccess: Date.now(),
      }

      // 存储到边缘KV
      await kv.set(key, cacheEntry, { ex: ttl })
      this.cacheKeys.add(key)

      // 更新缓存大小
      this.updateCacheSize()
    } catch (error) {
      console.error("[EdgeCache] 缓存失败:", error)
      throw error
    }
  }

  /**
   * 获取缓存数据
   */
  async getData(key: string): Promise<any | null> {
    const startTime = Date.now()
    this.metrics.totalRequests++

    try {
      const cacheEntry = await kv.get(key)

      if (cacheEntry) {
        // 缓存命中
        this.metrics.hits++

        // 更新访问信息
        await this.updateAccessInfo(key, cacheEntry as any)

        // 解压数据
        const data = this.config.enableCompression
          ? this.decompressData((cacheEntry as any).data)
          : (cacheEntry as any).data

        this.updateMetrics(Date.now() - startTime)
        return data
      } else {
        // 缓存未命中
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

  /**
   * 缓存预热
   */
  async warmupCache(predictedRequests: Array<{ key: string; fetcher: () => Promise<any> }>): Promise<void> {
    if (!this.config.enablePrefetch) {
      return
    }

    console.log("[EdgeCache] 开始缓存预热...")

    const warmupPromises = predictedRequests.map(async ({ key, fetcher }) => {
      try {
        // 检查是否已缓存
        const cached = await this.getData(key)
        if (cached) {
          return
        }

        // 获取数据并缓存
        const data = await fetcher()
        await this.cacheData(key, data)
      } catch (error) {
        console.error(`[EdgeCache] 预热失败 ${key}:`, error)
      }
    })

    await Promise.all(warmupPromises)
    console.log("[EdgeCache] 缓存预热完成")
  }

  /**
   * 缓存失效
   */
  async invalidateCache(pattern: string): Promise<number> {
    try {
      let invalidatedCount = 0

      // 支持通配符匹配
      const regex = new RegExp(pattern.replace(/\*/g, ".*"))

      for (const key of this.cacheKeys) {
        if (regex.test(key)) {
          await kv.del(key)
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

  /**
   * 获取缓存指标
   */
  getCacheMetrics(): CacheMetrics {
    // 计算命中率
    this.metrics.hitRate = this.metrics.totalRequests > 0 ? (this.metrics.hits / this.metrics.totalRequests) * 100 : 0

    return { ...this.metrics }
  }

  /**
   * 清空所有缓存
   */
  async clearAll(): Promise<void> {
    try {
      for (const key of this.cacheKeys) {
        await kv.del(key)
      }
      this.cacheKeys.clear()
      this.resetMetrics()
      console.log("[EdgeCache] 已清空所有缓存")
    } catch (error) {
      console.error("[EdgeCache] 清空缓存失败:", error)
      throw error
    }
  }

  /**
   * 数据压缩
   */
  private compressData(data: any): string {
    // 简单的JSON字符串化
    // 生产环境可使用 lz-string 等压缩库
    return JSON.stringify(data)
  }

  /**
   * 数据解压
   */
  private decompressData(compressedData: string): any {
    return JSON.parse(compressedData)
  }

  /**
   * 更新访问信息
   */
  private async updateAccessInfo(key: string, cacheEntry: any): Promise<void> {
    cacheEntry.accessCount++
    cacheEntry.lastAccess = Date.now()

    // 更新缓存条目
    await kv.set(key, cacheEntry, { ex: cacheEntry.ttl })
  }

  /**
   * 更新缓存大小
   */
  private updateCacheSize(): void {
    // 估算缓存大小
    this.metrics.cacheSize = this.cacheKeys.size
  }

  /**
   * 更新指标
   */
  private updateMetrics(responseTime: number): void {
    // 更新平均响应时间
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime * (this.metrics.totalRequests - 1) + responseTime) / this.metrics.totalRequests
  }

  /**
   * 重置指标
   */
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

// 创建全局实例
export const edgeCacheSystem = new EdgeCacheSystem({
  maxSize: 100,
  defaultTTL: 3600,
  strategy: CacheStrategy.LRU,
  enableCompression: true,
  enablePrefetch: true,
})

// 缓存装饰器
export function Cacheable(ttl = 3600) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`

      // 尝试从缓存获取
      const cached = await edgeCacheSystem.getData(cacheKey)
      if (cached !== null) {
        return cached
      }

      // 执行原方法
      const result = await originalMethod.apply(this, args)

      // 缓存结果
      await edgeCacheSystem.cacheData(cacheKey, result, ttl)

      return result
    }

    return descriptor
  }
}
