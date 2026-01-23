/**
 * @file 性能监控初始化脚本
 * @description 自动启动性能监控，建立基线数据
 * @module monitoring
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

import { performanceMonitor } from './performance';
import { performanceBenchmark } from './benchmark';

export interface MonitoringConfig {
  enabled: boolean;
  baselineAutoEstablish: boolean;
  alertThresholds: {
    responseTime: number;
    memoryUsage: number;
    errorRate: number;
  };
  monitoringInterval: number; // 秒
}

export class MonitoringSystem {
  private static config: MonitoringConfig = {
    enabled: true,
    baselineAutoEstablish: true,
    alertThresholds: {
      responseTime: 3000,
      memoryUsage: 500,
      errorRate: 5
    },
    monitoringInterval: 30
  };

  /**
   * 初始化监控系统
   */
  public static async initialize(config?: Partial<MonitoringConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    console.log('🚀 初始化性能监控系统...');
    
    if (this.config.enabled) {
      // 更新告警阈值
      performanceMonitor.updateThresholds(this.config.alertThresholds);
      
      console.log('✅ 性能监控已启用');
      console.log(`📊 告警阈值 - 响应时间: ${this.config.alertThresholds.responseTime}ms`);
      console.log(`📊 告警阈值 - 内存使用: ${this.config.alertThresholds.memoryUsage}MB`);
      console.log(`📊 告警阈值 - 错误率: ${this.config.alertThresholds.errorRate}%`);

      // 自动建立基线数据
      if (this.config.baselineAutoEstablish) {
        console.log('🎯 自动建立性能基线...');
        try {
          await performanceBenchmark.establishBaseline();
          console.log('🎉 性能基线建立完成！');
        } catch (error) {
          console.error('❌ 建立性能基线失败:', error);
        }
      }

      // 生成初始报告
      this.generateInitialReport();
    } else {
      console.log('⚠️ 性能监控已禁用');
    }
  }

  /**
   * 生成初始性能报告
   */
  private static generateInitialReport(): void {
    const report = performanceMonitor.getPerformanceReport();
    const baseline = performanceBenchmark.getBaselineData();
    
    console.log('\n📈 === 初始性能报告 ===');
    console.log(`平均响应时间: ${report.averageResponseTime}ms`);
    console.log(`平均内存使用: ${report.averageMemoryUsage}MB`);
    console.log(`错误率: ${report.errorRate}%`);
    
    if (baseline && typeof baseline === 'object') {
      console.log('\n🎯 === 性能基线数据 ===');
      Object.entries(baseline).forEach(([key, value]) => {
        if (typeof value === 'number') {
          console.log(`${key}: ${value}ms`);
        }
      });
    }
    
    console.log('========================\n');
  }

  /**
   * 获取监控系统状态
   */
  public static getStatus(): {
    config: MonitoringConfig;
    isEnabled: boolean;
    baselineExists: boolean;
  } {
    const baseline = performanceBenchmark.getBaselineData();
    
    return {
      config: this.config,
      isEnabled: this.config.enabled,
      baselineExists: baseline !== null && Object.keys(baseline).length > 0
    };
  }

  /**
   * 更新配置
   */
  public static updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 监控系统配置已更新');
  }

  /**
   * 手动运行基准测试
   */
  public static async runBenchmark(): Promise<string> {
    console.log('🏃 手动运行性能基准测试...');
    await performanceBenchmark.establishBaseline();
    return performanceBenchmark.generateReport();
  }

  /**
   * 清理监控数据
   */
  public static cleanup(): void {
    performanceMonitor.cleanup();
    console.log('🧹 监控数据已清理');
  }
}

// 全局变量声明
declare global {
  var performanceBaseline: Record<string, any> | undefined;
  var monitoringSystemInitialized: boolean | undefined;
}

// 自动化初始化（仅在服务器环境中）
if (typeof window === 'undefined' && !global.monitoringSystemInitialized) {
  global.monitoringSystemInitialized = true;
  
  // 在Next.js服务器启动时自动初始化
  if (process.env.NODE_ENV === 'production' || process.env.MONITORING_ENABLED === 'true') {
    MonitoringSystem.initialize().catch(console.error);
  }
}