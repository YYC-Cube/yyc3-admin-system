# 🔧 问题诊断与故障排查工具包

## 📖 工具简介

这是一个专为现代Web应用开发设计的**智能问题诊断和故障排查工具包**，提供全面的系统监控、性能分析、错误诊断和安全扫描功能。

### 🌟 主要特性

- **🚀 快速诊断**: 5分钟内完成系统健康状况检查
- **🔍 深度分析**: 全面的系统诊断和故障排查
- **🚨 错误监控**: 智能错误模式识别和日志分析
- **⚡ 性能优化**: 性能瓶颈检测和优化建议
- **🔒 安全扫描**: 安全漏洞检测和风险评估
- **📊 智能报告**: 生成详细的可视化诊断报告

## 📂 目录结构

```
problems_and_diagnostics/
├── package.json              # 工具包配置和依赖
├── diagnose.sh              # 🚀 快速启动脚本
├── configs/
│   └── config.json          # ⚙️ 配置文件
├── scripts/
│   ├── system-diagnosis.js  # 🔍 系统诊断引擎
│   ├── log-analyzer.js      # 📋 日志分析器
│   └── interactive-diagnostics.js  # 🖥️ 交互式诊断界面
└── reports/
    └── *.json               # 📊 诊断报告文件
```

## 🚀 快速开始

### 1. 基本使用

```bash
# 进入诊断工具目录
cd problems_and_diagnostics

# 启动交互式诊断（推荐）
./diagnose.sh

# 或直接运行Node.js脚本
node scripts/interactive-diagnostics.js
```

### 2. 命令行选项

```bash
# 查看帮助
./diagnose.sh --help

# 快速系统检查（5分钟内）
./diagnose.sh --quick

# 完整系统诊断（10-15分钟）
./diagnose.sh --full

# 错误分析
./diagnose.sh --errors

# 性能检查
./diagnose.sh --performance

# 安全扫描
./diagnose.sh --security

# 查看历史报告
./diagnose.sh --report

# 系统健康检查
./diagnose.sh --health-check

# 安装依赖
./diagnose.sh --install-deps

# 清理旧报告
./diagnose.sh --clean-reports
```

## 🔧 功能模块详解

### 🚀 快速系统检查
- **磁盘空间监控**: 检查可用空间和使用率
- **内存使用分析**: 实时内存状态和泄漏检测
- **进程状态**: 检查Node.js和关键服务状态
- **关键文件**: 验证项目核心文件完整性

### 🔍 完整系统诊断
- **系统资源**: CPU、内存、磁盘、网络全面检测
- **应用健康**: Next.js应用状态和性能指标
- **依赖分析**: npm包版本和安全状态
- **配置检查**: 环境变量和配置文件验证
- **代码质量**: TypeScript配置和构建状态

### 🚨 错误分析与处理
- **日志扫描**: 自动发现和分析错误日志
- **模式识别**: 智能识别常见错误模式
- **堆栈跟踪**: 详细错误堆栈分析
- **趋势分析**: 错误频率和趋势统计

### ⚡ 性能检查与优化
- **包大小分析**: node_modules和构建产物分析
- **启动时间**: 应用启动性能评估
- **内存优化**: 内存使用模式和泄漏检测
- **构建性能**: 构建时间和产物大小分析

### 🔒 安全扫描
- **依赖漏洞**: npm包安全漏洞扫描
- **权限检查**: 文件和目录权限验证
- **敏感信息**: 密钥泄露和配置安全检查
- **安全头**: HTTP安全头配置检查

## ⚙️ 配置说明

### 主要配置项

编辑 `configs/config.json` 自定义诊断行为：

```json
{
  "settings": {
    "quick_check": {
      "timeout": 300000,
      "include_performance": true,
      "include_security": false,
      "max_issues_to_display": 10
    },
    "full_diagnosis": {
      "timeout": 900000,
      "include_bundle_analysis": true,
      "include_dependency_check": true,
      "generate_detailed_report": true
    }
  },
  "monitoring": {
    "auto_scan_interval": 3600000,
    "alert_thresholds": {
      "disk_usage_percent": 85,
      "memory_usage_percent": 80,
      "error_rate_per_hour": 50
    }
  }
}
```

### 通知配置

```json
{
  "notifications": {
    "enable_slack_notifications": false,
    "enable_email_alerts": false,
    "email_recipients": ["admin@example.com"]
  }
}
```

## 📊 报告生成

### 报告格式
- **JSON格式**: 机器可读的详细数据
- **HTML报告**: 可视化仪表板（规划中）
- **Markdown**: 文档友好的摘要报告

### 报告内容
- **系统状态概览**: 整体健康评分
- **问题清单**: 按严重程度分类的问题列表
- **优化建议**: 针对性的改进建议
- **历史趋势**: 多次诊断的对比分析

## 🛠️ 高级功能

### 自定义检查脚本

在 `configs/config.json` 中添加自定义脚本：

```json
{
  "advanced": {
    "custom_scripts": [
      {
        "name": "database_check",
        "command": "node scripts/custom/db-check.js",
        "enabled": true
      }
    ]
  }
}
```

### 集成第三方工具

支持集成常用开发工具：

```json
{
  "integrations": {
    "jira": {
      "enabled": false,
      "project_key": "PROJ"
    },
    "github": {
      "enabled": false,
      "repository": "username/repo"
    }
  }
}
```

## 🔄 自动化集成

### GitHub Actions 集成

```yaml
# .github/workflows/diagnostics.yml
name: System Diagnostics
on:
  schedule:
    - cron: '0 9 * * *'  # 每天上午9点运行
  workflow_dispatch:

jobs:
  diagnostic:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: |
          cd problems_and_diagnostics
          npm install
          ./diagnose.sh --full
```

### CI/CD 集成

```bash
# 在部署流水线中添加
npm run test
./diagnose.sh --quick || exit 1
npm run build
```

## 📈 最佳实践

### 1. 定期监控
- **每日**: 快速系统检查
- **每周**: 完整系统诊断
- **每次部署前**: 安全扫描和性能检查

### 2. 问题响应
- **高优先级**: 立即处理
- **中优先级**: 计划内处理
- **低优先级**: 定期清理

### 3. 报告管理
- 自动清理30天前的报告
- 保留关键指标的历史趋势
- 定期导出和备份报告数据

## 🐛 故障排查

### 常见问题

**1. 权限错误**
```bash
chmod +x diagnose.sh
chmod +x scripts/*.js
```

**2. 依赖缺失**
```bash
./diagnose.sh --install-deps
```

**3. 配置文件错误**
```bash
./diagnose.sh --config
# 编辑 configs/config.json
```

**4. 内存不足**
```bash
# 调整配置中的timeout值
"timeout": 600000  # 增加到10分钟
```

### 日志调试

```bash
# 启用详细日志
DEBUG=diagnostics:* ./diagnose.sh --full

# 查看详细错误
./diagnose.sh --full 2>&1 | tee diagnostic.log
```

## 🤝 贡献指南

### 开发环境设置

```bash
git clone <repository>
cd problems_and_diagnostics
npm install
npm test
```

### 添加新功能

1. 在 `scripts/` 目录创建新模块
2. 更新 `package.json` 添加脚本命令
3. 更新此README文档
4. 添加相应的测试用例

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🌹 致谢

感谢所有为提升代码质量和开发效率做出贡献的开发者们！

---

**保持代码健康，稳步前行！** 🌟