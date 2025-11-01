/**
 * @file 简易速率限制与并发控制
 * @description 基于 IP 的滑动窗口计数与并发信号量，用于 API 层保护
 * @module lib/rateLimiter
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { environmentConfig } from "../config/environment";

interface Bucket {
  timestamps: number[]; // 该 IP 的请求时间戳
  running: number; // 该 IP 当前并发数
}

interface GlobalState {
  buckets: Map<string, Bucket>;
  totalRunning: number;
}

const globalKey = "__ETC_RATE_LIMITER__" as const;

const state: GlobalState = (globalThis as any)[globalKey] ?? {
  buckets: new Map<string, Bucket>(),
  totalRunning: 0,
};

(globalThis as any)[globalKey] = state;

function now() {
  return Date.now();
}

function getBucket(ip: string): Bucket {
  let b = state.buckets.get(ip);
  if (!b) {
    b = { timestamps: [], running: 0 };
    state.buckets.set(ip, b);
  }
  return b;
}

/**
 * @description 检查速率限制是否超限
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const { windowMs, maxPerIp } = environmentConfig.api.rateLimit;
  const b = getBucket(ip);
  const cutoff = now() - windowMs;
  b.timestamps = b.timestamps.filter((t) => t >= cutoff);
  if (b.timestamps.length >= maxPerIp) {
    return { allowed: false, remaining: 0 };
  }
  b.timestamps.push(now());
  return { allowed: true, remaining: Math.max(0, maxPerIp - b.timestamps.length) };
}

/**
 * @description 尝试获取并发许可
 */
export function acquire(ip: string): boolean {
  const { maxPerIp, maxTotal } = environmentConfig.api.concurrency;
  const b = getBucket(ip);
  if (b.running >= maxPerIp) return false;
  if (state.totalRunning >= maxTotal) return false;
  b.running += 1;
  state.totalRunning += 1;
  return true;
}

/**
 * @description 释放并发许可
 */
export function release(ip: string) {
  const b = getBucket(ip);
  if (b.running > 0) b.running -= 1;
  if (state.totalRunning > 0) state.totalRunning -= 1;
}

/**
 * @description 获取当前并发状态（用于监控）
 */
export function getStatus() {
  return {
    totalRunning: state.totalRunning,
    buckets: Array.from(state.buckets.entries()).map(([ip, b]) => ({ ip, running: b.running, count: b.timestamps.length })),
  };
}
