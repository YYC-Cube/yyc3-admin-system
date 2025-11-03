'use client';

/**
 * @file 健康监控卡片组件
 * @description 调用 /api/health 显示运行时与 API 关键健康指标
 * @module components/HealthCard
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import React, { useEffect, useMemo, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  healthScore: number;
  metrics: {
    memoryUsage: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
    cpuUsage: {
      user: number;
      system: number;
    };
    eventLoop: {
      lag: number;
      utilization: number;
    };
    apiHealth: {
      responseTime: number;
      errorRate: number;
      throughput: number;
    };
  };
}

/**
 * @description 健康卡片 - 展示健康分与关键指标
 */
export const HealthCard: React.FC = () => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 轮询获取健康数据（每 10s）
  useEffect(() => {
    let mounted = true;
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' });
        if (!res.ok) throw new Error(`健康接口异常: ${res.status}`);
        const json = (await res.json()) as HealthResponse;
        if (mounted) {
          setData(json);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) setError(err?.message ?? String(err));
      }
    };
    fetchHealth();
    const id = setInterval(fetchHealth, 10_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const memRatio = useMemo(() => {
    if (!data) return 0;
    const { heapUsed, heapTotal } = data.metrics.memoryUsage;
    return heapTotal ? Math.min(100, Math.round((heapUsed / heapTotal) * 100)) : 0;
  }, [data]);

  const score = Math.round((data?.healthScore ?? 0) * 10) / 10; // 保留 1 位小数

  return (
    <Card
      data-slot="health-card"
      className="mt-6 bg-card/90 backdrop-blur-md border border-border/20 shadow-2xl"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">系统健康</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data && !error && <div className="text-sm text-muted-foreground">正在加载健康数据…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        {data && (
          <div className="space-y-3">
            {/* 健康分 */}
            <div>
              <div className="flex items-center justify-between mb-2 text-sm text-foreground">
                <span>健康分</span>
                <span className="font-medium">{score} / 10</span>
              </div>
              <Progress value={Math.min(100, Math.round((score / 10) * 100))} />
            </div>

            {/* 运行时内存与事件循环 */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted p-3 border border-border">
                <div className="text-muted-foreground">内存使用</div>
                <div className="mt-1 font-medium text-foreground">{memRatio}%</div>
              </div>
              <div className="rounded-lg bg-muted p-3 border border-border">
                <div className="text-muted-foreground">事件循环滞后</div>
                <div className="mt-1 font-medium text-foreground">
                  {Math.round(data.metrics.eventLoop.lag)} ms
                </div>
              </div>
            </div>

            {/* API 指标 */}
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-muted p-3 border border-border">
                <div className="text-muted-foreground">平均响应</div>
                <div className="mt-1 font-medium text-foreground">
                  {Math.round(data.metrics.apiHealth.responseTime)} ms
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3 border border-border">
                <div className="text-muted-foreground">错误率</div>
                <div className="mt-1 font-medium text-foreground">
                  {Math.round(data.metrics.apiHealth.errorRate * 100)}%
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3 border border-border">
                <div className="text-muted-foreground">吞吐</div>
                <div className="mt-1 font-medium text-foreground">
                  {data.metrics.apiHealth.throughput} req/min
                </div>
              </div>
            </div>

            {/* 时间戳 */}
            <div className="text-xs text-muted-foreground">
              更新时间：{new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
