/**
 * @file 速率限制与并发控制测试
 * @description 覆盖窗口计数与并发许可逻辑的核心路径
 * @author YYC
 * @created 2025-10-31
 */

import { describe, it, expect } from "vitest";

import { checkRateLimit, acquire, release, getStatus } from "./rateLimiter";

function flushIp(ip: string) {
  // 释放可能残留的并发占用
  release(ip);
  release(ip);
  release(ip);
}

describe("rateLimiter", () => {
  it("should allow under window limit and track remaining", () => {
    const ip = "1.2.3.4";
    flushIp(ip);
    const r1 = checkRateLimit(ip);
    expect(r1.allowed).toBe(true);
    const r2 = checkRateLimit(ip);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBeGreaterThanOrEqual(0);
  });

  it("should enforce per-ip concurrency", () => {
    const ip = "5.6.7.8";
    flushIp(ip);
    const a1 = acquire(ip);
    const a2 = acquire(ip);
    const a3 = acquire(ip); // 默认 ip 并发上限为 2
    expect(a1).toBe(true);
    expect(a2).toBe(true);
    expect(a3).toBe(false);
    release(ip);
    const a4 = acquire(ip);
    expect(a4).toBe(true);
  });

  it("should reflect total running in status", () => {
    const ip = "9.9.9.9";
    flushIp(ip);
    const ok = acquire(ip);
    expect(ok).toBe(true);
    const status = getStatus();
    expect(status.totalRunning).toBeGreaterThanOrEqual(1);
    release(ip);
  });
});
