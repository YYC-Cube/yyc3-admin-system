#!/usr/bin/env node

/**
 * @file 综合监控主控脚本
 * @description 整合性能监控、错误监控和告警通知的统一监控中心
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const PerformanceMonitor = require('./performance-monitor.js');
const ErrorMonitor = require('./error-monitor.js');

// 配置参数
const CONFIG = {
  outputPath: path.join(__dirname, '../reports'),
  alertPath: path.join(__dirname, '../alerts'),
  dashboardPath: path.join(__dirname, '../reports/dashboard.html'),
  intervals: {
    performance: 60000, // 1分钟
    error: 300000,      // 5分钟
    dashboard: 300000   // 5分钟
  },
  thresholds: {
    performance: {
      memory: 80,
      cpu: 70,
      responseTime: 2000,
      errorRate: 5
    },
    errors: {
      hourlyLimit: 10,
      criticalLimit: 3
    }
  }
};

// 确保输出目录存在
if (!fs.existsSync(CONFIG.outputPath)) {
  fs.mkdirSync(CONFIG.outputPath, { recursive: true });
}

if (!fs.existsSync(CONFIG.alertPath)) {
  fs.mkdirSync(CONFIG.alertPath, { recursive: true });
}

class UnifiedMonitor {
  constructor() {
    this.performanceMonitor = new PerformanceMonitor();
    this.errorMonitor = new ErrorMonitor();
    this.isRunning = false;
    this.stats = {
      startTime: new Date(),
      checksPerformed: 0,
      alertsGenerated: 0,
      lastAlertTime: null
    };
    this.alerts = [];
    this.metrics = {
      performance: [],
      errors: []
    };
  }

  /**
   * 执行综合监控检查
   */
  async performCheck() {
    const checkId = Date.now();
    const checkTime = new Date().toISOString();
    
    console.log(`\n🔍 开始综合监控检查 (${checkId})...`);
    
    try {
      // 并行执行性能监控和错误监控
      const [performanceResult, errorResult] = await Promise.allSettled([
        this.checkPerformance(),
        this.checkErrors()
      ]);
      
      let performanceData = null;
      let errorData = null;
      
      if (performanceResult.status === 'fulfilled') {
        performanceData = performanceResult.value;
        this.metrics.performance.push(performanceData);
        console.log(`✅ 性能监控: ${performanceData.status}`);
      } else {
        console.log(`❌ 性能监控失败: ${performanceResult.reason?.message || '未知错误'}`);
      }
      
      if (errorResult.status === 'fulfilled') {
        errorData = errorResult.value;
        this.metrics.errors.push(errorData);
        console.log(`✅ 错误监控: ${errorData.status}`);
      } else {
        console.log(`❌ 错误监控失败: ${errorResult.reason?.message || '未知错误'}`);
      }
      
      // 综合分析和告警
      const globalAlerts = this.analyzeGlobalHealth(performanceData, errorData);
      
      // 发送告警
      if (globalAlerts.length > 0) {
        await this.sendGlobalAlerts(globalAlerts);
      }
      
      // 更新统计信息
      this.stats.checksPerformed++;
      
      // 生成仪表板
      await this.generateDashboard();
      
      return {
        checkId,
        timestamp: checkTime,
        performance: performanceData,
        errors: errorData,
        alerts: globalAlerts,
        overallStatus: this.determineOverallStatus(performanceData, errorData, globalAlerts)
      };
      
    } catch (error) {
      console.error(`❌ 综合监控检查失败:`, error);
      throw error;
    }
  }

  /**
   * 执行性能监控
   */
  async checkPerformance() {
    const startTime = Date.now();
    
    try {
      const systemMetrics = this.performanceMonitor.getSystemMetrics();
      const health = this.performanceMonitor.checkApplicationHealth();
      
      if (!systemMetrics) {
        return {
          status: 'failed',
          message: '无法获取系统指标',
          timestamp: new Date().toISOString()
        };
      }
      
      const alerts = this.performanceMonitor.checkThresholds(systemMetrics, health);
      const metrics = {
        timestamp: new Date().toISOString(),
        responseTime: health.responseTime,
        memory: systemMetrics.memory,
        cpu: systemMetrics.cpu,
        disk: systemMetrics.disk,
        statusCode: health.statusCode,
        isHealthy: health.isHealthy
      };
      
      return {
        status: health.isHealthy ? 'healthy' : 'unhealthy',
        metrics,
        alerts,
        duration: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * 执行错误监控
   */
  async checkErrors() {
    const startTime = Date.now();
    
    try {
      const result = await this.errorMonitor.monitor();
      
      return {
        status: result.status === 'healthy' ? 'healthy' : 'unhealthy',
        errorCount: result.errors,
        alertCount: result.alerts,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * 分析全局健康状况
   */
  analyzeGlobalHealth(performanceData, errorData) {
    const alerts = [];
    
    // 检查整体性能
    if (performanceData && performanceData.status === 'error') {
      alerts.push({
        type: 'performance_error',
        level: 'critical',
        message: '性能监控系统异常',
        timestamp: new Date().toISOString()
      });
    }
    
    // 检查错误监控
    if (errorData && errorData.status === 'error') {
      alerts.push({
        type: 'error_monitoring_error',
        level: 'critical',
        message: '错误监控系统异常',
        timestamp: new Date().toISOString()
      });
    }
    
    // 检查性能指标
    if (performanceData && performanceData.metrics) {
      const { metrics } = performanceData;
      
      if (metrics.memory > CONFIG.thresholds.performance.memory) {
        alerts.push({
          type: 'high_memory_usage',
          level: 'warning',
          message: `内存使用率过高: ${metrics.memory.toFixed(1)}%`,
          value: metrics.memory,
          threshold: CONFIG.thresholds.performance.memory,
          timestamp: new Date().toISOString()
        });
      }
      
      if (metrics.cpu > CONFIG.thresholds.performance.cpu) {
        alerts.push({
          type: 'high_cpu_usage',
          level: 'warning',
          message: `CPU使用率过高: ${metrics.cpu.toFixed(1)}%`,
          value: metrics.cpu,
          threshold: CONFIG.thresholds.performance.cpu,
          timestamp: new Date().toISOString()
        });
      }
      
      if (metrics.responseTime > CONFIG.thresholds.performance.responseTime) {
        alerts.push({
          type: 'slow_response',
          level: 'warning',
          message: `响应时间过长: ${metrics.responseTime}ms`,
          value: metrics.responseTime,
          threshold: CONFIG.thresholds.performance.responseTime,
          timestamp: new Date().toISOString()
        });
      }
      
      if (!metrics.isHealthy) {
        alerts.push({
          type: 'application_unhealthy',
          level: 'critical',
          message: `应用不健康 (HTTP ${metrics.statusCode})`,
          value: metrics.statusCode,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return alerts;
  }

  /**
   * 发送全局告警
   */
  async sendGlobalAlerts(alerts) {
    alerts.forEach(alert => {
      // 保存告警文件
      const alertFile = path.join(CONFIG.alertPath, `unified-${alert.type}-${Date.now()}.json`);
      fs.writeFileSync(alertFile, JSON.stringify(alert, null, 2));
      
      // 输出告警信息
      const levelEmoji = alert.level === 'critical' ? '🚨' : '⚠️';
      console.log(`${levelEmoji} 全局告警: ${alert.message}`);
      
      // 记录告警统计
      this.stats.alertsGenerated++;
      this.stats.lastAlertTime = new Date();
    });
    
    this.alerts.push(...alerts);
    
    // 保持告警历史在合理范围内
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  /**
   * 确定整体状态
   */
  determineOverallStatus(performanceData, errorData, alerts) {
    // 如果有关键告警，返回critical
    if (alerts.some(alert => alert.level === 'critical')) {
      return 'critical';
    }
    
    // 如果有警告告警，返回warning
    if (alerts.some(alert => alert.level === 'warning')) {
      return 'warning';
    }
    
    // 如果性能或错误监控有问题，返回unhealthy
    if ((performanceData && performanceData.status === 'error') ||
        (errorData && errorData.status === 'error')) {
      return 'unhealthy';
    }
    
    // 如果性能或应用不健康，返回degraded
    if ((performanceData && !performanceData.metrics?.isHealthy) ||
        (errorData && errorData.status === 'unhealthy')) {
      return 'degraded';
    }
    
    // 默认返回healthy
    return 'healthy';
  }

  /**
   * 生成监控仪表板
   */
  async generateDashboard() {
    const dashboard = this.createDashboardHTML();
    fs.writeFileSync(CONFIG.dashboardPath, dashboard);
    console.log(`📊 监控仪表板已更新: ${CONFIG.dashboardPath}`);
  }

  /**
   * 创建仪表板HTML
   */
  createDashboardHTML() {
    const latestPerformance = this.metrics.performance[this.metrics.performance.length - 1];
    const latestError = this.metrics.errors[this.metrics.errors.length - 1];
    const uptime = Math.floor((Date.now() - this.stats.startTime.getTime()) / 1000);
    
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 应用监控仪表板</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { 
            background: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header h1 { 
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .stats-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .stat-card { 
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        .stat-value { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 0.9em; }
        .healthy { color: #10b981; }
        .warning { color: #f59e0b; }
        .critical { color: #ef4444; }
        .degraded { color: #f97316; }
        .unhealthy { color: #dc2626; }
        .metrics-grid { 
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .metric-card { 
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        .metric-card h3 { color: #667eea; margin-bottom: 15px; }
        .metric-item { 
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .alerts-section { 
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        .alert-item { 
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .alert-critical { 
            background: #fef2f2; 
            border-left-color: #ef4444;
        }
        .alert-warning { 
            background: #fffbeb; 
            border-left-color: #f59e0b;
        }
        .alert-info { 
            background: #f0f9ff; 
            border-left-color: #3b82f6;
        }
        .refresh-info { 
            text-align: center;
            color: white;
            margin-top: 20px;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 应用监控仪表板</h1>
            <p>实时监控应用性能、错误和系统健康状况</p>
            <p>运行时间: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${uptime % 60}s</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value ${this.determineOverallStatus(latestPerformance, latestError, this.alerts).replace('healthy', 'healthy')}">${this.determineOverallStatus(latestPerformance, latestError, this.alerts).toUpperCase()}</div>
                <div class="stat-label">整体状态</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.stats.checksPerformed}</div>
                <div class="stat-label">检查次数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.stats.alertsGenerated}</div>
                <div class="stat-label">告警总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.metrics.performance.length}</div>
                <div class="stat-label">性能检查</div>
            </div>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>📊 性能指标</h3>
                ${latestPerformance ? `
                <div class="metric-item">
                    <span>响应时间</span>
                    <span>${latestPerformance.metrics?.responseTime || 'N/A'}ms</span>
                </div>
                <div class="metric-item">
                    <span>内存使用</span>
                    <span>${(latestPerformance.metrics?.memory || 0).toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span>CPU使用</span>
                    <span>${(latestPerformance.metrics?.cpu || 0).toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span>磁盘使用</span>
                    <span>${(latestPerformance.metrics?.disk || 0).toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span>HTTP状态</span>
                    <span>${latestPerformance.metrics?.statusCode || 'N/A'}</span>
                </div>
                ` : '<p>暂无性能数据</p>'}
            </div>
            
            <div class="metric-card">
                <h3>🔍 错误监控</h3>
                ${latestError ? `
                <div class="metric-item">
                    <span>状态</span>
                    <span>${latestError.status}</span>
                </div>
                <div class="metric-item">
                    <span>错误数量</span>
                    <span>${latestError.errorCount || 0}</span>
                </div>
                <div class="metric-item">
                    <span>告警数量</span>
                    <span>${latestError.alertCount || 0}</span>
                </div>
                ` : '<p>暂无错误数据</p>'}
            </div>
        </div>
        
        <div class="alerts-section">
            <h3>🚨 最新告警</h3>
            ${this.alerts.slice(-10).map(alert => `
            <div class="alert-item alert-${alert.level}">
                <strong>${alert.type}</strong>: ${alert.message}
                <br><small>${new Date(alert.timestamp).toLocaleString()}</small>
            </div>
            `).join('') || '<p>暂无告警</p>'}
        </div>
        
        <div class="refresh-info">
            仪表板将每5分钟自动刷新 | 最后更新: ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
    `.trim();
  }

  /**
   * 启动持续监控
   */
  async startContinuousMonitoring() {
    this.isRunning = true;
    console.log('🚀 启动持续监控模式...');
    console.log(`📊 仪表板路径: ${CONFIG.dashboardPath}`);
    
    while (this.isRunning) {
      try {
        await this.performCheck();
        console.log(`⏰ 等待 ${CONFIG.intervals.performance / 1000} 秒后进行下一次检查...`);
        await new Promise(resolve => setTimeout(resolve, CONFIG.intervals.performance));
      } catch (error) {
        console.error('❌ 监控循环错误:', error.message);
        await new Promise(resolve => setTimeout(resolve, CONFIG.intervals.performance));
      }
    }
  }

  /**
   * 停止监控
   */
  stop() {
    this.isRunning = false;
    console.log('🛑 监控已停止');
  }
}

// 主程序
if (require.main === module) {
  const monitor = new UnifiedMonitor();
  const args = process.argv.slice(2);
  
  if (args.includes('--continuous') || args.includes('-c')) {
    // 持续监控模式
    monitor.startContinuousMonitoring().catch(error => {
      console.error('💥 监控启动失败:', error);
      process.exit(1);
    });
    
    // 优雅关闭
    process.on('SIGINT', () => {
      console.log('\n🛑 收到停止信号，正在关闭监控...');
      monitor.stop();
      process.exit(0);
    });
    
  } else {
    // 单次检查模式
    monitor.performCheck()
      .then(result => {
        console.log(`\n📊 综合监控完成:`);
        console.log(`   整体状态: ${result.overallStatus}`);
        console.log(`   性能监控: ${result.performance?.status || 'N/A'}`);
        console.log(`   错误监控: ${result.errors?.status || 'N/A'}`);
        console.log(`   告警数量: ${result.alerts.length}`);
        console.log(`   仪表板: ${CONFIG.dashboardPath}`);
        process.exit(result.overallStatus === 'healthy' ? 0 : 1);
      })
      .catch(error => {
        console.error('💥 监控检查失败:', error);
        process.exit(1);
      });
  }
}

module.exports = UnifiedMonitor;