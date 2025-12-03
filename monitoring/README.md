# 🚀 统一监控告警系统

YYC3 Admin System 的完整监控解决方案，提供性能监控、错误跟踪和实时告警功能。

## 📋 功能特性

### 🎯 核心功能

- **性能监控**: 实时监控内存、CPU、磁盘、响应时间
- **错误监控**: 自动检测和分析应用错误模式  
- **统一仪表板**: 可视化监控状态和历史数据
- **智能告警**: 多级别告警（critical/warning/info）
- **系统兼容性**: 支持 macOS/Linux/Windows

### 🔧 监控指标

**性能指标**:

- 响应时间监控 (阈值: 2000ms)
- 内存使用率 (阈值: 80%)
- CPU使用率 (阈值: 70%)
- 磁盘使用率 (阈值: 85%)
- 应用健康状态检查

**错误指标**:

- 错误频率监控 (阈值: 10/小时)
- 严重错误统计 (阈值: 3/小时)
- 错误模式分析
- 日志文件大小监控
- 系统进程状态

## 🛠️ 快速开始

### 1. 单次监控检查

```bash
# 运行综合监控
npm run monitor

# 或直接执行脚本
node monitoring/scripts/unified-monitor.js
```

### 2. 持续监控模式

```bash
# 启动持续监控
npm run monitor:continuous

# 或
node monitoring/scripts/unified-monitor.js --continuous
```

### 3. 单独监控模块

```bash
# 仅性能监控
npm run monitor:performance

# 仅错误监控  
npm run monitor:errors

# 性能持续监控
npm run monitor:performance:continuous
```

## 📊 仪表板访问

监控仪表板会自动生成在：

```
monitoring/reports/dashboard.html
```

### 查看仪表板

```bash
# macOS
open monitoring/reports/dashboard.html

# Linux  
xdg-open monitoring/reports/dashboard.html

# Windows
start monitoring/reports/dashboard.html
```

## 📁 文件结构

```
monitoring/
├── scripts/              # 监控脚本
│   ├── unified-monitor.js    # 综合监控主控
│   ├── performance-monitor.js # 性能监控
│   └── error-monitor.js      # 错误监控
├── reports/             # 监控报告
│   ├── dashboard.html        # 实时仪表板
│   └── *.json               # 历史报告
├── alerts/              # 告警文件
│   └── *.json               # 告警记录
├── configs/             # 配置文件
│   └── *.json               # 监控配置
└── package.json         # 监控依赖
```

## 🚨 告警系统

### 告警级别

- **🚨 Critical**: 系统关键问题，需要立即处理
- **⚠️ Warning**: 性能警告，建议关注
- **ℹ️ Info**: 信息提示，供参考

### 告警类型

- 高内存使用 (memory > 80%)
- 高CPU使用 (cpu > 70%)
- 响应时间过长 (responseTime > 2000ms)
- 应用不健康 (HTTP错误)
- 错误率过高 (errorRate > 5%)
- 严重错误 (critical errors > 3)

### 告警文件

所有告警都会保存在 `monitoring/alerts/` 目录中：

```bash
# 查看最新告警
ls -lt monitoring/alerts/ | head -10
```

## ⚙️ 配置选项

### 阈值配置

在 `monitoring/scripts/*.js` 中修改阈值：

```javascript
const CONFIG = {
  thresholds: {
    responseTime: 2000,    // 响应时间阈值 (ms)
    memoryUsage: 80,       // 内存使用阈值 (%)
    cpuUsage: 70,          // CPU使用阈值 (%)
    diskUsage: 85,         // 磁盘使用阈值 (%)
    errorRate: 5           // 错误率阈值 (%)
  },
  intervals: {
    healthCheck: 30000,    // 健康检查间隔 (ms)
    metrics: 60000         // 指标收集间隔 (ms)
  }
};
```

### 监控间隔

```javascript
const CONFIG = {
  intervals: {
    performance: 60000,    // 性能检查间隔 (1分钟)
    error: 300000,         // 错误检查间隔 (5分钟)  
    dashboard: 300000      // 仪表板更新间隔 (5分钟)
  }
};
```

## 🔧 故障排除

### 常见问题

**1. 权限问题**

```bash
# 确保脚本有执行权限
chmod +x monitoring/scripts/*.js
```

**2. Node.js版本要求**

```bash
# 检查Node.js版本
node --version  # 需要 >= 16.0.0
```

**3. 系统命令兼容性**

- 监控系统已优化支持 macOS/Linux
- 如遇命令不存在，会使用默认值

**4. 端口冲突**

- 监控检查端口: 3000 (Next.js默认)
- 如需更改，在脚本中修改 `http://localhost:YOUR_PORT`

## 📈 集成CI/CD

### GitHub Actions 集成

```yaml
# .github/workflows/monitoring.yml
name: Monitor
on:
  schedule:
    - cron: '*/5 * * * *'  # 每5分钟
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node monitoring/scripts/unified-monitor.js
```

## 🧹 维护命令

### 清理旧文件

```bash
# 清理7天前的告警文件
npm run cleanup

# 或手动清理
find monitoring/alerts/ -name "*.json" -mtime +7 -delete
find monitoring/reports/ -name "*.json" -mtime +30 -delete
```

### 查看监控历史

```bash
# 查看所有报告
npm run reports

# 查看所有告警
npm run alerts
```

## 📞 技术支持

- **项目**: YYC3 Admin System  
- **文档**: `/docs` 目录
- **测试**: `/__tests__/monitoring`
- **支持**: 创建 Issue 或提交 PR

---

**保持系统健康，持续监控先行！** 🌹

> 📝 **提示**: 建议在生产环境中配置持续监控模式，并定期检查仪表板以了解系统健康状况。
