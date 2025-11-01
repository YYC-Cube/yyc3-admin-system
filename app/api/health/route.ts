/**
 * @file 健康检查路由
 * @description 提供服务就绪探针与健康指标输出（运行时、API健康分）
 * @module api/health
 * @author YYC
 * @version 1.1.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { environmentConfig } from '../../../config/environment';
import { HealthMonitor } from '../../../lib/monitoring/healthMonitor';

/**
 * 就绪 + 健康指标输出
 * - 返回当前时间与服务状态
 * - 输出运行时健康指标与健康分，便于监控集成与排查
 */
export async function GET(_req: NextRequest) {
  // 可选：接入 HealthMonitor 记录跨度
  const span = HealthMonitor.getInstance().startApiSpan('api/health');
  try {
    const { metrics, score } = HealthMonitor.getInstance().getReport();
    const payload = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      metrics,
      healthScore: score,
      config: {
        api: environmentConfig.api,
      },
    };
    span.end(true);
    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    span.end(false);
    return NextResponse.json({ status: 'error', message: (error as any)?.message ?? 'unknown' }, { status: 500 });
  }
}
