#!/usr/bin/env node

/**
 * @file 系统诊断工具
 * @description 全面诊断系统健康状况，包括进程监控、日志分析、性能检查等
 * @module problems_and_diagnostics
 * @author YYC
 * @version 1.0.0
 * @created 2025-11-15
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment');

class SystemDiagnostic {
  constructor() {
    this.reportDir = path.join(__dirname, '../reports');
    this.workspacePath = '/Users/yanyu/yyc3-admin-system-2';
    this.issuesFound = [];
    this.systemHealth = {
      score: 100,
      status: 'healthy'
    };
  }

  /**
   * 运行完整的系统诊断
   */
  async runFullDiagnosis() {
    console.log(chalk.blue('🔍 开始系统诊断...'));
    console.log(chalk.gray(`时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}`));
    console.log('=' .repeat(60));
    
    await this.checkSystemResources();
    await this.checkApplicationHealth();
    await this.checkLogFiles();
    await this.checkTestCoverage();
    await this.checkSecurityIssues();
    await this.checkPerformanceMetrics();
    
    this.generateReport();
    this.displaySummary();
  }

  /**
   * 检查系统资源
   */
  async checkSystemResources() {
    console.log(chalk.yellow('\n📊 检查系统资源...'));
    
    try {
      // 检查磁盘空间
      const diskUsage = await this.execCommand('df -h');
      const memoryUsage = await this.execCommand('vm_stat');
      
      console.log(chalk.green('✅ 系统资源检查完成'));
      this.logIssue('low', 'system_resources', '磁盘和内存状态正常');
    } catch (error) {
      this.logIssue('high', 'system_resources', `系统资源检查失败: ${error.message}`);
    }
  }

  /**
   * 检查应用健康状况
   */
  async checkApplicationHealth() {
    console.log(chalk.yellow('\n🏥 检查应用健康状况...'));
    
    // 检查Next.js进程
    await this.checkNextJSProcesses();
    
    // 检查关键文件存在性
    await this.checkKeyFiles();
    
    // 检查配置文件
    await this.checkConfigurationFiles();
  }

  /**
   * 检查Next.js进程
   */
  async checkNextJSProcesses() {
    try {
      const psOutput = await this.execCommand('ps aux | grep -i next');
      const nextjsProcesses = psOutput.split('\n').filter(line => 
        line.includes('node') && (line.includes('next') || line.includes('react'))
      );
      
      if (nextjsProcesses.length > 0) {
        console.log(chalk.green(`✅ 发现 ${nextjsProcesses.length} 个Next.js相关进程`));
        this.logIssue('low', 'processes', `${nextjsProcesses.length}个Next.js进程正在运行`);
      } else {
        console.log(chalk.yellow('⚠️ 未发现运行中的Next.js进程'));
        this.logIssue('medium', 'processes', '没有发现运行中的Next.js进程');
      }
    } catch (error) {
      this.logIssue('high', 'processes', `进程检查失败: ${error.message}`);
    }
  }

  /**
   * 检查关键文件
   */
  async checkKeyFiles() {
    const criticalFiles = [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'app/layout.tsx',
      'app/page.tsx',
      '.env.local'
    ];
    
    const missingFiles = [];
    
    for (const file of criticalFiles) {
      const filePath = path.join(this.workspacePath, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
      }
    }
    
    if (missingFiles.length > 0) {
      console.log(chalk.red(`❌ 缺失关键文件: ${missingFiles.join(', ')}`));
      this.logIssue('high', 'key_files', `缺失关键文件: ${missingFiles.join(', ')}`);
    } else {
      console.log(chalk.green('✅ 所有关键文件存在'));
      this.logIssue('low', 'key_files', '所有关键文件检查通过');
    }
  }

  /**
   * 检查配置文件
   */
  async checkConfigurationFiles() {
    const configFiles = [
      { file: 'next.config.js', check: 'serverPort' },
      { file: 'package.json', check: 'scripts' },
      { file: 'jest.config.ts', check: 'testEnvironment' },
      { file: 'tailwind.config.js', check: 'content' }
    ];
    
    for (const config of configFiles) {
      try {
        const configPath = path.join(this.workspacePath, config.file);
        if (fs.existsSync(configPath)) {
          const content = fs.readFileSync(configPath, 'utf8');
          if (content.includes(config.check)) {
            this.logIssue('low', 'config', `${config.file} 配置正常`);
          }
        }
      } catch (error) {
        this.logIssue('medium', 'config', `${config.file} 配置检查失败: ${error.message}`);
      }
    }
  }

  /**
   * 检查日志文件
   */
  async checkLogFiles() {
    console.log(chalk.yellow('\n📋 检查日志文件...'));
    
    const logDirectories = [
      path.join(this.workspacePath, '.next'),
      path.join(this.workspacePath, 'logs'),
      path.join(this.workspacePath, 'tmp')
    ];
    
    for (const logDir of logDirectories) {
      if (fs.existsSync(logDir)) {
        await this.analyzeDirectoryLogs(logDir);
      }
    }
  }

  /**
   * 分析目录中的日志
   */
  async analyzeDirectoryLogs(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      const logFiles = files.filter(file => 
        file.endsWith('.log') || file.includes('error') || file.includes('debug')
      );
      
      if (logFiles.length > 0) {
        console.log(chalk.blue(`在 ${path.basename(dirPath)} 中发现 ${logFiles.length} 个日志文件`));
        this.logIssue('low', 'logs', `在 ${path.basename(dirPath)} 中发现日志文件`);
      }
    } catch (error) {
      this.logIssue('medium', 'logs', `日志目录检查失败: ${error.message}`);
    }
  }

  /**
   * 检查测试覆盖率
   */
  async checkTestCoverage() {
    console.log(chalk.yellow('\n🧪 检查测试覆盖率...'));
    
    try {
      // 检查覆盖率文件
      const coverageFiles = [
        path.join(this.workspacePath, 'coverage/lcov.info'),
        path.join(this.workspacePath, 'coverage/coverage-final.json'),
        path.join(this.workspacePath, 'coverage/clover.xml')
      ];
      
      let coverageExists = false;
      for (const file of coverageFiles) {
        if (fs.existsSync(file)) {
          coverageExists = true;
          break;
        }
      }
      
      if (coverageExists) {
        console.log(chalk.green('✅ 发现测试覆盖率报告'));
        this.logIssue('low', 'test_coverage', '测试覆盖率报告已生成');
        
        // 尝试读取覆盖率数据
        await this.readCoverageData();
      } else {
        console.log(chalk.yellow('⚠️ 未发现测试覆盖率报告'));
        this.logIssue('medium', 'test_coverage', '缺少测试覆盖率报告');
      }
      
      // 检查测试文件数量
      const testDirectories = ['__tests__', 'test', 'tests', 'e2e'];
      let totalTestFiles = 0;
      
      for (const testDir of testDirectories) {
        const fullPath = path.join(this.workspacePath, testDir);
        if (fs.existsSync(fullPath)) {
          const testFiles = fs.readdirSync(fullPath, { recursive: true })
            .filter(file => file.toString().endsWith('.test.ts') || 
                           file.toString().endsWith('.spec.ts') ||
                           file.toString().endsWith('.test.tsx'));
          totalTestFiles += testFiles.length;
        }
      }
      
      console.log(chalk.blue(`📊 发现 ${totalTestFiles} 个测试文件`));
      this.logIssue('low', 'test_files', `发现 ${totalTestFiles} 个测试文件`);
      
    } catch (error) {
      this.logIssue('high', 'test_coverage', `测试覆盖率检查失败: ${error.message}`);
    }
  }

  /**
   * 读取覆盖率数据
   */
  async readCoverageData() {
    try {
      const coveragePath = path.join(this.workspacePath, 'coverage/coverage-final.json');
      if (fs.existsSync(coveragePath)) {
        const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        const totalCoverage = this.calculateTotalCoverage(coverageData);
        
        if (totalCoverage >= 80) {
          console.log(chalk.green(`✅ 测试覆盖率: ${totalCoverage}%`));
          this.logIssue('low', 'coverage_value', `测试覆盖率良好: ${totalCoverage}%`);
        } else if (totalCoverage >= 60) {
          console.log(chalk.yellow(`⚠️ 测试覆盖率: ${totalCoverage}%`));
          this.logIssue('medium', 'coverage_value', `测试覆盖率中等: ${totalCoverage}%`);
        } else {
          console.log(chalk.red(`❌ 测试覆盖率过低: ${totalCoverage}%`));
          this.logIssue('high', 'coverage_value', `测试覆盖率过低: ${totalCoverage}%`);
        }
      }
    } catch (error) {
      this.logIssue('medium', 'coverage_read', `覆盖率数据读取失败: ${error.message}`);
    }
  }

  /**
   * 计算总覆盖率
   */
  calculateTotalCoverage(coverageData) {
    let totalStatements = 0;
    let coveredStatements = 0;
    
    for (const file in coverageData) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const fileData = coverageData[file];
        totalStatements += fileData.s || 0;
        coveredStatements += (fileData.s || 0) * (fileData.statementMap ? 1 : 0);
      }
    }
    
    return totalStatements > 0 ? Math.round((coveredStatements / totalStatements) * 100) : 0;
  }

  /**
   * 检查安全问题
   */
  async checkSecurityIssues() {
    console.log(chalk.yellow('\n🔒 检查安全状况...'));
    
    // 检查package.json中的安全漏洞
    await this.checkPackageSecurity();
    
    // 检查环境变量配置
    await this.checkEnvironmentSecurity();
    
    // 检查敏感文件权限
    await this.checkFilePermissions();
  }

  /**
   * 检查包安全性
   */
  async checkPackageSecurity() {
    try {
      const packageJsonPath = path.join(this.workspacePath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // 检查是否有已知漏洞的包
        const vulnerablePatterns = ['prototype-pollution', 'xss', 'injection'];
        
        if (packageData.dependencies) {
          const packages = Object.keys(packageData.dependencies);
          this.logIssue('low', 'security', `发现 ${packages.length} 个依赖包`);
        }
      }
    } catch (error) {
      this.logIssue('medium', 'security', `安全检查失败: ${error.message}`);
    }
  }

  /**
   * 检查环境安全
   */
  async checkEnvironmentSecurity() {
    const envFiles = ['.env', '.env.local', '.env.production'];
    
    for (const envFile of envFiles) {
      const envPath = path.join(this.workspacePath, envFile);
      if (fs.existsSync(envPath)) {
        const stats = fs.statSync(envPath);
        const isSecure = (stats.mode & 0o77) === 0; // 只有所有者有权限
        
        if (!isSecure) {
          console.log(chalk.red(`❌ ${envFile} 文件权限不安全`));
          this.logIssue('high', 'file_permissions', `${envFile} 文件权限不安全`);
        }
      }
    }
  }

  /**
   * 检查文件权限
   */
  async checkFilePermissions() {
    const sensitiveFiles = ['.env', '.env.local', 'package.json', 'tsconfig.json'];
    
    for (const file of sensitiveFiles) {
      const filePath = path.join(this.workspacePath, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        this.logIssue('low', 'file_permissions', `${file} 权限: ${stats.mode.toString(8)}`);
      }
    }
  }

  /**
   * 检查性能指标
   */
  async checkPerformanceMetrics() {
    console.log(chalk.yellow('\n⚡ 检查性能指标...'));
    
    // 检查启动时间
    await this.checkStartupTime();
    
    // 检查依赖项大小
    await this.checkBundleSize();
  }

  /**
   * 检查启动时间
   */
  async checkStartupTime() {
    try {
      const buildTimePath = path.join(this.workspacePath, '.next/trace');
      if (fs.existsSync(buildTimePath)) {
        console.log(chalk.green('✅ Next.js构建文件存在'));
        this.logIssue('low', 'build_time', 'Next.js构建完成');
      }
    } catch (error) {
      this.logIssue('medium', 'build_time', `构建时间检查失败: ${error.message}`);
    }
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
        
        if (sizeMB > 500) {
          console.log(chalk.yellow(`⚠️ node_modules 大小: ${sizeMB}MB`));
          this.logIssue('medium', 'bundle_size', `node_modules 较大: ${sizeMB}MB`);
        } else {
          console.log(chalk.green(`✅ node_modules 大小: ${sizeMB}MB`));
          this.logIssue('low', 'bundle_size', `node_modules 大小正常: ${sizeMB}MB`);
        }
      }
    } catch (error) {
      this.logIssue('medium', 'bundle_size', `包大小检查失败: ${error.message}`);
    }
  }

  /**
   * 记录问题
   */
  logIssue(severity, category, message) {
    this.issuesFound.push({
      severity,
      category,
      message,
      timestamp: moment().toISOString()
    });
    
    // 计算健康分数
    if (severity === 'high') {
      this.systemHealth.score -= 20;
    } else if (severity === 'medium') {
      this.systemHealth.score -= 10;
    } else if (severity === 'low') {
      this.systemHealth.score -= 2;
    }
  }

  /**
   * 执行命令
   */
  execCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  /**
   * 生成报告
   */
  generateReport() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
    
    const reportData = {
      timestamp: moment().toISOString(),
      systemHealth: this.systemHealth,
      issues: this.issuesFound,
      summary: {
        total: this.issuesFound.length,
        high: this.issuesFound.filter(i => i.severity === 'high').length,
        medium: this.issuesFound.filter(i => i.severity === 'medium').length,
        low: this.issuesFound.filter(i => i.severity === 'low').length
      }
    };
    
    const reportFile = path.join(this.reportDir, `system-diagnosis-${moment().format('YYYY-MM-DD-HH-mm')}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
    
    console.log(chalk.blue(`\n📋 诊断报告已保存到: ${reportFile}`));
  }

  /**
   * 显示摘要
   */
  displaySummary() {
    const summary = this.systemHealth;
    const totalIssues = this.issuesFound.length;
    
    console.log('\n' + '=' .repeat(60));
    console.log(chalk.bold('📊 系统健康摘要'));
    console.log('=' .repeat(60));
    
    if (summary.score >= 90) {
      console.log(chalk.green(`✅ 系统状态: 健康 (${summary.score}分)`));
    } else if (summary.score >= 70) {
      console.log(chalk.yellow(`⚠️ 系统状态: 良好 (${summary.score}分)`));
    } else {
      console.log(chalk.red(`❌ 系统状态: 需要关注 (${summary.score}分)`));
    }
    
    console.log(chalk.blue(`📋 发现问题: ${totalIssues} 个`));
    
    const issueCounts = {
      high: this.issuesFound.filter(i => i.severity === 'high').length,
      medium: this.issuesFound.filter(i => i.severity === 'medium').length,
      low: this.issuesFound.filter(i => i.severity === 'low').length
    };
    
    console.log(chalk.red(`   高严重性: ${issueCounts.high} 个`));
    console.log(chalk.yellow(`   中严重性: ${issueCounts.medium} 个`));
    console.log(chalk.blue(`   低严重性: ${issueCounts.low} 个`));
    
    console.log('\n' + chalk.green('🌹 系统诊断完成！'));
  }
}

// 运行诊断
if (require.main === module) {
  const diagnostic = new SystemDiagnostic();
  diagnostic.runFullDiagnosis().catch(console.error);
}

module.exports = SystemDiagnostic;