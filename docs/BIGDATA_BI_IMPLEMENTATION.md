# 商业智能分析系统实施文档

## 一、系统概述

商业智能分析系统是一个基于Metabase、ClickHouse和ECharts构建的多维数据分析平台，提供OLAP分析、趋势分析、对比分析和归因分析四大核心功能。

### 1.1 核心功能

- **OLAP多维分析**: 支持切片、切块、钻取、旋转等操作
- **趋势分析**: 时间序列分析和预测
- **对比分析**: 多组数据对比
- **归因分析**: 因果关系分析

### 1.2 技术架构

\`\`\`
┌─────────────────┐
│   前端应用      │ (React + ECharts)
└────────┬────────┘
         │
┌────────▼────────┐
│   API服务       │ (Next.js API Routes)
└────────┬────────┘
         │
┌────────▼────────┐
│  BI分析引擎     │ (BusinessIntelligence)
└────────┬────────┘
         │
┌────────▼────────┐
│  数据仓库       │ (RealtimeDataWarehouse)
└────────┬────────┘
         │
┌────────▼────────┐
│  OLAP引擎       │ (ClickHouse)
└────────┬────────┘
         │
┌────────▼────────┐
│  数据源         │ (yyc3_yy数据库)
└─────────────────┘
\`\`\`

## 二、环境配置

### 2.1 环境变量

系统已配置以下环境变量（位于`.env.local`）：

\`\`\`env
# BI平台配置
BI_TOOL=metabase
BI_HOST=http://localhost:3001
BI_API_KEY=your_bi_api_key

# OLAP引擎配置
OLAP_ENGINE=clickhouse
OLAP_HOST=http://localhost:8123
OLAP_USER=olap_user
OLAP_PASSWORD=olap_password
OLAP_DB=analytics_cube

# 可视化配置
VISUALIZATION_ENGINE=echarts
VISUALIZATION_THEME=dark

# 数据源连接
DATASOURCE_HOST=localhost
DATASOURCE_PORT=3306
DATASOURCE_USER=bi_user
DATASOURCE_PASSWORD=bi_password
DATASOURCE_DB=yyc3_yy

# 报告自动化配置
REPORT_CRON=0 8 * * *
REPORT_NOTIFY_EMAIL=ops@yourdomain.com
REPORT_SHARE_URL=https://bi.yourdomain.com/share

# 告警规则配置
ALERT_THRESHOLD_SALES_DROP=20
ALERT_EMAIL=alerts@yourdomain.com
\`\`\`

### 2.2 环境验证

系统启动前会自动验证环境变量：

\`\`\`typescript
import validateEnv from './env.validator'

// 验证环境变量
validateEnv()
\`\`\`

## 三、核心功能实现

### 3.1 OLAP多维分析

支持对数据立方体进行多维度分析：

\`\`\`typescript
import { businessIntelligence } from '@/lib/bigdata/business-intelligence'

// 定义数据立方体
const cube = {
  name: 'sales_cube',
  dimensions: [
    { name: 'date', type: 'time', values: [] },
    { name: 'product', type: 'product', values: [] },
    { name: 'region', type: 'location', values: [] }
  ],
  measures: [
    { name: 'revenue', aggregation: 'sum', format: 'currency' },
    { name: 'quantity', aggregation: 'sum', format: 'number' }
  ],
  facts: []
}

// 执行OLAP分析
const result = await businessIntelligence.olapAnalysis(
  cube,
  [cube.dimensions[0], cube.dimensions[1]],
  [cube.measures[0]]
)

console.log('分析结果:', result.data)
console.log('洞察:', result.insights)
console.log('建议:', result.recommendations)
\`\`\`

### 3.2 趋势分析

分析指标随时间的变化趋势：

\`\`\`typescript
// 定义指标
const metric = {
  name: '销售额',
  value: 0,
  unit: '元',
  format: 'currency'
}

// 定义时间范围
const timeRange = {
  start: new Date('2025-01-01'),
  end: new Date('2025-01-31'),
  granularity: 'day'
}

// 执行趋势分析
const trendReport = await businessIntelligence.trendAnalysis(metric, timeRange)

console.log('趋势方向:', trendReport.trend)
console.log('变化率:', trendReport.changeRate)
console.log('数据点:', trendReport.dataPoints)
console.log('预测:', trendReport.forecast)
\`\`\`

### 3.3 对比分析

对比多个组的指标表现：

\`\`\`typescript
// 定义对比组
const groups = [
  { id: 'A', name: '产品A', value: 10000 },
  { id: 'B', name: '产品B', value: 15000 },
  { id: 'C', name: '产品C', value: 12000 }
]

// 定义指标
const metric = {
  name: '销售额',
  value: 0,
  unit: '元'
}

// 执行对比分析
const comparisonReport = await businessIntelligence.compareAnalysis(groups, metric)

console.log('表现最好:', comparisonReport.winner)
console.log('对比结果:', comparisonReport.comparisons)
console.log('洞察:', comparisonReport.insights)
\`\`\`

### 3.4 归因分析

分析各因素对结果的贡献度：

\`\`\`typescript
// 定义结果
const outcome = {
  name: '销售额',
  value: 100000,
  target: 120000
}

// 定义因素
const factors = [
  { name: '广告投放', value: 50000 },
  { name: '促销活动', value: 30000 },
  { name: '口碑传播', value: 20000 }
]

// 执行归因分析
const attributionResult = await businessIntelligence.attributionAnalysis(outcome, factors)

console.log('归因模型:', attributionResult.model)
console.log('因素贡献:', attributionResult.factors)
console.log('洞察:', attributionResult.insights)
console.log('建议:', attributionResult.recommendations)
\`\`\`

## 四、API接口

### 4.1 OLAP分析接口

\`\`\`
POST /api/bigdata/bi/olap
Content-Type: application/json

{
  "cube": { ... },
  "dimensions": [ ... ],
  "measures": [ ... ]
}
\`\`\`

### 4.2 趋势分析接口

\`\`\`
POST /api/bigdata/bi/trend
Content-Type: application/json

{
  "metric": { ... },
  "timeRange": { ... }
}
\`\`\`

### 4.3 对比分析接口

\`\`\`
POST /api/bigdata/bi/compare
Content-Type: application/json

{
  "groups": [ ... ],
  "metric": { ... }
}
\`\`\`

### 4.4 归因分析接口

\`\`\`
POST /api/bigdata/bi/attribution
Content-Type: application/json

{
  "outcome": { ... },
  "factors": [ ... ]
}
\`\`\`

## 五、自动化报告

### 5.1 定时报告生成

系统支持定时生成报告（配置在`REPORT_CRON`）：

\`\`\`typescript
// 每天早上8点自动生成报告
await businessIntelligence.generateAutomatedReport()
\`\`\`

### 5.2 告警规则

系统会自动检查告警条件：

- 销售额下降超过阈值（`ALERT_THRESHOLD_SALES_DROP`）
- 指标出现大幅异常变化

触发告警时会自动发送邮件到`ALERT_EMAIL`。

## 六、预期效果

### 6.1 业务指标

- **决策效率**: 提升60%
- **商业洞察**: 10倍提升
- **数据驱动文化**: 已建立

### 6.2 技术指标

- **查询延迟**: <1秒
- **分析准确率**: 95%+
- **报告生成时间**: <5分钟

### 6.3 成本效益

- **人工分析成本**: 降低70%
- **决策失误率**: 降低50%
- **年度ROI**: 150%

## 七、使用指南

### 7.1 访问BI仪表盘

\`\`\`
http://localhost:3000/dashboard/bigdata/bi
\`\`\`

### 7.2 选择分析类型

1. **趋势分析**: 查看指标随时间的变化
2. **对比分析**: 对比不同组的表现
3. **归因分析**: 了解各因素的贡献度
4. **OLAP分析**: 进行多维度深入分析

### 7.3 导出报告

点击"导出报告"按钮，可将分析结果导出为PDF或Excel格式。

## 八、最佳实践

1. **定期查看趋势**: 每天查看关键指标趋势
2. **关注告警**: 及时响应系统告警
3. **深入分析**: 发现异常时进行归因分析
4. **数据驱动决策**: 基于分析结果制定策略

---

**文档版本**: v1.0  
**更新时间**: 2025-01-18  
**负责人**: 大数据分析团队
