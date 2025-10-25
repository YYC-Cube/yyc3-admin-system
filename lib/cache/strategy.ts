import { redisCache } from "./redis"

export interface CacheOptions {
  ttl?: number // 缓存时间（秒）
  tags?: string[] // 缓存标签，用于批量失效
  revalidate?: number // Next.js revalidate时间
}

// 缓存装饰器
export function withCache<T>(key: string | ((...args: any[]) => string), options: CacheOptions = {}) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = typeof key === "function" ? key(...args) : key

      // 1. 尝试从Redis获取
      const cached = await redisCache.get<T>(cacheKey)
      if (cached) {
        console.log("[v0] Cache hit:", cacheKey)
        return cached
      }

      // 2. 缓存未命中，执行原方法
      console.log("[v0] Cache miss:", cacheKey)
      const result = await originalMethod.apply(this, args)

      // 3. 存入Redis
      await redisCache.set(cacheKey, result, options.ttl)

      return result
    }

    return descriptor
  }
}

// 缓存失效工具
export async function invalidateCache(pattern: string) {
  return await redisCache.invalidatePattern(pattern)
}

// 预热缓存
export async function warmupCache(key: string, fetcher: () => Promise<any>, ttl?: number) {
  const data = await fetcher()
  await redisCache.set(key, data, ttl)
  return data
}
