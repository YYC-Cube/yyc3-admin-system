#!/usr/bin/env node

/**
 * 安全扫描器主程序
 * @description 整合多个安全工具的结果，生成综合安全报告
 * @author YYC
 * @created 2024-10-15
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityScanner {
  constructor() {
    this.threshold = 80; // 安全分数阈值
    this.reports = {
      eslint: null,
      audit: null,
      safety: null,
      retire: null,
      semgrep: null
    };
  }

  /**
   * 执行完整的安全扫描
   */
  async runFullScan() {
    console.log('🔒 开始执行安全扫描...');
    
    try {
      await this.runEslintScan();
      await this.runNpmAudit();
      await this.runSafetyScan();
      await this.runRetireScan();
      await this.runSemgrepScan();
      
      const score = this.calculateSecurityScore();
      this.generateReport(score);
      
      if (score < this.threshold) {
        console.error(`❌ 安全分数 ${score} 低于阈值 ${this.threshold}`);
        process.exit(1);
      } else {
        console.log(`✅ 安全分数 ${score} 达到要求`);
      }
      
    } catch (error) {
      console.error('🚨 安全扫描失败:', error.message);
      process.exit(1);
    }
  }

  /**
   * 运行 ESLint 安全规则检查
   */
  async runEslintScan() {
    console.log('📋 运行 ESLint 安全检查...');
    
    try {
      const result = execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.security.config.mjs --format=json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      this.reports.eslint = JSON.parse(result);
      console.log(`   ESLint 检查完成，发现 ${this.reports.eslint.length} 个问题`);
      
    } catch (error) {
      if (error.stdout) {
        try {
          this.reports.eslint = JSON.parse(error.stdout);
          console.log(`   ESLint 检查完成，发现 ${this.reports.eslint.length} 个问题`);
        } catch (parseError) {
          console.warn('   ESLint 输出格式异常，跳过解析');
          this.reports.eslint = [];
        }
      } else {
        console.warn('   ESLint 检查跳过:', error.message);
        this.reports.eslint = [];
      }
    }
  }

  /**
   * 运行 npm audit 检查
   */
  async runNpmAudit() {
    console.log('📦 运行 npm audit 检查...');
    
    try {
      const result = execSync('npm audit --json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      this.reports.audit = JSON.parse(result);
      console.log('   npm audit 检查完成');
      
    } catch (error) {
      if (error.stdout) {
        this.reports.audit = JSON.parse(error.stdout);
      } else {
        console.warn('   npm audit 检查跳过:', error.message);
        this.reports.audit = { vulnerabilities: {} };
      }
    }
  }

  /**
   * 运行 Safety 检查
   */
  async runSafetyScan() {
    console.log('🛡️  运行 Safety 检查...');
    
    try {
      const result = execSync('safety check --json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      this.reports.safety = JSON.parse(result);
      console.log('   Safety 检查完成');
      
    } catch (error) {
      if (error.stdout) {
        try {
          this.reports.safety = JSON.parse(error.stdout);
        } catch (parseError) {
          console.warn('   Safety 输出格式异常，跳过解析');
          this.reports.safety = [];
        }
      } else {
        console.warn('   Safety 检查跳过:', error.message);
        this.reports.safety = [];
      }
    }
  }

  /**
   * 运行 Retire.js 检查
   */
  async runRetireScan() {
    console.log('🔍 运行 Retire.js 检查...');
    
    try {
      const result = execSync('retire --outputformat json', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      this.reports.retire = JSON.parse(result);
      console.log('   Retire.js 检查完成');
      
    } catch (error) {
      if (error.stdout) {
        this.reports.retire = JSON.parse(error.stdout);
      } else {
        console.warn('   Retire.js 检查跳过:', error.message);
        this.reports.retire = [];
      }
    }
  }

  /**
   * 运行 Semgrep 检查
   */
  async runSemgrepScan() {
    console.log('🔎 运行 Semgrep 检查...');
    
    try {
      const result = execSync('semgrep --config=auto --json .', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      this.reports.semgrep = JSON.parse(result);
      console.log('   Semgrep 检查完成');
      
    } catch (error) {
      if (error.stdout) {
        this.reports.semgrep = JSON.parse(error.stdout);
      } else {
        console.warn('   Semgrep 检查跳过:', error.message);
        this.reports.semgrep = { results: [] };
      }
    }
  }

  /**
   * 计算综合安全分数
   */
  calculateSecurityScore() {
    let score = 100;
    
    // ESLint 安全问题扣分
    if (this.reports.eslint) {
      const eslintErrors = this.reports.eslint.filter(rule => 
        rule.errorCount > 0 || rule.warningCount > 0
      ).length;
      score -= Math.min(eslintErrors * 2, 20);
    }
    
    // npm audit 漏洞扣分
    if (this.reports.audit && this.reports.audit.vulnerabilities) {
      const vulns = this.reports.audit.vulnerabilities;
      score -= (vulns.high || 0) * 5;
      score -= (vulns.moderate || 0) * 2;
      score -= (vulns.low || 0) * 1;
    }
    
    // Safety 漏洞扣分
    if (this.reports.safety && this.reports.safety.length > 0) {
      score -= this.reports.safety.length * 3;
    }
    
    // Retire.js 漏洞扣分
    if (this.reports.retire && this.reports.retire.length > 0) {
      score -= this.reports.retire.length * 2;
    }
    
    // Semgrep 问题扣分
    if (this.reports.semgrep && this.reports.semgrep.results) {
      score -= Math.min(this.reports.semgrep.results.length * 1, 15);
    }
    
    return Math.max(score, 0);
  }

  /**
   * 生成安全报告
   */
  generateReport(score) {
    const reportPath = path.join(process.cwd(), 'security-report.md');
    
    let report = `# 🔒 安全扫描报告\n\n`;
    report += `**扫描时间**: ${new Date().toISOString()}\n`;
    report += `**安全分数**: ${score}/100\n`;
    report += `**状态**: ${score >= this.threshold ? '✅ 通过' : '❌ 失败'}\n\n`;
    
    // ESLint 结果
    report += `## 📋 ESLint 安全检查\n`;
    if (this.reports.eslint && this.reports.eslint.length > 0) {
      report += `发现 ${this.reports.eslint.length} 个文件存在问题:\n`;
      this.reports.eslint.forEach(file => {
        report += `- ${file.filePath}: ${file.errorCount} 错误, ${file.warningCount} 警告\n`;
      });
    } else {
      report += `✅ 未发现安全问题\n`;
    }
    report += '\n';
    
    // npm audit 结果
    report += `## 📦 依赖漏洞检查\n`;
    if (this.reports.audit && this.reports.audit.metadata) {
      const metadata = this.reports.audit.metadata;
      report += `- 高危漏洞: ${metadata.vulnerabilities.high || 0}\n`;
      report += `- 中危漏洞: ${metadata.vulnerabilities.moderate || 0}\n`;
      report += `- 低危漏洞: ${metadata.vulnerabilities.low || 0}\n`;
    } else {
      report += `✅ 未发现依赖漏洞\n`;
    }
    report += '\n';
    
    // Safety 结果
    report += `## 🛡️  Safety 检查结果\n`;
    if (this.reports.safety && this.reports.safety.length > 0) {
      report += `发现 ${this.reports.safety.length} 个安全漏洞:\n`;
      this.reports.safety.forEach(vuln => {
        report += `- ${vuln.package_name}: ${vuln.vulnerability_summary}\n`;
      });
    } else {
      report += `✅ 未发现 Safety 漏洞\n`;
    }
    report += '\n';
    
    // Retire.js 结果
    report += `## 🔍 Retire.js 检查结果\n`;
    if (this.reports.retire && this.reports.retire.length > 0) {
      report += `发现 ${this.reports.retire.length} 个过时组件:\n`;
      this.reports.retire.forEach(file => {
        report += `- ${file.file}: 使用了过时的库\n`;
      });
    } else {
      report += `✅ 未发现过时组件\n`;
    }
    report += '\n';
    
    // Semgrep 结果
    report += `## 🔎 Semgrep 检查结果\n`;
    if (this.reports.semgrep && this.reports.semgrep.results) {
      report += `发现 ${this.reports.semgrep.results.length} 个安全问题:\n`;
      this.reports.semgrep.results.slice(0, 10).forEach(result => {
        report += `- ${result.path}:${result.start.line} - ${result.message}\n`;
      });
    } else {
      report += `✅ 未发现代码安全问题\n`;
    }
    
    fs.writeFileSync(reportPath, report);
    console.log(`📄 安全报告已生成: ${reportPath}`);
  }
}

// 命令行参数解析
const args = process.argv.slice(2);
const threshold = args.includes('--threshold') 
  ? parseInt(args[args.indexOf('--threshold') + 1]) 
  : 80;

const report = args.includes('--report') 
  ? args[args.indexOf('--report') + 1] 
  : 'security-report.json';

// 运行扫描
const scanner = new SecurityScanner();
scanner.threshold = threshold;
scanner.runFullScan().catch(console.error);