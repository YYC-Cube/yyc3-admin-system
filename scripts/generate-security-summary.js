#!/usr/bin/env node

/**
 * 安全报告生成器
 * @description 整合多个安全工具结果，生成可读的安全报告
 * @author YYC
 * @created 2024-10-15
 */

const fs = require('fs');
const path = require('path');

class SecurityReportGenerator {
  constructor() {
    this.artifacts = [];
    this.report = '';
  }

  /**
   * 生成综合安全报告
   */
  generateSummaryReport() {
    this.generateHeader();
    this.processEslintReport();
    this.processAuditReport();
    this.processSafetyReport();
    this.processRetireReport();
    this.processSemgrepReport();
    this.generateRecommendations();
    this.generateFooter();
    
    return this.report;
  }

  /**
   * 生成报告头部
   */
  generateHeader() {
    this.report += `# 🔒 YYC3 Admin System - 安全扫描报告\n\n`;
    this.report += `**项目**: yyc3-admin-system-2\n`;
    this.report += `**扫描时间**: ${new Date().toLocaleString('zh-CN')}\n`;
    this.report += `**扫描工具**: ESLint, npm audit, Safety, Retire.js, Semgrep\n`;
    this.report += `---\n\n`;
  }

  /**
   * 处理 ESLint 报告
   */
  processEslintReport() {
    const eslintFile = 'security-report.json';
    
    this.report += `## 📋 ESLint 安全规则检查\n\n`;
    
    if (fs.existsSync(eslintFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(eslintFile, 'utf8'));
        
        if (Array.isArray(data) && data.length > 0) {
          let totalErrors = 0;
          let totalWarnings = 0;
          
          data.forEach(file => {
            totalErrors += file.errorCount || 0;
            totalWarnings += file.warningCount || 0;
          });
          
          this.report += `**总计**: ${data.length} 个文件, ${totalErrors} 错误, ${totalWarnings} 警告\n\n`;
          
          // 显示前10个最严重的问题
          const criticalFiles = data
            .filter(file => file.errorCount > 0 || file.warningCount > 0)
            .sort((a, b) => (b.errorCount + b.warningCount) - (a.errorCount + a.warningCount))
            .slice(0, 10);
          
          if (criticalFiles.length > 0) {
            this.report += `### 需要关注的主要文件:\n\n`;
            criticalFiles.forEach(file => {
              this.report += `- **${file.filePath}**: ${file.errorCount} 错误, ${file.warningCount} 警告\n`;
            });
            this.report += `\n`;
          }
        } else {
          this.report += `✅ **未发现 ESLint 安全问题**\n\n`;
        }
      } catch (error) {
        this.report += `❌ **ESLint 报告解析失败**: ${error.message}\n\n`;
      }
    } else {
      this.report += `⚠️ **ESLint 报告文件不存在**\n\n`;
    }
  }

  /**
   * 处理 npm audit 报告
   */
  processAuditReport() {
    this.report += `## 📦 npm 依赖漏洞检查\n\n`;
    
    try {
      const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
      const audit = JSON.parse(auditResult);
      
      if (audit.metadata) {
        const vulns = audit.metadata.vulnerabilities;
        this.report += `**漏洞统计**:\n`;
        this.report += `- 🔴 高危: ${vulns.high || 0}\n`;
        this.report += `- 🟡 中危: ${vulns.moderate || 0}\n`;
        this.report += `- 🟢 低危: ${vulns.low || 0}\n`;
        this.report += `- 📊 总计: ${vulns.total || 0}\n\n`;
        
        if (vulns.total > 0) {
          this.report += `### 修复建议:\n`;
          this.report += `\`\`\`bash\nnpm audit fix\n# 或手动升级受影响的包\nnpm update <package-name>\n\`\`\`\n\n`;
        }
      } else {
        this.report += `✅ **未发现依赖漏洞**\n\n`;
      }
      
    } catch (error) {
      if (error.stdout) {
        try {
          const audit = JSON.parse(error.stdout);
          const vulns = audit.metadata?.vulnerabilities || {};
          this.report += `**漏洞统计**: ${vulns.total || 0} 个漏洞\n\n`;
          
          if (vulns.high > 0) {
            this.report += `🔴 **发现 ${vulns.high} 个高危漏洞，需要立即处理!**\n\n`;
          }
        } catch (parseError) {
          this.report += `⚠️ **npm audit 检查异常**\n\n`;
        }
      } else {
        this.report += `✅ **依赖检查完成，未发现问题**\n\n`;
      }
    }
  }

  /**
   * 处理 Safety 报告
   */
  processSafetyReport() {
    this.report += `## 🛡️  Safety Python 包检查\n\n`;
    
    try {
      const safetyResult = execSync('safety check --json', { encoding: 'utf8' });
      const safety = JSON.parse(safetyResult);
      
      if (Array.isArray(safety) && safety.length > 0) {
        this.report += `**发现 ${safety.length} 个 Python 包漏洞**:\n\n`;
        
        safety.forEach(vuln => {
          this.report += `- **${vuln.package_name}** (v${vuln.installed_version})\n`;
          this.report += `  - ${vuln.vulnerability_summary}\n`;
          this.report += `  - 建议升级到 v${vuln.spec}\n\n`;
        });
      } else {
        this.report += `✅ **Safety 检查通过，未发现漏洞**\n\n`;
      }
      
    } catch (error) {
      if (error.stdout) {
        try {
          const safety = JSON.parse(error.stdout);
          if (Array.isArray(safety) && safety.length > 0) {
            this.report += `⚠️ **发现 ${safety.length} 个 Python 包漏洞**\n\n`;
          } else {
            this.report += `✅ **Safety 检查通过**\n\n`;
          }
        } catch (parseError) {
          this.report += `⚠️ **Safety 检查异常**\n\n`;
        }
      } else {
        this.report += `✅ **Safety 检查未运行**\n\n`;
      }
    }
  }

  /**
   * 处理 Retire.js 报告
   */
  processRetireReport() {
    this.report += `## 🔍 Retire.js 过时组件检查\n\n`;
    
    try {
      const retireResult = execSync('retire --outputformat json', { encoding: 'utf8' });
      const retire = JSON.parse(retireResult);
      
      if (Array.isArray(retire) && retire.length > 0) {
        this.report += `**发现 ${retire.length} 个文件使用过时库**:\n\n`;
        
        retire.slice(0, 10).forEach(file => {
          this.report += `- **${file.file}**\n`;
          if (file.results) {
            file.results.forEach(result => {
              this.report += `  - ${result.component} v${result.version}: ${result.summary}\n`;
            });
          }
        });
        
        if (retire.length > 10) {
          this.report += `*...还有 ${retire.length - 10} 个文件*\n`;
        }
        
        this.report += `\n### 修复建议:\n`;
        this.report += `更新过时的库版本或寻找替代方案\n\n`;
        
      } else {
        this.report += `✅ **未发现过时组件**\n\n`;
      }
      
    } catch (error) {
      if (error.stdout) {
        try {
          const retire = JSON.parse(error.stdout);
          if (Array.isArray(retire) && retire.length > 0) {
            this.report += `⚠️ **发现 ${retire.length} 个文件使用过时库**\n\n`;
          } else {
            this.report += `✅ **Retire.js 检查通过**\n\n`;
          }
        } catch (parseError) {
          this.report += `⚠️ **Retire.js 检查异常**\n\n`;
        }
      } else {
        this.report += `✅ **Retire.js 检查未运行**\n\n`;
      }
    }
  }

  /**
   * 处理 Semgrep 报告
   */
  processSemgrepReport() {
    this.report += `## 🔎 Semgrep 静态分析检查\n\n`;
    
    const semgrepFile = 'semgrep-report.json';
    
    if (fs.existsSync(semgrepFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(semgrepFile, 'utf8'));
        
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          this.report += `**发现 ${data.results.length} 个潜在安全问题**:\n\n`;
          
          // 按严重程度分组
          const critical = data.results.filter(r => r.extra.severity === 'ERROR');
          const warning = data.results.filter(r => r.extra.severity === 'WARNING');
          const info = data.results.filter(r => r.extra.severity === 'INFO');
          
          if (critical.length > 0) {
            this.report += `### 🔴 严重问题 (${critical.length})\n\n`;
            critical.slice(0, 5).forEach(result => {
              this.report += `**${result.path}:${result.start.line}**\n`;
              this.report += `- 规则: ${result.check_id}\n`;
              this.report += `- ${result.message}\n\n`;
            });
          }
          
          if (warning.length > 0) {
            this.report += `### 🟡 警告 (${warning.length})\n\n`;
            warning.slice(0, 5).forEach(result => {
              this.report += `**${result.path}:${result.start.line}**\n`;
              this.report += `- ${result.message}\n\n`;
            });
          }
          
        } else {
          this.report += `✅ **Semgrep 检查未发现问题**\n\n`;
        }
        
      } catch (error) {
        this.report += `❌ **Semgrep 报告解析失败**: ${error.message}\n\n`;
      }
    } else {
      this.report += `⚠️ **Semgrep 报告文件不存在**\n\n`;
    }
  }

  /**
   * 生成修复建议
   */
  generateRecommendations() {
    this.report += `## 🎯 安全改进建议\n\n`;
    
    this.report += `### 立即处理\n`;
    this.report += `1. **修复高危漏洞**: 优先处理 ESLint 错误和 npm audit 中的高危漏洞\n`;
    this.report += `2. **更新依赖包**: 运行 \`npm audit fix\` 修复已知漏洞\n`;
    this.report += `3. **移除过时库**: 使用 Retire.js 报告识别需要更新的库\n\n`;
    
    this.report += `### 中期优化\n`;
    this.report += `1. **加强代码审查**: 对新代码进行安全审查\n`;
    this.report += `2. **建立安全门禁**: 在 CI/CD 中集成安全检查\n`;
    this.report += `3. **定期扫描**: 每周运行安全扫描\n\n`;
    
    this.report += `### 长期改进\n`;
    this.report += `1. **安全培训**: 提升团队安全意识\n`;
    this.report += `2. **安全架构**: 考虑安全开发生命周期 (SDLC)\n`;
    this.report += `3. **监控告警**: 实施实时安全监控\n\n`;
  }

  /**
   * 生成报告尾部
   */
  generateFooter() {
    this.report += `---\n\n`;
    this.report += `**生成时间**: ${new Date().toISOString()}\n`;
    this.report += `**工具版本**: ESLint, npm audit, Safety, Retire.js, Semgrep\n`;
    this.report += `**报告生成器**: YYC Security Scanner v1.0.0\n\n`;
    
    this.report += `> 💡 **提示**: 定期运行安全扫描有助于及早发现和修复安全漏洞！\n`;
  }

  /**
   * 保存报告到文件
   */
  saveReport(filename = 'security-summary.md') {
    const content = this.generateSummaryReport();
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`📄 安全报告已保存到: ${filename}`);
    return content;
  }
}

// 引入 execSync
const { execSync } = require('child_process');

// 如果直接运行此脚本
if (require.main === module) {
  const generator = new SecurityReportGenerator();
  generator.saveReport();
}

module.exports = SecurityReportGenerator;