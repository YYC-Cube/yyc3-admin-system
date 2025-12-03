#!/usr/bin/env node

/**
 * @file 交互式诊断工具
 * @description 提供用户友好的交互界面，智能诊断和故障排查
 * @module problems_and_diagnostics
 * @author YYC
 * @version 1.0.0
 * @created 2025-11-15
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const moment = require('moment');

class InteractiveDiagnostics {
  constructor() {
    this.workspacePath = '/Users/yanyu/yyc3-admin-system-2';
    this.reportDir = path.join(__dirname, '../reports');
    this.findings = [];
  }

  /**
   * 启动交互式诊断
   */
  async start() {
    console.log(chalk.blue.bold('🔧 问题诊断与故障排查工具包'));
    console.log(chalk.gray(`版本: 1.0.0 | 时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
    console.log('=' .repeat(70));
    
    while (true) {
      const choice = await this.showMainMenu();
      
      switch (choice.action) {
        case 'quick_check':
          await this.runQuickCheck();
          break;
        case 'full_diagnosis':
          await this.runFullDiagnosis();
          break;
        case 'error_analysis':
          await this.runErrorAnalysis();
          break;
        case 'performance_check':
          await this.runPerformanceCheck();
          break;
        case 'security_scan':
          await this.runSecurityScan();
          break;
        case 'view_reports':
          await this.viewReports();
          break;
        case 'export_report':
          await this.exportReport();
          break;
        case 'exit':
          console.log(chalk.green('🌹 感谢使用问题诊断工具包！'));
          process.exit(0);
          break;
      }
    }
  }

  /**
   * 显示主菜单
   */
  async showMainMenu() {
    const choices = [
      { name: '🚀 快速系统检查 (5分钟内完成)', value: 'quick_check' },
      { name: '🔍 完整系统诊断 (10-15分钟)', value: 'full_diagnosis' },
      { name: '🚨 错误分析与处理', value: 'error_analysis' },
      { name: '⚡ 性能检查与优化建议', value: 'performance_check' },
      { name: '🔒 安全扫描', value: 'security_scan' },
      { name: '📋 查看历史报告', value: 'view_reports' },
      { name: '💾 导出当前报告', value: 'export_report' },
      { name: '❌ 退出工具', value: 'exit' }
    ];
    
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '请选择要执行的操作:',
        choices: choices,
        loop: false
      }
    ]);
    
    return answer;
  }

  /**
   * 快速系统检查
   */
  async runQuickCheck() {
    console.log(chalk.yellow('\n🚀 开始快速系统检查...'));
    this.findings = [];
    
    // 关键检查项目
    await this.checkCriticalProcesses();
    await this.checkDiskSpace();
    await this.checkMemoryUsage();
    await this.checkKeyFiles();
    await this.checkLastErrors();
    
    this.displayQuickResults();
    
    await this.promptContinue();
  }

  /**
   * 检查关键进程
   */
  async checkCriticalProcesses() {
    console.log(chalk.blue('🔍 检查关键进程...'));
    
    try {
      const { exec } = require('child_process');
      const execAsync = (command) => new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
      
      const nodeProcesses = await execAsync('ps aux | grep node | grep -v grep');
      const nextProcesses = await execAsync('ps aux | grep next | grep -v grep');
      
      if (nodeProcesses.trim()) {
        this.addFinding('low', 'process', '检测到Node.js进程正在运行');
      }
      
      if (nextProcesses.trim()) {
        this.addFinding('low', 'process', '检测到Next.js开发服务器正在运行');
      }
      
      console.log(chalk.green('✅ 关键进程检查完成'));
    } catch (error) {
      this.addFinding('medium', 'process', '进程检查失败: ' + error.message);
      console.log(chalk.yellow('⚠️ 进程检查遇到问题'));
    }
  }

  /**
   * 检查磁盘空间
   */
  async checkDiskSpace() {
    console.log(chalk.blue('💾 检查磁盘空间...'));
    
    try {
      const { exec } = require('child_process');
      const execAsync = (command) => new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
      
      const diskUsage = await execAsync('df -h /');
      const lines = diskUsage.split('\n');
      const dataLine = lines[1]; // 假设第一行是标题
      const parts = dataLine.split(/\s+/);
      
      if (parts.length >= 5) {
        const used = parts[2];
        const avail = parts[3];
        const usage = parts[4];
        
        const usagePercent = parseInt(usage.replace('%', ''));
        
        if (usagePercent > 90) {
          this.addFinding('high', 'storage', `磁盘使用率过高: ${usage}`);
        } else if (usagePercent > 80) {
          this.addFinding('medium', 'storage', `磁盘使用率较高: ${usage}`);
        } else {
          this.addFinding('low', 'storage', `磁盘使用率正常: ${usage}`);
        }
        
        console.log(chalk.blue(`📊 可用空间: ${avail}, 已使用: ${used} (${usage})`));
      }
    } catch (error) {
      this.addFinding('medium', 'storage', '磁盘空间检查失败: ' + error.message);
      console.log(chalk.yellow('⚠️ 磁盘空间检查遇到问题'));
    }
  }

  /**
   * 检查内存使用
   */
  async checkMemoryUsage() {
    console.log(chalk.blue('🧠 检查内存使用情况...'));
    
    try {
      const { exec } = require('child_process');
      const execAsync = (command) => new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
      
      const memoryInfo = await execAsync('vm_stat');
      const pagesFree = this.extractValue(memoryInfo, 'Pages free');
      const pagesActive = this.extractValue(memoryInfo, 'Pages active');
      
      if (pagesFree && pagesActive) {
        const totalPages = parseInt(pagesFree) + parseInt(pagesActive);
        const freePercent = (parseInt(pagesFree) / totalPages * 100).toFixed(1);
        
        if (parseFloat(freePercent) < 10) {
          this.addFinding('high', 'memory', `可用内存过低: ${freePercent}%`);
        } else if (parseFloat(freePercent) < 20) {
          this.addFinding('medium', 'memory', `可用内存较少: ${freePercent}%`);
        } else {
          this.addFinding('low', 'memory', `内存使用正常: ${freePercent}%可用`);
        }
      }
      
      console.log(chalk.green('✅ 内存检查完成'));
    } catch (error) {
      this.addFinding('medium', 'memory', '内存检查失败: ' + error.message);
      console.log(chalk.yellow('⚠️ 内存检查遇到问题'));
    }
  }

  /**
   * 检查关键文件
   */
  async checkKeyFiles() {
    console.log(chalk.blue('📁 检查关键文件...'));
    
    const criticalFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'app/layout.tsx',
      'app/page.tsx'
    ];
    
    let missingFiles = 0;
    
    for (const file of criticalFiles) {
      const filePath = path.join(this.workspacePath, file);
      if (!fs.existsSync(filePath)) {
        missingFiles++;
        this.addFinding('high', 'files', `缺失关键文件: ${file}`);
      }
    }
    
    if (missingFiles === 0) {
      this.addFinding('low', 'files', '所有关键文件存在');
    }
    
    console.log(chalk.green('✅ 关键文件检查完成'));
  }

  /**
   * 检查最近的错误
   */
  async checkLastErrors() {
    console.log(chalk.blue('🚨 检查最近的错误...'));
    
    try {
      // 检查是否有错误日志文件
      const logFiles = [
        path.join(this.workspacePath, '.next/trace'),
        path.join(this.workspacePath, 'logs/error.log'),
        '/var/log/system.log'
      ];
      
      let errorCount = 0;
      
      for (const logFile of logFiles) {
        if (fs.existsSync(logFile)) {
          errorCount++;
          this.addFinding('low', 'logs', `发现日志文件: ${path.basename(logFile)}`);
        }
      }
      
      if (errorCount === 0) {
        this.addFinding('low', 'logs', '未发现明显的错误日志');
      }
      
      console.log(chalk.green('✅ 错误检查完成'));
    } catch (error) {
      this.addFinding('medium', 'logs', '错误检查失败: ' + error.message);
    }
  }

  /**
   * 完整系统诊断
   */
  async runFullDiagnosis() {
    console.log(chalk.yellow('\n🔍 开始完整系统诊断...'));
    this.findings = [];
    
    // 这里可以调用之前创建的系统诊断类
    try {
      const SystemDiagnostic = require('./system-diagnosis.js');
      const diagnostic = new SystemDiagnostic();
      
      // 重新实现一些检查项
      await this.runComprehensiveChecks();
      await this.analyzeDependencies();
      await this.checkConfigurationHealth();
      await this.validateSecurity();
      await this.assessPerformance();
      
    } catch (error) {
      console.log(chalk.red('❌ 诊断过程遇到错误: ' + error.message));
    }
    
    this.displayDetailedResults();
    await this.promptContinue();
  }

  /**
   * 运行综合检查
   */
  async runComprehensiveChecks() {
    console.log(chalk.blue('🔍 运行综合检查...'));
    
    // 检查Node.js和npm版本
    await this.checkNodeVersions();
    
    // 检查Git状态
    await this.checkGitStatus();
    
    // 检查环境变量
    await this.checkEnvironmentVariables();
  }

  /**
   * 检查Node.js版本
   */
  async checkNodeVersions() {
    try {
      const { exec } = require('child_process');
      const execAsync = (command) => new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout.trim());
        });
      });
      
      const nodeVersion = await execAsync('node --version');
      const npmVersion = await execAsync('npm --version');
      
      this.addFinding('low', 'versions', `Node.js: ${nodeVersion}`);
      this.addFinding('low', 'versions', `npm: ${npmVersion}`);
      
      // 检查版本兼容性
      const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
      if (nodeMajor < 16) {
        this.addFinding('medium', 'versions', 'Node.js版本可能过低，建议升级到v16+');
      }
      
    } catch (error) {
      this.addFinding('medium', 'versions', '版本检查失败: ' + error.message);
    }
  }

  /**
   * 检查Git状态
   */
  async checkGitStatus() {
    try {
      const { exec } = require('child_process');
      const execAsync = (command) => new Promise((resolve, reject) => {
        exec(command, { cwd: this.workspacePath }, (error, stdout) => {
          if (error) reject(error);
          else resolve(stdout);
        });
      });
      
      const gitStatus = await execAsync('git status --porcelain');
      
      if (gitStatus.trim()) {
        this.addFinding('medium', 'git', '检测到未提交的代码变更');
      } else {
        this.addFinding('low', 'git', '工作目录干净');
      }
      
    } catch (error) {
      this.addFinding('low', 'git', 'Git状态检查失败或非Git仓库');
    }
  }

  /**
   * 检查环境变量
   */
  async checkEnvironmentVariables() {
    const envFiles = ['.env', '.env.local', '.env.production'];
    let envFileCount = 0;
    
    for (const envFile of envFiles) {
      const envPath = path.join(this.workspacePath, envFile);
      if (fs.existsSync(envPath)) {
        envFileCount++;
        this.addFinding('low', 'env', `发现环境文件: ${envFile}`);
        
        // 检查文件权限
        const stats = fs.statSync(envPath);
        const isSecure = (stats.mode & 0o77) === 0;
        if (!isSecure) {
          this.addFinding('high', 'env', `${envFile} 文件权限不安全`);
        }
      }
    }
    
    if (envFileCount === 0) {
      this.addFinding('medium', 'env', '未发现环境配置文件');
    }
  }

  /**
   * 错误分析与处理
   */
  async runErrorAnalysis() {
    console.log(chalk.yellow('\n🚨 开始错误分析...'));
    this.findings = [];
    
    try {
      const LogAnalyzer = require('./log-analyzer.js');
      const analyzer = new LogAnalyzer();
      
      await analyzer.analyzeLogs(this.workspacePath);
      
      // 获取分析结果
      this.findings = analyzer.errors.map(error => ({
        severity: 'high',
        category: error.category || 'error',
        message: error.fullMessage.substring(0, 100)
      }));
      
    } catch (error) {
      console.log(chalk.red('❌ 错误分析失败: ' + error.message));
    }
    
    this.displayErrorAnalysis();
    await this.promptContinue();
  }

  /**
   * 性能检查
   */
  async runPerformanceCheck() {
    console.log(chalk.yellow('\n⚡ 开始性能检查...'));
    this.findings = [];
    
    await this.checkBundleSize();
    await this.checkStartupTime();
    await this.checkMemoryLeaks();
    await this.checkBuildPerformance();
    
    this.displayPerformanceResults();
    await this.promptContinue();
  }

  /**
   * 检查包大小
   */
  async checkBundleSize() {
    try {
      const nodeModulesPath = path.join(this.workspacePath, 'node_modules');
      if (fs.existsSync(nodeModulesPath)) {
        const stats = fs.statSync(nodeModulesPath);
        const sizeMB = Math.round(stats.size / (1024 * 1024));
        
        if (sizeMB > 1000) {
          this.addFinding('high', 'performance', `node_modules过大: ${sizeMB}MB`);
        } else if (sizeMB > 500) {
          this.addFinding('medium', 'performance', `node_modules较大: ${sizeMB}MB`);
        } else {
          this.addFinding('low', 'performance', `node_modules大小正常: ${sizeMB}MB`);
        }
      }
    } catch (error) {
      this.addFinding('medium', 'performance', '包大小检查失败: ' + error.message);
    }
  }

  /**
   * 安全扫描
   */
  async runSecurityScan() {
    console.log(chalk.yellow('\n🔒 开始安全扫描...'));
    this.findings = [];
    
    await this.checkVulnerablePackages();
    await this.checkSecurityHeaders();
    await this.checkFilePermissions();
    await this.checkExposedSecrets();
    
    this.displaySecurityResults();
    await this.promptContinue();
  }

  /**
   * 检查安全漏洞包
   */
  async checkVulnerablePackages() {
    try {
      const packageJsonPath = path.join(this.workspacePath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // 检查是否有已知漏洞的包
        const vulnerablePackages = [
          'lodash', 'moment', 'axios', 'express'
        ];
        
        for (const vulnPackage of vulnerablePackages) {
          if (packageData.dependencies && packageData.dependencies[vulnPackage]) {
            const version = packageData.dependencies[vulnPackage];
            this.addFinding('medium', 'security', `检查包 ${vulnPackage}:${version} 的安全更新`);
          }
        }
      }
    } catch (error) {
      this.addFinding('medium', 'security', '包安全检查失败: ' + error.message);
    }
  }

  /**
   * 添加发现的问题
   */
  addFinding(severity, category, message) {
    this.findings.push({
      severity,
      category,
      message,
      timestamp: moment().toISOString()
    });
  }

  /**
   * 显示快速结果
   */
  displayQuickResults() {
    console.log('\n' + '=' .repeat(60));
    console.log(chalk.bold('📊 快速检查结果'));
    console.log('=' .repeat(60));
    
    const highIssues = this.findings.filter(f => f.severity === 'high');
    const mediumIssues = this.findings.filter(f => f.severity === 'medium');
    const lowIssues = this.findings.filter(f => f.severity === 'low');
    
    if (highIssues.length > 0) {
      console.log(chalk.red(`❌ 高优先级问题: ${highIssues.length} 个`));
      highIssues.forEach(issue => {
        console.log(chalk.red(`  🚨 [${issue.category}] ${issue.message}`));
      });
    }
    
    if (mediumIssues.length > 0) {
      console.log(chalk.yellow(`⚠️ 中优先级问题: ${mediumIssues.length} 个`));
      mediumIssues.forEach(issue => {
        console.log(chalk.yellow(`  ⚠️ [${issue.category}] ${issue.message}`));
      });
    }
    
    if (lowIssues.length > 0) {
      console.log(chalk.blue(`ℹ️ 信息提示: ${lowIssues.length} 个`));
    }
    
    const totalScore = 100 - (highIssues.length * 20 + mediumIssues.length * 10 + lowIssues.length * 2);
    
    if (totalScore >= 90) {
      console.log(chalk.green(`\n🎉 系统状态: 优秀 (${totalScore}分)`));
    } else if (totalScore >= 70) {
      console.log(chalk.yellow(`\n⚠️ 系统状态: 良好 (${totalScore}分)`));
    } else {
      console.log(chalk.red(`\n🚨 系统状态: 需要关注 (${totalScore}分)`));
    }
  }

  /**
   * 显示详细结果
   */
  displayDetailedResults() {
    this.displayQuickResults();
    
    console.log(chalk.blue('\n📋 详细分析建议:'));
    
    const suggestions = this.generateSuggestions();
    suggestions.forEach(suggestion => {
      console.log(chalk.cyan(`💡 ${suggestion}`));
    });
  }

  /**
   * 显示错误分析结果
   */
  displayErrorAnalysis() {
    console.log('\n' + '=' .repeat(60));
    console.log(chalk.bold('🚨 错误分析结果'));
    console.log('=' .repeat(60));
    
    if (this.findings.length === 0) {
      console.log(chalk.green('✅ 未发现明显错误'));
    } else {
      console.log(chalk.red(`❌ 发现 ${this.findings.length} 个错误问题`));
      
      this.findings.forEach((finding, index) => {
        console.log(chalk.red(`${index + 1}. [${finding.category}] ${finding.message}`));
      });
    }
  }

  /**
   * 显示性能结果
   */
  displayPerformanceResults() {
    console.log('\n' + '=' .repeat(60));
    console.log(chalk.bold('⚡ 性能检查结果'));
    console.log('=' .repeat(60));
    
    this.findings.forEach(finding => {
      if (finding.severity === 'high') {
        console.log(chalk.red(`❌ [${finding.category}] ${finding.message}`));
      } else if (finding.severity === 'medium') {
        console.log(chalk.yellow(`⚠️ [${finding.category}] ${finding.message}`));
      } else {
        console.log(chalk.green(`✅ [${finding.category}] ${finding.message}`));
      }
    });
  }

  /**
   * 显示安全结果
   */
  displaySecurityResults() {
    console.log('\n' + '=' .repeat(60));
    console.log(chalk.bold('🔒 安全扫描结果'));
    console.log('=' .repeat(60));
    
    this.findings.forEach(finding => {
      if (finding.severity === 'high') {
        console.log(chalk.red(`🚨 [${finding.category}] ${finding.message}`));
      } else if (finding.severity === 'medium') {
        console.log(chalk.yellow(`⚠️ [${finding.category}] ${finding.message}`));
      } else {
        console.log(chalk.blue(`ℹ️ [${finding.category}] ${finding.message}`));
      }
    });
  }

  /**
   * 生成改进建议
   */
  generateSuggestions() {
    const suggestions = [];
    
    if (this.findings.some(f => f.category === 'storage' && f.severity === 'high')) {
      suggestions.push('清理不必要的文件和日志，释放磁盘空间');
    }
    
    if (this.findings.some(f => f.category === 'memory' && f.severity === 'high')) {
      suggestions.push('检查内存泄漏，考虑重启应用程序');
    }
    
    if (this.findings.some(f => f.category === 'env')) {
      suggestions.push('确保环境变量正确配置并检查敏感信息的安全');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('系统状态良好，继续保持当前的维护水平');
    }
    
    return suggestions;
  }

  /**
   * 询问是否继续
   */
  async promptContinue() {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: '是否继续使用其他功能？',
        default: true
      }
    ]);
    
    return answer.continue;
  }

  /**
   * 查看历史报告
   */
  async viewReports() {
    console.log(chalk.blue('\n📋 查看历史报告...'));
    
    if (!fs.existsSync(this.reportDir)) {
      console.log(chalk.yellow('⚠️ 报告目录不存在'));
      return;
    }
    
    const reports = fs.readdirSync(this.reportDir)
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(this.reportDir, file),
        size: fs.statSync(path.join(this.reportDir, file)).size
      }))
      .sort((a, b) => b.size - a.size);
    
    if (reports.length === 0) {
      console.log(chalk.yellow('⚠️ 未发现历史报告'));
      return;
    }
    
    console.log(chalk.blue('📊 可用报告:'));
    reports.slice(0, 5).forEach((report, index) => {
      const sizeKB = (report.size / 1024).toFixed(1);
      console.log(chalk.gray(`${index + 1}. ${report.name} (${sizeKB}KB)`));
    });
    
    await this.promptContinue();
  }

  /**
   * 导出报告
   */
  async exportReport() {
    console.log(chalk.blue('\n💾 导出报告...'));
    
    const reportData = {
      timestamp: moment().toISOString(),
      findings: this.findings,
      summary: {
        total: this.findings.length,
        high: this.findings.filter(f => f.severity === 'high').length,
        medium: this.findings.filter(f => f.severity === 'medium').length,
        low: this.findings.filter(f => f.severity === 'low').length
      }
    };
    
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
    
    const reportFile = path.join(this.reportDir, `interactive-report-${moment().format('YYYY-MM-DD-HH-mm-ss')}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    
    console.log(chalk.green(`✅ 报告已导出到: ${reportFile}`));
    
    await this.promptContinue();
  }

  /**
   * 提取值
   */
  extractValue(text, key) {
    const match = text.match(new RegExp(`${key}:\\s+(\\d+)`));
    return match ? match[1] : null;
  }

  /**
   * 运行综合检查
   */
  async runComprehensiveChecks() {
    // 实现综合检查逻辑
  }

  /**
   * 分析依赖项
   */
  async analyzeDependencies() {
    // 实现依赖项分析逻辑
  }

  /**
   * 检查配置健康状况
   */
  async checkConfigurationHealth() {
    // 实现配置检查逻辑
  }

  /**
   * 验证安全性
   */
  async validateSecurity() {
    // 实现安全验证逻辑
  }

  /**
   * 评估性能
   */
  async assessPerformance() {
    // 实现性能评估逻辑
  }

  /**
   * 检查启动时间
   */
  async checkStartupTime() {
    // 实现启动时间检查逻辑
  }

  /**
   * 检查内存泄漏
   */
  async checkMemoryLeaks() {
    // 实现内存泄漏检查逻辑
  }

  /**
   * 检查构建性能
   */
  async checkBuildPerformance() {
    // 实现构建性能检查逻辑
  }

  /**
   * 检查安全头
   */
  async checkSecurityHeaders() {
    // 实现安全头检查逻辑
  }

  /**
   * 检查文件权限
   */
  async checkFilePermissions() {
    // 实现文件权限检查逻辑
  }

  /**
   * 检查暴露的密钥
   */
  async checkExposedSecrets() {
    // 实现密钥检查逻辑
  }
}

// 启动交互式诊断
if (require.main === module) {
  const diagnostics = new InteractiveDiagnostics();
  diagnostics.start().catch(console.error);
}

module.exports = InteractiveDiagnostics;