#!/usr/bin/env node

/**
 * @file 性能监控脚本
 * @description 监控应用性能指标，检测性能瓶颈和异常
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置参数
const CONFIG = {
  outputPath: path.join(__dirname, '../reports'),
  alertPath: path.join(__dirname, '../alerts'),
  thresholds: {
    responseTime: 2000, // 2秒
    memoryUsage: 80, // 80%
    cpuUsage: 70, // 70%
    diskUsage: 85, // 85%
    errorRate: 5 // 5%
  },
  intervals: {
    healthCheck: 30000, // 30秒
    metrics: 60000 // 60秒
  }
};

// 确保输出目录存在
if (!fs.existsSync(CONFIG.outputPath)) {
  fs.mkdirSync(CONFIG.outputPath, { recursive: true });
}

if (!fs.existsSync(CONFIG.alertPath)) {
  fs.mkdirSync(CONFIG.alertPath, { recursive: true });
}

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      responseTime: [],
      memoryUsage: [],
      cpuUsage: [],
      diskUsage: [],
      errorCount: 0,
      requestCount: 0
    };
    this.alerts = [];
  }

  /**
   * 获取系统性能指标
   */
  getSystemMetrics() {
    try {
      // macOS兼容的内存检查
      let memoryInfo;
      try {
        memoryInfo = execSync('vm_stat | grep "Pages free" | awk \'{print $3}\' | sed \'s/\.//\'', { encoding: 'utf8' });
      } catch {
        // 回退到系统默认
        memoryInfo = '1000000';
      }
      
      // macOS兼容的CPU检查
      let cpuInfo;
      try {
        const topOutput = execSync('top -l 1 | grep "CPU usage"', { encoding: 'utf8' });
        const cpuMatch = topOutput.match(/(\d+\.?\d*)% user/);
        cpuInfo = cpuMatch ? cpuMatch[1] : '5.0';
      } catch {
        cpuInfo = '5.0';
      }
      
      // macOS兼容的磁盘检查
      const diskInfo = execSync('df -h / | awk \'NR==2{print $5}\' | sed \'s/%//\'', { encoding: 'utf8' });
      
      return {
        memory: parseFloat(memoryInfo.trim()) / 10000, // 简化计算
        cpu: parseFloat(cpuInfo.trim()),
        disk: parseInt(diskInfo.trim())
      };
    } catch (error) {
      console.error('❌ 获取系统指标失败:', error.message);
      // 返回默认值避免监控中断
      return {
        memory: 50.0,
        cpu: 10.0,
        disk: 60
      };
    }
  }

  /**
   * 检查Next.js应用健康状态
   */
  checkApplicationHealth() {
    try {
      const startTime = Date.now();
      const response = execSync('curl -s -o /dev/null -w "%{http_code}|%{time_total}" http://localhost:3000 || echo "000|0"', { encoding: 'utf8' });
      const [httpCode, responseTime] = response.trim().split('|');
      const statusCode = parseInt(httpCode);
      
      this.metrics.responseTime.push(parseFloat(responseTime));
      this.metrics.requestCount++;

      if (statusCode >= 400 || statusCode === 0) {
        this.metrics.errorCount++;
      }

      return {
        statusCode,
        responseTime: parseFloat(responseTime),
        isHealthy: statusCode === 200
      };
    } catch (error) {
      this.metrics.errorCount++;
      return {
        statusCode: 0,
        responseTime: 0,
        isHealthy: false,
        error: error.message
      };
    }
  }

  /**
   * 检查性能阈值
   */
  checkThresholds(metrics, health) {
    const alerts = [];

    if (metrics.memory > CONFIG.thresholds.memoryUsage) {
      alerts.push({
        type: 'memory',
        level: 'warning',
        message: `内存使用率过高: ${metrics.memory}%`,
        threshold: CONFIG.thresholds.memoryUsage
      });
    }

    if (metrics.cpu > CONFIG.thresholds.cpuUsage) {
      alerts.push({
        type: 'cpu',
        level: 'warning', 
        message: `CPU使用率过高: ${metrics.cpu}%`,
        threshold: CONFIG.thresholds.cpuUsage
      });
    }

    if (metrics.disk > CONFIG.thresholds.diskUsage) {
      alerts.push({
        type: 'disk',
        level: 'critical',
        message: `磁盘使用率过高: ${metrics.disk}%`,
        threshold: CONFIG.thresholds.diskUsage
      });
    }

    if (health.responseTime > CONFIG.thresholds.responseTime) {
      alerts.push({
        type: 'responseTime',
        level: 'warning',
        message: `响应时间过长: ${health.responseTime}ms`,
        threshold: CONFIG.thresholds.responseTime
      });
    }

    const errorRate = (this.metrics.errorCount / this.metrics.requestCount) * 100;
    if (errorRate > CONFIG.thresholds.errorRate) {
      alerts.push({
        type: 'errorRate',
        level: 'critical',
        message: `错误率过高: ${errorRate.toFixed(2)}%`,
        threshold: CONFIG.thresholds.errorRate
      });
    }

    return alerts;
  }

  /**
   * 保存监控报告
   */
  saveReport() {
    const report = {
      timestamp: this.metrics.timestamp,
      summary: {
        totalRequests: this.metrics.requestCount,
        errorCount: this.metrics.errorCount,
        errorRate: ((this.metrics.errorCount / this.metrics.requestCount) * 100).toFixed(2),
        avgResponseTime: this.metrics.responseTime.length > 0 
          ? (this.metrics.responseTime.reduce((a, b) => a + b, 0) / this.metrics.responseTime.length).toFixed(2)
          : 0
      },
      metrics: this.metrics,
      alerts: this.alerts
    };

    const filename = `performance-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(CONFIG.outputPath, filename);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    
    console.log(`📊 性能报告已保存: ${filename}`);
    return filepath;
  }

  /**
   * 发送告警
   */
  sendAlerts(alerts) {
    alerts.forEach(alert => {
      const alertFile = path.join(CONFIG.alertPath, `${alert.type}-${Date.now()}.json`);
      fs.writeFileSync(alertFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        ...alert
      }, null, 2));
      
      console.log(`🚨 告警: ${alert.message}`);
    });
  }

  /**
   * 监控循环
   */
  async monitor() {
    console.log('🔄 开始性能监控...');
    
    while (true) {
      try {
        // 获取系统指标
        const systemMetrics = this.getSystemMetrics();
        
        // 检查应用健康
        const health = this.checkApplicationHealth();
        
        if (systemMetrics) {
          this.metrics.memoryUsage.push(systemMetrics.memory);
          this.metrics.cpuUsage.push(systemMetrics.cpu);
          this.metrics.diskUsage.push(systemMetrics.disk);
          
          // 检查阈值
          const alerts = this.checkThresholds(systemMetrics, health);
          this.alerts.push(...alerts);
          
          if (alerts.length > 0) {
            this.sendAlerts(alerts);
          }
        }
        
        // 输出状态
        console.log(`📈 系统状态: 内存${systemMetrics?.memory?.toFixed(1) || 'N/A'}% | CPU${systemMetrics?.cpu?.toFixed(1) || 'N/A'}% | 响应${health.responseTime}ms`);
        
        // 等待下一个检查周期
        await new Promise(resolve => setTimeout(resolve, CONFIG.intervals.healthCheck));
        
      } catch (error) {
        console.error('❌ 监控循环错误:', error.message);
        await new Promise(resolve => setTimeout(resolve, CONFIG.intervals.healthCheck));
      }
    }
  }

  /**
   * 单次检查
   */
  async checkOnce() {
    console.log('🔍 执行单次性能检查...');
    
    const systemMetrics = this.getSystemMetrics();
    const health = this.checkApplicationHealth();
    
    if (systemMetrics) {
      this.metrics.memoryUsage.push(systemMetrics.memory);
      this.metrics.cpuUsage.push(systemMetrics.cpu);
      this.metrics.diskUsage.push(systemMetrics.disk);
      
      const alerts = this.checkThresholds(systemMetrics, health);
      this.alerts.push(...alerts);
      
      console.log('📊 检查结果:');
      console.log(`   内存使用: ${systemMetrics.memory}%`);
      console.log(`   CPU使用: ${systemMetrics.cpu}%`);
      console.log(`   磁盘使用: ${systemMetrics.disk}%`);
      console.log(`   响应时间: ${health.responseTime}ms`);
      console.log(`   应用状态: ${health.isHealthy ? '✅ 健康' : '❌ 不健康'}`);
      
      if (alerts.length > 0) {
        console.log('🚨 发现告警:');
        alerts.forEach(alert => {
          console.log(`   - ${alert.message}`);
        });
        this.sendAlerts(alerts);
      } else {
        console.log('✅ 系统运行正常');
      }
    }
    
    this.saveReport();
  }
}

// 主程序
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  const args = process.argv.slice(2);
  
  if (args.includes('--continuous') || args.includes('-c')) {
    monitor.monitor();
  } else {
    monitor.checkOnce();
  }
}

module.exports = PerformanceMonitor;