/**
 * @file redis.ts
 * @description Redis 缓存层实现 - 支持密码认证 + 降级策略
 * @module cache
 * @author YYC³
 * @version 2.0.0
 * @created 2025-01-19
 * @updated 2026-05-23
 */

import { createClient } from "redis"

class RedisCache {
  private client: ReturnType<typeof createClient> | null = null
  private isConnected = false
  private memoryFallback = new Map<string, { value: string; expiresAt: number }>()

  async connect() {
    if (this.isConnected) return

    try {
      const url = process.env.REDIS_URL || "redis://localhost:6379"
      const password = process.env.REDIS_PASSWORD

      const clientConfig: Record<string, unknown> = {
        url,
        socket: {
          reconnectStrategy: (retries: number) => Math.min(retries * 50, 500),
        },
      }

      if (password) {
        clientConfig.password = password
      }

      this.client = createClient(clientConfig as Parameters<typeof createClient>[0])

      this.client.on("error", (err: Error) => console.error("[Redis] Client Error:", err.message))
      this.client.on("connect", () => {
        this.isConnected = true
        console.log("[Redis] Connected successfully")
      })
      this.client.on("disconnect", () => {
        this.isConnected = false
        console.warn("[Redis] Disconnected, using memory fallback")
      })

      await this.client.connect()
    } catch (error) {
      console.error("[Redis] Connection failed, using memory fallback:", error instanceof Error ? error.message : String(error))
      this.client = null
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.client && this.isConnected) {
      try {
        const value = await this.client.get(key)
        return value ? JSON.parse(value) : null
      } catch (error) {
        console.error("[Redis] get error:", error instanceof Error ? error.message : String(error))
      }
    }

    const fallback = this.memoryFallback.get(key)
    if (fallback) {
      if (fallback.expiresAt > Date.now()) {
        return JSON.parse(fallback.value)
      }
      this.memoryFallback.delete(key)
    }
    return null
  }

  async set(key: string, value: unknown, ttl?: number): Promise<boolean> {
    const serialized = JSON.stringify(value)

    if (this.client && this.isConnected) {
      try {
        if (ttl) {
          await this.client.setEx(key, ttl, serialized)
        } else {
          await this.client.set(key, serialized)
        }
        return true
      } catch (error) {
        console.error("[Redis] set error:", error instanceof Error ? error.message : String(error))
      }
    }

    this.memoryFallback.set(key, {
      value: serialized,
      expiresAt: ttl ? Date.now() + ttl * 1000 : Number.MAX_SAFE_INTEGER,
    })
    return true
  }

  async del(key: string): Promise<boolean> {
    if (this.client && this.isConnected) {
      try {
        await this.client.del(key)
      } catch (error) {
        console.error("[Redis] del error:", error instanceof Error ? error.message : String(error))
      }
    }

    this.memoryFallback.delete(key)
    return true
  }

  async invalidatePattern(pattern: string): Promise<number> {
    let count = 0

    if (this.client && this.isConnected) {
      try {
        const keys = await this.client.keys(pattern)
        if (keys.length > 0) {
          await this.client.del(keys)
          count += keys.length
        }
      } catch (error) {
        console.error("[Redis] invalidatePattern error:", error instanceof Error ? error.message : String(error))
      }
    }

    const regex = new RegExp(pattern.replace(/\*/g, ".*"))
    for (const key of this.memoryFallback.keys()) {
      if (regex.test(key)) {
        this.memoryFallback.delete(key)
        count++
      }
    }

    return count
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client || !this.isConnected) return false
    try {
      const result = await this.client.ping()
      return result === "PONG"
    } catch {
      return false
    }
  }

  getStats() {
    return {
      isConnected: this.isConnected,
      memoryFallbackSize: this.memoryFallback.size,
    }
  }
}

export const redisCache = new RedisCache()
