// Redis缓存层实现
import { createClient } from "redis"

class RedisCache {
  private client: ReturnType<typeof createClient> | null = null
  private isConnected = false

  async connect() {
    if (this.isConnected) return

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379",
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500),
        },
      })

      this.client.on("error", (err) => console.error("[v0] Redis Client Error", err))

      await this.client.connect()
      this.isConnected = true
      console.log("[v0] Redis connected successfully")
    } catch (error) {
      console.error("[v0] Redis connection failed:", error)
      // 降级到内存缓存
      this.client = null
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null

    try {
      const value = await this.client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("[v0] Redis get error:", error)
      return null
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.client) return false

    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        await this.client.setEx(key, ttl, serialized)
      } else {
        await this.client.set(key, serialized)
      }
      return true
    } catch (error) {
      console.error("[v0] Redis set error:", error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client) return false

    try {
      await this.client.del(key)
      return true
    } catch (error) {
      console.error("[v0] Redis del error:", error)
      return false
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    if (!this.client) return 0

    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(keys)
      }
      return keys.length
    } catch (error) {
      console.error("[v0] Redis invalidatePattern error:", error)
      return 0
    }
  }
}

export const redisCache = new RedisCache()
