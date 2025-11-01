/**
 * @file 缓存服务（Redis 优先，内存兜底）
 * @author YYC
 */

import crypto from "node:crypto";

export interface CacheEntry {
  value: string;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry>();
  async get(key: string): Promise<string | null> {
    const e = this.store.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e.value;
  }
  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
  }
}

export class CacheService {
  private static instance: CacheService;
  private mem = new MemoryCache();
  private redis: any | null = null;

  static getInstance(): CacheService {
    if (!this.instance) this.instance = new CacheService();
    return this.instance;
  }

  private constructor() {
    const url = process.env.REDIS_URL;
    if (url) {
      try {
        // 动态导入，避免在无 Redis 时影响运行
         
        const IORedis = require("ioredis");
        this.redis = new IORedis(url);
      } catch (e) {
        this.redis = null;
      }
    }
  }

  hashKey(buffer: Buffer, from: string | null | undefined, to: string, options?: Record<string, unknown>): string {
    const h = crypto.createHash("sha256");
    h.update(buffer);
    h.update(String(from ?? ""));
    h.update(String(to));
    h.update(JSON.stringify(options ?? {}));
    return `conv:${h.digest("hex")}`;
  }

  async get(key: string): Promise<string | null> {
    if (this.redis) {
      try {
        const v = await this.redis.get(key);
        return v ?? null;
      } catch {
        return this.mem.get(key);
      }
    }
    return this.mem.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(key, value, "EX", ttlSeconds);
        return;
      } catch {
        // 失败则回落内存
      }
    }
    await this.mem.set(key, value, ttlSeconds);
  }
}
