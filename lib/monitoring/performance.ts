/**
 * @file 性能监控系统
 * @description 实时性能监控、告警和基线管理
 * @module monitoring
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

interface PerformanceMetrics {
  url: string;
  responseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: NodeJS.CpuUsage;
  timestamp: number;
  statusCode?: number;
  error?: string;
}

interface AlertThresholds {
  responseTime: number; // ms
  memoryUsage: number; // MB
  errorRate: number; // percentage
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metricsHistory: PerformanceMetrics[] = [];
  private alertThresholds: AlertThresholds = {
    responseTime: 3000, // 3秒
    memoryUsage: 500, // 500MB
    errorRate: 5 // 5%
  };

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * 开始监控
   */
  private startMonitoring(): void {
    // 每30秒收集一次系统指标
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
  }

  /**
   * 收集系统性能指标
   */
  private collectSystemMetrics(): void {
    const metrics: PerformanceMetrics = {
      url: 'system',
      responseTime: 0,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: Date.now()
    };

    this.metricsHistory.push(metrics);

    // 保持最近100条记录
    if (this.metricsHistory.length > 100) {
      this.metricsHistory.shift();
    }

    this.checkAlerts(metrics);
  }

  /**
   * 测量API响应时间
   */
  public async measureApiCall(
    url: string, 
    fetcher: () => Promise<any>
  ): Promise<any> {
    const startTime = Date.now();
    const startCpuUsage = process.cpuUsage();

    try {
      const result = await fetcher();
      const endTime = Date.now();
      const endCpuUsage = process.cpuUsage(startCpuUsage);

      const metrics: PerformanceMetrics = {
        url,
        responseTime: endTime - startTime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: endCpuUsage,
        timestamp: Date.now(),
        statusCode: 200
      };

      this.metricsHistory.push(metrics);
      this.checkAlerts(metrics);

      return result;
    } catch (error) {
      const endTime = Date.now();
      const metrics: PerformanceMetrics = {
        url,
        responseTime: endTime - startTime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        timestamp: Date.now(),
        statusCode: 500,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      this.metricsHistory.push(metrics);
      this.checkAlerts(metrics);

      throw error;
    }
  }

  /**
   * 检查告警条件
   */
  private checkAlerts(metrics: PerformanceMetrics): void {
    const alerts: string[] = [];

    if (metrics.responseTime > this.alertThresholds.responseTime) {
      alerts.push(`响应时间过高: ${metrics.responseTime}ms`);
    }

    if (metrics.memoryUsage.heapUsed > this.alertThresholds.memoryUsage * 1024 * 1024) {
      alerts.push(`内存使用过高: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    }

    // 检查最近5分钟的错误率
    const recentMetrics = this.metricsHistory.filter(
      m => Date.now() - m.timestamp < 5 * 60 * 1000
    );
    
    const errorCount = recentMetrics.filter(m => m.statusCode && m.statusCode >= 400).length;
    const errorRate = (errorCount / recentMetrics.length) * 100;

    if (errorRate > this.alertThresholds.errorRate) {
      alerts.push(`错误率过高: ${errorRate.toFixed(2)}%`);
    }

    if (alerts.length > 0) {
      this.sendAlerts(alerts);
    }
  }

  /**
   * 发送告警
   */
  private sendAlerts(alerts: string[]): void {
    console.warn('🚨 [性能告警]', alerts.join(', '));
    
    // 这里可以集成实际的告警服务，如：
    // - Sentry
    // - DataDog
    // - PagerDuty
    // - Slack
  }

  /**
   * 获取性能报告
   */
  public getPerformanceReport(): {
    averageResponseTime: number;
    averageMemoryUsage: number;
    errorRate: number;
    recentMetrics: PerformanceMetrics[];
  } {
    const recentMetrics = this.metricsHistory.slice(-20);
    
    const averageResponseTime = recentMetrics
      .filter(m => m.responseTime > 0)
      .reduce((sum, m) => sum + m.responseTime, 0) / 
      recentMetrics.filter(m => m.responseTime > 0).length || 0;

    const averageMemoryUsage = recentMetrics
      .reduce((sum, m) => sum + m.memoryUsage.heapUsed, 0) / 
      recentMetrics.length;

    const errorCount = recentMetrics.filter(m => m.statusCode && m.statusCode >= 400).length;
    const errorRate = (errorCount / recentMetrics.length) * 100;

    return {
      averageResponseTime: Math.round(averageResponseTime),
      averageMemoryUsage: Math.round(averageMemoryUsage / 1024 / 1024),
      errorRate: Math.round(errorRate * 100) / 100,
      recentMetrics
    };
  }

  /**
   * 更新告警阈值
   */
  public updateThresholds(thresholds: Partial<AlertThresholds>): void {
    this.alertThresholds = { ...this.alertThresholds, ...thresholds };
  }

  /**
   * 清理历史数据
   */
  public cleanup(): void {
    this.metricsHistory = [];
  }
}

// 全局实例
export const performanceMonitor = PerformanceMonitor.getInstance();