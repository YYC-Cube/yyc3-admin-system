#!/usr/bin/env node

/**
 * @file 日志分析器
 * @description 智能分析应用日志，提取错误模式、趋势分析和故障预警
 * @module problems_and_diagnostics
 * @author YYC
 * @version 1.0.0
 * @created 2025-11-15
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');
const glob = require('glob');

class LogAnalyzer {
  constructor() {
    this.workspacePath = '/Users/yanyu/yyc3-admin-system-2';
    this.logPaths = [
      path.join(this.workspacePath, 'logs'),
      path.join(this.workspacePath, '.next'),
      path.join(this.workspacePath, '/var/log'),
      path.join(this.workspacePath, '/tmp')
    ];
    this.errors = [];
    this.warnings = [];
    this.patterns = new Map();
    this.trendData = [];
  }

  /**
   * 运行日志分析
   */
  async analyzeLogs(logDir = null) {
    console.log(chalk.blue('🔍 开始日志分析...'));
    console.log(chalk.gray(`时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
    console.log('=' .repeat(60));
    
    const targetLogDir = logDir || this.workspacePath;
    
    await this.findAndAnalyzeLogs(targetLogDir);
    await this.analyzeErrorPatterns();
    await this.generateTrendAnalysis();
    this.generateReport();
    this.displaySummary();
  }

  /**
   * 查找并分析日志文件
   */
  async findAndAnalyzeLogs(directory) {
    console.log(chalk.yellow(`\n📋 在 ${directory} 中查找日志文件...`));
    
    // 使用glob查找日志文件
    const logPattern = path.join(directory, '**/*.{log,txt}');
    const logFiles = glob.sync(logPattern, { ignore: ['node_modules/**', '.git/**'] });
    
    if (logFiles.length === 0) {
      console.log(chalk.yellow('⚠️ 未发现日志文件'));
      return;
    }
    
    console.log(chalk.blue(`📊 发现 ${logFiles.length} 个日志文件`));
    
    for (const logFile of logFiles.slice(0, 10)) { // 限制分析文件数量
      await this.analyzeSingleLogFile(logFile);
    }
  }

  /**
   * 分析单个日志文件
   */
  async analyzeSingleLogFile(filePath) {
    try {
      console.log(chalk.gray(`分析文件: ${path.basename(filePath)}`));
      
      const fileName = path.basename(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      let errorCount = 0;
      let warningCount = 0;
      
      for (const line of lines) {
        const analysis = this.analyzeLogLine(line, fileName);
        
        if (analysis.type === 'error') {
          this.errors.push(analysis);
          errorCount++;
        } else if (analysis.type === 'warning') {
          this.warnings.push(analysis);
          warningCount++;
        }
        
        this.trackPattern(analysis);
      }
      
      if (errorCount > 0 || warningCount > 0) {
        console.log(chalk.blue(`  - 错误: ${errorCount}, 警告: ${warningCount}`));
      }
      
    } catch (error) {
      console.log(chalk.red(`❌ 分析文件失败: ${filePath}`));
    }
  }

  /**
   * 分析单行日志
   */
  analyzeLogLine(line, fileName) {
    const timestamp = this.extractTimestamp(line);
    const category = this.categorizeLog(line);
    const severity = this.determineSeverity(line);
    
    return {
      type: severity === 'error' ? 'error' : severity === 'warning' ? 'warning' : 'info',
      timestamp,
      category,
      message: line.substring(0, 200),
      fullMessage: line,
      fileName,
      severity,
      stackTrace: this.extractStackTrace(line),
      code: this.extractErrorCode(line),
      component: this.extractComponent(line)
    };
  }

  /**
   * 提取时间戳
   */
  extractTimestamp(line) {
    const timestampPatterns = [
      /\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/,
      /\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}/,
      /\d{2}:\d{2}:\d{2}\s+\d{4}-\d{2}-\d{2}/,
      /\[(\d{2}:\d{2}:\d{2})\]/,
      /(\d{2}:\d{2}:\d{2})/
    ];
    
    for (const pattern of timestampPatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return moment().format('HH:mm:ss');
  }

  /**
   * 分类日志
   */
  categorizeLog(line) {
    const categories = {
      'authentication': ['auth', 'login', 'password', 'token', 'session'],
      'database': ['sql', 'query', 'database', 'db', 'mongodb', 'postgres'],
      'api': ['api', 'endpoint', 'route', 'controller', 'http'],
      'performance': ['slow', 'timeout', 'performance', 'memory', 'cpu'],
      'security': ['security', 'vulnerability', 'attack', 'injection', 'xss'],
      'network': ['network', 'connection', 'timeout', 'dns', 'tcp'],
      'ui': ['component', 'render', 'dom', 'javascript', 'react'],
      'nextjs': ['next', 'build', 'server', 'middleware'],
      'deployment': ['deploy', 'docker', 'kubernetes', 'nginx'],
      'build': ['build', 'webpack', 'babel', 'typescript', 'compilation']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => line.toLowerCase().includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  /**
   * 确定严重性
   */
  determineSeverity(line) {
    const errorPatterns = [
      /error|exception|crash|fatal|critical/gi,
      /undefined\s+is\s+not\s+a\s+function/gi,
      /cannot\s+read\s+property/gi,
      /maximum\s+call\s+stack\s+size/gi,
      /out\s+of\s+memory/gi,
      /connection\s+refused/gi,
      /permission\s+denied/gi,
      /timeout/gi
    ];
    
    const warningPatterns = [
      /warning|deprecated|obsolete/gi,
      /deprecated/gi,
      /legacy/gi,
      /performance/gi,
      /deprecated/gi
    ];
    
    for (const pattern of errorPatterns) {
      if (pattern.test(line)) {
        return 'error';
      }
    }
    
    for (const pattern of warningPatterns) {
      if (pattern.test(line)) {
        return 'warning';
      }
    }
    
    return 'info';
  }

  /**
   * 提取堆栈跟踪
   */
  extractStackTrace(line) {
    const stackPattern = /(at\s+[^\n]+)/g;
    const matches = line.match(stackPattern);
    return matches ? matches.slice(0, 3) : null; // 只取前3层
  }

  /**
   * 提取错误代码
   */
  extractErrorCode(line) {
    const codePatterns = [
      /error\s+code:\s*(\w+)/gi,
      /status:\s*(\d{3})/gi,
      /code:\s*(\d+)/gi,
      /HTTP\s+(\d+)/gi
    ];
    
    for (const pattern of codePatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * 提取组件信息
   */
  extractComponent(line) {
    const componentPatterns = [
      /in\s+(\w+)/gi,
      /at\s+(\w+)/gi,
      /(\w+)\s+component/gi
    ];
    
    for (const pattern of componentPatterns) {
      const match = line.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * 跟踪错误模式
   */
  trackPattern(analysis) {
    const pattern = `${analysis.category}-${analysis.severity}`;
    
    if (this.patterns.has(pattern)) {
      this.patterns.set(pattern, this.patterns.get(pattern) + 1);
    } else {
      this.patterns.set(pattern, 1);
    }
  }

  /**
   * 分析错误模式
   */
  async analyzeErrorPatterns() {
    console.log(chalk.yellow('\n🔍 分析错误模式...'));
    
    // 按类别统计错误
    const errorByCategory = {};
    const errorByHour = {};
    
    for (const error of this.errors) {
      // 按类别统计
      if (!errorByCategory[error.category]) {
        errorByCategory[error.category] = 0;
      }
      errorByCategory[error.category]++;
      
      // 按时间统计
      if (error.timestamp) {
        const hour = error.timestamp.split(':')[0];
        if (!errorByHour[hour]) {
          errorByHour[hour] = 0;
        }
        errorByHour[hour]++;
      }
    }
    
    console.log(chalk.blue('📊 错误类别统计:'));
    for (const [category, count] of Object.entries(errorByCategory)) {
      console.log(chalk.gray(`  ${category}: ${count} 个`));
    }
    
    console.log(chalk.blue('\n📊 错误时间分布:'));
    for (const [hour, count] of Object.entries(errorByHour)) {
      console.log(chalk.gray(`  ${hour}:xx - ${count} 个错误`));
    }
  }

  /**
   * 生成趋势分析
   */
  async generateTrendAnalysis() {
    console.log(chalk.yellow('\n📈 生成趋势分析...'));
    
    // 计算错误率
    const totalMessages = this.errors.length + this.warnings.length;
    const errorRate = totalMessages > 0 ? (this.errors.length / totalMessages * 100).toFixed(1) : 0;
    
    console.log(chalk.blue(`📊 错误率: ${errorRate}%`));
    
    // 识别最频繁的错误
    const topPatterns = Array.from(this.patterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    console.log(chalk.blue('📊 最常见错误模式:'));
    for (const [pattern, count] of topPatterns) {
      console.log(chalk.gray(`  ${pattern}: ${count} 次`));
    }
  }

  /**
   * 生成报告
   */
  generateReport() {
    const reportDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const reportData = {
      timestamp: moment().toISOString(),
      summary: {
        totalErrors: this.errors.length,
        totalWarnings: this.warnings.length,
        errorRate: this.errors.length / (this.errors.length + this.warnings.length) * 100 || 0
      },
      errorPatterns: Object.fromEntries(this.patterns),
      topErrors: this.errors.slice(0, 10),
      trendAnalysis: {
        mostCommonCategory: this.getMostCommonCategory(),
        peakErrorHour: this.getPeakErrorHour(),
        errorSeverity: this.getErrorSeverityDistribution()
      }
    };
    
    const reportFile = path.join(reportDir, `log-analysis-${moment().format('YYYY-MM-DD-HH-mm')}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    
    console.log(chalk.blue(`\n📋 日志分析报告已保存到: ${reportFile}`));
  }

  /**
   * 获取最常见错误类别
   */
  getMostCommonCategory() {
    const categoryCount = {};
    
    for (const error of this.errors) {
      categoryCount[error.category] = (categoryCount[error.category] || 0) + 1;
    }
    
    const sortedCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1]);
    
    return sortedCategories.length > 0 ? sortedCategories[0] : ['none', 0];
  }

  /**
   * 获取错误高峰期
   */
  getPeakErrorHour() {
    const hourCount = {};
    
    for (const error of this.errors) {
      if (error.timestamp && error.timestamp.includes(':')) {
        const hour = error.timestamp.split(':')[0];
        hourCount[hour] = (hourCount[hour] || 0) + 1;
      }
    }
    
    const sortedHours = Object.entries(hourCount)
      .sort((a, b) => b[1] - a[1]);
    
    return sortedHours.length > 0 ? sortedHours[0] : ['N/A', 0];
  }

  /**
   * 获取错误严重性分布
   */
  getErrorSeverityDistribution() {
    const severityCount = {
      error: this.errors.length,
      warning: this.warnings.length,
      info: 0
    };
    
    return severityCount;
  }

  /**
   * 显示摘要
   */
  displaySummary() {
    console.log('\n' + '=' .repeat(60));
    console.log(chalk.bold('📊 日志分析摘要'));
    console.log('=' .repeat(60));
    
    console.log(chalk.red(`❌ 错误总数: ${this.errors.length}`));
    console.log(chalk.yellow(`⚠️ 警告总数: ${this.warnings.length}`));
    
    const errorRate = this.errors.length / (this.errors.length + this.warnings.length) * 100 || 0;
    
    if (errorRate > 50) {
      console.log(chalk.red(`📊 错误率: ${errorRate.toFixed(1)}% (需要关注)`));
    } else if (errorRate > 20) {
      console.log(chalk.yellow(`📊 错误率: ${errorRate.toFixed(1)}% (可接受)`));
    } else {
      console.log(chalk.green(`📊 错误率: ${errorRate.toFixed(1)}% (良好)`));
    }
    
    const [topCategory, categoryCount] = this.getMostCommonCategory();
    console.log(chalk.blue(`🔝 最常见错误类别: ${topCategory} (${categoryCount} 个)`));
    
    console.log('\n' + chalk.green('🌹 日志分析完成！'));
  }
}

// 命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const logDirIndex = args.indexOf('--log-dir');
  const logDir = logDirIndex !== -1 ? args[logDirIndex + 1] : null;
  
  const analyzer = new LogAnalyzer();
  analyzer.analyzeLogs(logDir).catch(console.error);
}

module.exports = LogAnalyzer;