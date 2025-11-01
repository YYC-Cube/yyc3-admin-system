/**
 * @file 健康监控与评分系统
 * @description 采集运行时与API健康指标，计算健康分并触发告警
 * @module lib/monitoring/healthMonitor
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

export interface HealthMetrics {
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
    responseTime: number; // ms
    errorRate: number;    // 0~1
    throughput: number;   // req/min
  };
  database?: {
    connectionPool: number;
    queryPerformance: number;
    replicationLag: number;
  };
}

interface HealthScoreWeights {
  performance: number;      // 30%
  stability: number;        // 25%
  security: number;         // 20%
  maintainability: number;  // 15%
  efficiency: number;       // 10%
}

class HealthScoringSystem {
  private weights: HealthScoreWeights = {
    performance: 0.3,
    stability: 0.25,
    security: 0.2,
    maintainability: 0.15,
    efficiency: 0.1,
  };

  calculateHealthScore(metrics: HealthMetrics): number {
    const scores = {
      performance: this.calculatePerformanceScore(metrics),
      stability: this.calculateStabilityScore(metrics),
      security: this.calculateSecurityScore(metrics),
      maintainability: this.calculateMaintainabilityScore(metrics),
      efficiency: this.calculateEfficiencyScore(metrics),
    } as const;
    return (scores.performance * this.weights.performance)
      + (scores.stability * this.weights.stability)
      + (scores.security * this.weights.security)
      + (scores.maintainability * this.weights.maintainability)
      + (scores.efficiency * this.weights.efficiency);
  }

  private calculatePerformanceScore(metrics: HealthMetrics): number {
    const { apiHealth, memoryUsage } = metrics;
    let score = 10;
    if (apiHealth.responseTime > 1000) score -= 3;
    else if (apiHealth.responseTime > 500) score -= 2;
    else if (apiHealth.responseTime > 200) score -= 1;
    const memoryRatio = memoryUsage.heapUsed / Math.max(1, memoryUsage.heapTotal);
    if (memoryRatio > 0.9) score -= 3;
    else if (memoryRatio > 0.8) score -= 2;
    else if (memoryRatio > 0.7) score -= 1;
    return Math.max(0, score);
  }

  private calculateStabilityScore(metrics: HealthMetrics): number {
    let score = 10;
    if (metrics.eventLoop.lag > 500) score -= 3;
    else if (metrics.eventLoop.lag > 200) score -= 2;
    else if (metrics.eventLoop.lag > 100) score -= 1;
    return Math.max(0, score);
  }

  private calculateSecurityScore(_: HealthMetrics): number {
    return 8; // 预留安全评分，后续接入鉴权/输入验证
  }

  private calculateMaintainabilityScore(_: HealthMetrics): number {
    return 8; // 预留可维护性评分（lint/测试覆盖率）
  }

  private calculateEfficiencyScore(metrics: HealthMetrics): number {
    let score = 10;
    if (metrics.apiHealth.throughput > 100) score += 1; // 吞吐高
    return Math.min(10, score);
  }
}

interface ApiSpan {
  route: string;
  start: number;
  end(success: boolean): void;
}

class AlertDispatcher {
  sendAlert(message: string, context: Record<string, unknown>) {
    // TODO: 集成监控系统（Slack/邮件）
    if (process.env.NODE_ENV === 'development') {
      // 开发环境仅打印
      console.warn("[Alert]", message, context);
    }
  }
}

export class HealthMonitor {
  private static instance: HealthMonitor | null = null;
  private scoring = new HealthScoringSystem();
  private alert = new AlertDispatcher();

  private apiStats = {
    windowStart: Date.now(),
    windowMs: 60_000,
    reqCount: 0,
    errorCount: 0,
    totalResponseTime: 0,
  };

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) HealthMonitor.instance = new HealthMonitor();
    return HealthMonitor.instance;
  }

  startApiSpan(route: string): ApiSpan {
    const start = Date.now();
    return {
      route,
      start,
      end: (success: boolean) => {
        const duration = Date.now() - start;
        const now = Date.now();
        const w = this.apiStats;
        if (now - w.windowStart >= w.windowMs) {
          // 翻转窗口
          w.windowStart = now;
          w.reqCount = 0;
          w.errorCount = 0;
          w.totalResponseTime = 0;
        }
        w.reqCount += 1;
        w.totalResponseTime += duration;
        if (!success) w.errorCount += 1;

        // 计算健康分并告警（示例阈值）
        const metrics = this.collectMetrics(duration);
        const score = this.scoring.calculateHealthScore(metrics);
        if (score < 6) {
          this.alert.sendAlert("健康分偏低", { route, score, metrics });
        }
      },
    };
  }

  private collectMetrics(lastResponseTime: number): HealthMetrics {
    const mu = process.memoryUsage();
    const cpu = process.cpuUsage();
    // 粗略事件循环滞后（单次测量）
    const start = Date.now();
    let lag = 0;
    setImmediate(() => { lag = Date.now() - start; });

    const w = this.apiStats;
    const avgRt = w.reqCount ? w.totalResponseTime / w.reqCount : lastResponseTime;
    const errorRate = w.reqCount ? w.errorCount / w.reqCount : 0;
    const throughput = Math.round((w.reqCount * 60_000) / Math.max(1, (Date.now() - w.windowStart)));

    return {
      memoryUsage: {
        heapUsed: mu.heapUsed,
        heapTotal: mu.heapTotal,
        external: mu.external,
        rss: mu.rss,
      },
      cpuUsage: { user: cpu.user, system: cpu.system },
      eventLoop: { lag, utilization: 0.5 },
      apiHealth: { responseTime: avgRt, errorRate, throughput },
    };
  }

  getReport() {
    const metrics = this.collectMetrics(0);
    const score = this.scoring.calculateHealthScore(metrics);
    return { metrics, score };
  }

  /**
   * 发送健康告警（公共接口）
   * @param message 告警信息
   * @param context 上下文字段
   */
  notify(message: string, context: Record<string, unknown> = {}) {
    this.alert.sendAlert(message, context)
  }
}