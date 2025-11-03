/**
 * @file 任务进度查询 API（轻限流防过度轮询）
 * @module api/tasks/[id]
 * @author YYC
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { HealthMonitor } from '../../../../lib/monitoring/healthMonitor';
import { GlobalTaskQueue } from '../../../../lib/queue/taskQueue';

export const runtime = 'nodejs';

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'local'
  );
}

// 每IP最小轮询间隔（毫秒）——避免高频轮询导致压力
const MIN_POLL_INTERVAL_MS = 500;
const lastPollByIp = new Map<string, number>();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const ip = getIp(request);
  const now = Date.now();
  const last = lastPollByIp.get(ip) ?? 0;
  if (now - last < MIN_POLL_INTERVAL_MS) {
    const retrySec = Math.ceil(MIN_POLL_INTERVAL_MS / 1000);
    return NextResponse.json(
      {
        error: 'PollTooFrequent',
        message: `请降低轮询频率（≥${MIN_POLL_INTERVAL_MS}ms）`,
        retryAfterMs: MIN_POLL_INTERVAL_MS,
      },
      { status: 429, headers: { 'Retry-After': String(retrySec) } }
    );
  }
  lastPollByIp.set(ip, now);

  const span = HealthMonitor.getInstance().startApiSpan('tasks/progress');

  try {
    const prog = GlobalTaskQueue.getProgress(params.id);
    if (!prog) {
      span.end(false);
      return NextResponse.json({ error: 'NotFound' }, { status: 404 });
    }

    // 根据队列拥挤度计算建议轮询间隔（毫秒），加入少量抖动
    const queueSize = GlobalTaskQueue.getQueueSize();
    const softLimit = GlobalTaskQueue.getSoftLimit();
    const running = GlobalTaskQueue.getRunningCount();
    const maxTotal = GlobalTaskQueue.getMaxTotal();
    const baseSuggested = 800; // 与前端初始轮询间隔对齐
    const qFactor = Math.min(queueSize / Math.max(softLimit, 1), 1.5); // 队列拥挤度上限 1.5
    const rFactor = Math.min(running / Math.max(maxTotal, 1), 1.0); // 运行饱和度上限 1.0
    const factor = 1 + 0.8 * qFactor + 0.7 * rFactor; // 组合权重
    const jitter = Math.random() * 0.25 - 0.1; // -10% ~ +15% 抖动
    const suggestedMs = Math.round(baseSuggested * factor * (1 + jitter));
    const clampedMs = Math.max(800, Math.min(suggestedMs, 2000)); // 限制在 800-2000ms

    span.end(true);
    return NextResponse.json({ ...prog, retryAfterMs: clampedMs }, { status: 200 });
  } catch (error: any) {
    span.end(false);
    return NextResponse.json(
      { error: 'ProgressFailed', message: error?.message ?? String(error) },
      { status: 400 }
    );
  }
}
