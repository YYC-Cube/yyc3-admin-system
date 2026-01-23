#!/usr/bin/env node

/**
 * @file 错误监控脚本
 * @description 监控应用错误、异常和崩溃情况
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
  logPath: path.join(__dirname, '../../logs'),
  thresholds: {
    errorCount: 10, // 10个错误/小时
    criticalErrors: 3, // 3个严重错误
    crashCount: 1, // 1次崩溃
    logSize: 100 * 1024 * 1024 // 100MB
  }
};

// 确保输出目录存在
if (!fs.existsSync(CONFIG.outputPath)) {
  fs.mkdirSync(CONFIG.outputPath, { recursive: true });
}

if (!fs.existsSync(CONFIG.alertPath)) {
  fs.mkdirSync(CONFIG.alertPath, { recursive: true });
}

class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.logs = [];
    this.alerts = [];
  }

  /**
   * 解析Next.js日志文件
   */
  parseLogFiles() {
    const logFiles = [
      path.join(CONFIG.logPath, 'error.log'),
      path.join(CONFIG.logPath, 'combined.log'),
      path.join(__dirname, '../../.next/trace')
    ];

    const errors = [];

    logFiles.forEach(logFile => {
      if (fs.existsSync(logFile)) {
        try {
          const logContent = fs.readFileSync(logFile, 'utf8');
          const logLines = logContent.split('\n').filter(line => line.trim());
          
          logLines.forEach(line => {
            if (this.isErrorLine(line)) {
              errors.push(this.parseErrorLine(line, logFile));
            }
          });
        } catch (error) {
          console.log(`⚠️ 读取日志文件失败: ${logFile}`);
        }
      }
    });

    return errors;
  }

  /**
   * 判断是否为错误行
   */
  isErrorLine(line) {
    const errorPatterns = [
      'Error:',
      'ERROR:',
      'error:',
      'Unhandled',
      'TypeError:',
      'ReferenceError:',
      'SyntaxError:',
      '404',
      '500',
      'Failed to fetch',
      'Network Error'
    ];
    
    return errorPatterns.some(pattern => line.includes(pattern));
  }

  /**
   * 解析错误行
   */
  parseErrorLine(line, logFile) {
    const timestamp = new Date().toISOString();
    let errorType = 'unknown';
    let errorMessage = line;
    let stack = '';
    
    // 提取错误类型
    if (line.includes('TypeError:')) errorType = 'TypeError';
    else if (line.includes('ReferenceError:')) errorType = 'ReferenceError';
    else if (line.includes('SyntaxError:')) errorType = 'SyntaxError';
    else if (line.includes('Error:')) errorType = 'Error';
    
    // 提取错误消息
    if (line.includes(':')) {
      const parts = line.split(':');
      if (parts.length > 1) {
        errorMessage = parts.slice(1).join(':').trim();
      }
    }

    // 提取堆栈跟踪
    if (line.includes('at ') || line.includes('    at ')) {
      stack = line;
    }

    return {
      timestamp,
      logFile,
      type: errorType,
      message: errorMessage,
      stack,
      severity: this.getErrorSeverity(errorType, errorMessage),
      source: logFile.includes('error.log') ? 'application' : 'server'
    };
  }

  /**
   * 获取错误严重程度
   */
  getErrorSeverity(type, message) {
    if (type === 'SyntaxError' || message.includes('Cannot read property')) {
      return 'critical';
    }
    if (type === 'TypeError' || message.includes('Network Error')) {
      return 'high';
    }
    if (message.includes('404')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * 检查系统进程
   */
  checkSystemProcesses() {
    try {
      // macOS兼容的进程检查
      const processInfo = execSync('ps aux | grep -E "(node|next|react)" | grep -v grep', { encoding: 'utf8' });
      const processes = processInfo.trim().split('\n').filter(line => line.trim());
      
      return processes.map(process => {
        const parts = process.split(/\s+/);
        // macOS下的ps输出格式略有不同
        return {
          pid: parts[1] || parts[0],
          user: parts[0],
          cpu: parseFloat(parts[2] || '0'),
          memory: parseFloat(parts[3] || '0'),
          command: parts.slice(10).join(' ') || parts.slice(8).join(' ')
        };
      });
    } catch (error) {
      // 没有找到相关进程
      return [];
    }
  }

  /**
   * 检查应用状态
   */
  checkApplicationStatus() {
    try {
      const response = execSync('curl -s -w "%{http_code}" -o /dev/null http://localhost:3000/api/health || echo "000"', { encoding: 'utf8' });
      const statusCode = parseInt(response.trim());
      
      return {
        isRunning: statusCode !== 0,
        statusCode,
        lastCheck: new Date().toISOString()
      };
    } catch (error) {
      return {
        isRunning: false,
        statusCode: 0,
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }

  /**
   * 分析错误模式
   */
  analyzeErrorPatterns(errors) {
    const patterns = {};
    
    errors.forEach(error => {
      const pattern = error.type + ': ' + error.message.substring(0, 50);
      if (!patterns[pattern]) {
        patterns[pattern] = {
          count: 0,
          severity: error.severity,
          lastOccurrence: error.timestamp
        };
      }
      patterns[pattern].count++;
      if (new Date(error.timestamp) > new Date(patterns[pattern].lastOccurrence)) {
        patterns[pattern].lastOccurrence = error.timestamp;
      }
    });

    return patterns;
  }

  /**
   * 检查错误阈值
   */
  checkErrorThresholds(errors, patterns) {
    const alerts = [];
    
    // 检查每小时错误数量
    const recentErrors = errors.filter(error => {
      const errorTime = new Date(error.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return errorTime > oneHourAgo;
    });

    if (recentErrors.length > CONFIG.thresholds.errorCount) {
      alerts.push({
        type: 'error_count',
        level: 'warning',
        message: `过去1小时内发现 ${recentErrors.length} 个错误，超过阈值 ${CONFIG.thresholds.errorCount}`,
        threshold: CONFIG.thresholds.errorCount,
        actual: recentErrors.length
      });
    }

    // 检查严重错误
    const criticalErrors = recentErrors.filter(error => error.severity === 'critical');
    if (criticalErrors.length > CONFIG.thresholds.criticalErrors) {
      alerts.push({
        type: 'critical_errors',
        level: 'critical',
        message: `过去1小时内发现 ${criticalErrors.length} 个严重错误`,
        threshold: CONFIG.thresholds.criticalErrors,
        actual: criticalErrors.length
      });
    }

    // 检查重复错误模式
    Object.entries(patterns).forEach(([pattern, info]) => {
      if (info.count > 5) {
        alerts.push({
          type: 'repeated_error',
          level: 'warning',
          message: `错误模式重复出现: ${pattern} (${info.count}次)`,
          pattern,
          count: info.count
        });
      }
    });

    return alerts;
  }

  /**
   * 检查日志文件大小
   */
  checkLogFileSizes() {
    const alerts = [];
    
    [CONFIG.logPath].forEach(logDir => {
      if (fs.existsSync(logDir)) {
        const files = fs.readdirSync(logDir);
        
        files.forEach(file => {
          const filePath = path.join(logDir, file);
          if (fs.statSync(filePath).isFile()) {
            const stats = fs.statSync(filePath);
            const sizeMB = stats.size / (1024 * 1024);
            
            if (sizeMB > CONFIG.thresholds.logSize / (1024 * 1024)) {
              alerts.push({
                type: 'log_size',
                level: 'warning',
                message: `日志文件过大: ${file} (${sizeMB.toFixed(2)}MB)`,
                file,
                size: sizeMB
              });
            }
          }
        });
      }
    });

    return alerts;
  }

  /**
   * 保存错误报告
   */
  saveReport(errors, patterns, processes, status) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalErrors: errors.length,
        criticalErrors: errors.filter(e => e.severity === 'critical').length,
        highSeverityErrors: errors.filter(e => e.severity === 'high').length,
        applicationStatus: status.isRunning ? 'running' : 'stopped'
      },
      errors: errors.slice(0, 50), // 最多保存50个错误
      errorPatterns: patterns,
      systemProcesses: processes,
      applicationStatus: status,
      alerts: this.alerts
    };

    const filename = `error-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(CONFIG.outputPath, filename);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    
    console.log(`📊 错误监控报告已保存: ${filename}`);
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
      
      const levelEmoji = alert.level === 'critical' ? '🚨' : '⚠️';
      console.log(`${levelEmoji} ${alert.message}`);
    });
  }

  /**
   * 错误监控主函数
   */
  async monitor() {
    console.log('🔍 开始错误监控...');
    
    try {
      // 解析错误日志
      const errors = this.parseLogFiles();
      console.log(`📋 发现 ${errors.length} 个错误条目`);
      
      // 检查系统进程
      const processes = this.checkSystemProcesses();
      console.log(`🔄 发现 ${processes.length} 个相关进程`);
      
      // 检查应用状态
      const status = this.checkApplicationStatus();
      console.log(`📱 应用状态: ${status.isRunning ? '运行中' : '已停止'}`);
      
      // 分析错误模式
      const patterns = this.analyzeErrorPatterns(errors);
      console.log(`🔍 发现 ${Object.keys(patterns).length} 种错误模式`);
      
      // 检查阈值
      const alerts = [
        ...this.checkErrorThresholds(errors, patterns),
        ...this.checkLogFileSizes()
      ];
      
      if (alerts.length > 0) {
        this.alerts = alerts;
        this.sendAlerts(alerts);
      } else {
        console.log('✅ 未发现异常情况');
      }
      
      // 保存报告
      this.saveReport(errors, patterns, processes, status);
      
      return {
        errors: errors.length,
        alerts: alerts.length,
        status: status.isRunning ? 'healthy' : 'unhealthy'
      };
      
    } catch (error) {
      console.error('❌ 错误监控失败:', error.message);
      
      const alertFile = path.join(CONFIG.alertPath, `monitoring-error-${Date.now()}.json`);
      fs.writeFileSync(alertFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        type: 'monitoring_error',
        level: 'critical',
        message: `错误监控系统异常: ${error.message}`,
        stack: error.stack
      }, null, 2));
      
      throw error;
    }
  }
}

// 主程序
if (require.main === module) {
  const monitor = new ErrorMonitor();
  monitor.monitor()
    .then(result => {
      console.log(`\n📊 监控结果: ${result.errors} 错误, ${result.alerts} 告警, 状态: ${result.status}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 监控失败:', error);
      process.exit(1);
    });
}

module.exports = ErrorMonitor;