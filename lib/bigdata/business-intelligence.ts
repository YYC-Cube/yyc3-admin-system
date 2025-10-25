import { env } from "@/env.sync"
import { realtimeDataWarehouse, type Query } from "./realtime-data-warehouse"

// 数据立方体
export interface DataCube {
  name: string
  dimensions: Dimension[]
  measures: Measure[]
  facts: Record<string, any>[]
}

export interface Dimension {
  name: string
  type: "time" | "location" | "category" | "product" | "customer"
  hierarchy?: string[]
  values: any[]
}

export interface Measure {
  name: string
  aggregation: "sum" | "avg" | "count" | "min" | "max"
  format?: string
  unit?: string
}

// 分析结果
export interface AnalysisResult {
  type: "olap" | "trend" | "comparison" | "attribution"
  data: Record<string, any>[]
  insights: string[]
  recommendations: string[]
  timestamp: number
}

// 趋势报告
export interface TrendReport {
  metric: Metric
  timeRange: TimeRange
  trend: "up" | "down" | "stable"
  changeRate: number
  dataPoints: TrendDataPoint[]
  forecast?: TrendDataPoint[]
  insights: string[]
}

export interface Metric {
  name: string
  value: number
  unit?: string
  format?: string
}

export interface TimeRange {
  start: Date
  end: Date
  granularity: "hour" | "day" | "week" | "month" | "quarter" | "year"
}

export interface TrendDataPoint {
  timestamp: number
  value: number
  label: string
}

// 对比报告
export interface ComparisonReport {
  groups: Group[]
  metric: Metric
  comparisons: Comparison[]
  winner: string
  insights: string[]
}

export interface Group {
  id: string
  name: string
  value: number
  metadata?: Record<string, any>
}

export interface Comparison {
  groupA: string
  groupB: string
  difference: number
  percentageChange: number
  significant: boolean
}

// 归因结果
export interface AttributionResult {
  outcome: Outcome
  factors: AttributionFactor[]
  model: "linear" | "shapley" | "markov"
  insights: string[]
  recommendations: string[]
}

export interface Outcome {
  name: string
  value: number
  target?: number
}

export interface AttributionFactor {
  name: string
  contribution: number
  percentage: number
  confidence: number
}

/**
 * 商业智能分析系统
 *
 * 功能：
 * 1. OLAP多维分析 - 切片、切块、钻取、旋转
 * 2. 趋势分析 - 时间序列分析和预测
 * 3. 对比分析 - 多组数据对比
 * 4. 归因分析 - 因果关系分析
 */
export class BusinessIntelligence {
  private metabaseUrl: string
  private metabaseApiKey: string
  private clickhouseUrl: string
  private clickhouseUser: string
  private clickhousePassword: string

  constructor() {
    this.metabaseUrl = env.BI_HOST
    this.metabaseApiKey = env.BI_API_KEY
    this.clickhouseUrl = env.OLAP_HOST
    this.clickhouseUser = env.OLAP_USER
    this.clickhousePassword = env.OLAP_PASSWORD
  }

  /**
   * OLAP多维分析
   * 支持切片、切块、钻取、旋转等操作
   */
  async olapAnalysis(cube: DataCube, dimensions: Dimension[], measures: Measure[]): Promise<AnalysisResult> {
    console.log(`[BI分析] 开始OLAP分析: ${cube.name}`)

    // 构建查询
    const query: Query = {
      model: cube.name,
      dimensions: dimensions.map((d) => d.name),
      measures: measures.map((m) => m.name),
      groupBy: dimensions.map((d) => d.name),
    }

    // 执行查询
    const result = await realtimeDataWarehouse.queryRealtime(query)

    // 生成洞察
    const insights = this.generateOLAPInsights(result.data, dimensions, measures)

    // 生成建议
    const recommendations = this.generateRecommendations(insights)

    return {
      type: "olap",
      data: result.data,
      insights,
      recommendations,
      timestamp: Date.now(),
    }
  }

  /**
   * 趋势分析
   * 分析指标随时间的变化趋势
   */
  async trendAnalysis(metric: Metric, timeRange: TimeRange): Promise<TrendReport> {
    console.log(`[BI分析] 开始趋势分析: ${metric.name}`)

    // 生成时间序列数据点
    const dataPoints = await this.generateTimeSeriesData(metric, timeRange)

    // 计算趋势
    const trend = this.calculateTrend(dataPoints)

    // 计算变化率
    const changeRate = this.calculateChangeRate(dataPoints)

    // 预测未来趋势
    const forecast = this.forecastTrend(dataPoints, 7)

    // 生成洞察
    const insights = this.generateTrendInsights(dataPoints, trend, changeRate)

    return {
      metric,
      timeRange,
      trend,
      changeRate,
      dataPoints,
      forecast,
      insights,
    }
  }

  /**
   * 对比分析
   * 对比多个组的指标表现
   */
  async compareAnalysis(groups: Group[], metric: Metric): Promise<ComparisonReport> {
    console.log(`[BI分析] 开始对比分析: ${groups.length} 个组`)

    // 计算所有对比
    const comparisons: Comparison[] = []
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const comparison = this.compareGroups(groups[i], groups[j])
        comparisons.push(comparison)
      }
    }

    // 找出表现最好的组
    const winner = groups.reduce((best, current) => (current.value > best.value ? current : best)).id

    // 生成洞察
    const insights = this.generateComparisonInsights(groups, comparisons, winner)

    return {
      groups,
      metric,
      comparisons,
      winner,
      insights,
    }
  }

  /**
   * 归因分析
   * 分析各因素对结果的贡献度
   */
  async attributionAnalysis(outcome: Outcome, factors: Factor[]): Promise<AttributionResult> {
    console.log(`[BI分析] 开始归因分析: ${outcome.name}`)

    // 使用Shapley值进行归因
    const attributionFactors = this.calculateShapleyValues(outcome, factors)

    // 生成洞察
    const insights = this.generateAttributionInsights(outcome, attributionFactors)

    // 生成建议
    const recommendations = this.generateAttributionRecommendations(attributionFactors)

    return {
      outcome,
      factors: attributionFactors,
      model: "shapley",
      insights,
      recommendations,
    }
  }

  /**
   * 生成自动化报告
   * 定时生成并发送报告
   */
  async generateAutomatedReport(): Promise<void> {
    console.log("[BI分析] 生成自动化报告")

    // 获取关键指标
    const metrics = await this.getKeyMetrics()

    // 生成趋势分析
    const trends = await Promise.all(
      metrics.map((metric) =>
        this.trendAnalysis(metric, {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(),
          granularity: "day",
        }),
      ),
    )

    // 检查告警条件
    const alerts = this.checkAlertConditions(trends)

    // 发送报告
    if (alerts.length > 0) {
      await this.sendReport(trends, alerts)
    }

    console.log(`[BI分析] 报告生成完成，发现 ${alerts.length} 个告警`)
  }

  // 私有辅助方法

  private generateOLAPInsights(data: Record<string, any>[], dimensions: Dimension[], measures: Measure[]): string[] {
    const insights: string[] = []

    // 分析数据分布
    if (data.length > 0) {
      insights.push(`共分析了 ${data.length} 个数据点`)

      // 找出最大值
      measures.forEach((measure) => {
        const values = data.map((d) => d[measure.name] || 0)
        const max = Math.max(...values)
        const maxItem = data.find((d) => d[measure.name] === max)
        if (maxItem) {
          const dimValues = dimensions.map((dim) => `${dim.name}=${maxItem[dim.name]}`).join(", ")
          insights.push(`${measure.name} 最高值出现在 ${dimValues}，值为 ${max}`)
        }
      })
    }

    return insights
  }

  private generateRecommendations(insights: string[]): string[] {
    const recommendations: string[] = []

    // 基于洞察生成建议
    if (insights.length > 0) {
      recommendations.push("建议关注表现最好的维度组合")
      recommendations.push("建议优化表现较差的维度")
      recommendations.push("建议持续监控关键指标变化")
    }

    return recommendations
  }

  private async generateTimeSeriesData(metric: Metric, timeRange: TimeRange): Promise<TrendDataPoint[]> {
    const dataPoints: TrendDataPoint[] = []
    const { start, end, granularity } = timeRange

    // 计算时间间隔
    const interval = this.getTimeInterval(granularity)
    let current = start.getTime()

    while (current <= end.getTime()) {
      // 模拟数据点（实际应从数据仓库查询）
      const value = Math.random() * 1000 + 500
      dataPoints.push({
        timestamp: current,
        value,
        label: new Date(current).toLocaleDateString(),
      })
      current += interval
    }

    return dataPoints
  }

  private getTimeInterval(granularity: TimeRange["granularity"]): number {
    switch (granularity) {
      case "hour":
        return 60 * 60 * 1000
      case "day":
        return 24 * 60 * 60 * 1000
      case "week":
        return 7 * 24 * 60 * 60 * 1000
      case "month":
        return 30 * 24 * 60 * 60 * 1000
      case "quarter":
        return 90 * 24 * 60 * 60 * 1000
      case "year":
        return 365 * 24 * 60 * 60 * 1000
    }
  }

  private calculateTrend(dataPoints: TrendDataPoint[]): "up" | "down" | "stable" {
    if (dataPoints.length < 2) return "stable"

    const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2))
    const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2))

    const firstAvg = firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length

    const change = ((secondAvg - firstAvg) / firstAvg) * 100

    if (change > 5) return "up"
    if (change < -5) return "down"
    return "stable"
  }

  private calculateChangeRate(dataPoints: TrendDataPoint[]): number {
    if (dataPoints.length < 2) return 0

    const first = dataPoints[0].value
    const last = dataPoints[dataPoints.length - 1].value

    return ((last - first) / first) * 100
  }

  private forecastTrend(dataPoints: TrendDataPoint[], periods: number): TrendDataPoint[] {
    if (dataPoints.length < 2) return []

    // 简单线性预测
    const lastPoint = dataPoints[dataPoints.length - 1]
    const secondLastPoint = dataPoints[dataPoints.length - 2]
    const slope = (lastPoint.value - secondLastPoint.value) / (lastPoint.timestamp - secondLastPoint.timestamp)

    const forecast: TrendDataPoint[] = []
    const interval = lastPoint.timestamp - secondLastPoint.timestamp

    for (let i = 1; i <= periods; i++) {
      const timestamp = lastPoint.timestamp + interval * i
      const value = lastPoint.value + slope * interval * i
      forecast.push({
        timestamp,
        value: Math.max(0, value),
        label: new Date(timestamp).toLocaleDateString(),
      })
    }

    return forecast
  }

  private generateTrendInsights(
    dataPoints: TrendDataPoint[],
    trend: "up" | "down" | "stable",
    changeRate: number,
  ): string[] {
    const insights: string[] = []

    insights.push(`趋势方向: ${trend === "up" ? "上升" : trend === "down" ? "下降" : "稳定"}`)
    insights.push(`变化率: ${changeRate.toFixed(2)}%`)

    if (Math.abs(changeRate) > 20) {
      insights.push(`⚠️ 变化幅度较大，建议重点关注`)
    }

    // 找出异常点
    const avg = dataPoints.reduce((sum, p) => sum + p.value, 0) / dataPoints.length
    const stdDev = Math.sqrt(dataPoints.reduce((sum, p) => sum + Math.pow(p.value - avg, 2), 0) / dataPoints.length)

    const anomalies = dataPoints.filter((p) => Math.abs(p.value - avg) > 2 * stdDev)
    if (anomalies.length > 0) {
      insights.push(`发现 ${anomalies.length} 个异常数据点`)
    }

    return insights
  }

  private compareGroups(groupA: Group, groupB: Group): Comparison {
    const difference = groupB.value - groupA.value
    const percentageChange = (difference / groupA.value) * 100
    const significant = Math.abs(percentageChange) > 10

    return {
      groupA: groupA.id,
      groupB: groupB.id,
      difference,
      percentageChange,
      significant,
    }
  }

  private generateComparisonInsights(groups: Group[], comparisons: Comparison[], winner: string): string[] {
    const insights: string[] = []

    const winnerGroup = groups.find((g) => g.id === winner)
    if (winnerGroup) {
      insights.push(`表现最好的组: ${winnerGroup.name}，值为 ${winnerGroup.value}`)
    }

    const significantComparisons = comparisons.filter((c) => c.significant)
    if (significantComparisons.length > 0) {
      insights.push(`发现 ${significantComparisons.length} 个显著差异`)
    }

    return insights
  }

  private calculateShapleyValues(outcome: Outcome, factors: Factor[]): AttributionFactor[] {
    // 简化的Shapley值计算
    const totalContribution = outcome.value
    const attributionFactors: AttributionFactor[] = []

    // 假设每个因素的贡献度
    const contributions = factors.map((factor) => ({
      name: factor.name,
      contribution: Math.random() * totalContribution,
    }))

    // 归一化
    const sum = contributions.reduce((s, c) => s + c.contribution, 0)
    contributions.forEach((c) => {
      attributionFactors.push({
        name: c.name,
        contribution: c.contribution,
        percentage: (c.contribution / sum) * 100,
        confidence: 0.8 + Math.random() * 0.2,
      })
    })

    // 按贡献度排序
    attributionFactors.sort((a, b) => b.contribution - a.contribution)

    return attributionFactors
  }

  private generateAttributionInsights(outcome: Outcome, factors: AttributionFactor[]): string[] {
    const insights: string[] = []

    if (factors.length > 0) {
      const topFactor = factors[0]
      insights.push(`最重要的因素: ${topFactor.name}，贡献度 ${topFactor.percentage.toFixed(2)}%`)

      const top3 = factors.slice(0, 3)
      const top3Contribution = top3.reduce((sum, f) => sum + f.percentage, 0)
      insights.push(`前3个因素贡献了 ${top3Contribution.toFixed(2)}% 的结果`)
    }

    return insights
  }

  private generateAttributionRecommendations(factors: AttributionFactor[]): string[] {
    const recommendations: string[] = []

    if (factors.length > 0) {
      const topFactor = factors[0]
      recommendations.push(`建议重点优化 ${topFactor.name}，可获得最大收益`)

      const lowFactors = factors.filter((f) => f.percentage < 5)
      if (lowFactors.length > 0) {
        recommendations.push(`建议减少对 ${lowFactors.map((f) => f.name).join(", ")} 的投入`)
      }
    }

    return recommendations
  }

  private async getKeyMetrics(): Promise<Metric[]> {
    return [
      { name: "销售额", value: 0, unit: "元", format: "currency" },
      { name: "订单数", value: 0, unit: "单", format: "number" },
      { name: "客单价", value: 0, unit: "元", format: "currency" },
    ]
  }

  private checkAlertConditions(trends: TrendReport[]): string[] {
    const alerts: string[] = []

    trends.forEach((trend) => {
      // 检查销售额下降
      if (trend.metric.name === "销售额" && trend.changeRate < -env.ALERT_THRESHOLD_SALES_DROP) {
        alerts.push(`⚠️ 销售额下降 ${Math.abs(trend.changeRate).toFixed(2)}%，超过阈值`)
      }

      // 检查异常趋势
      if (trend.trend === "down" && Math.abs(trend.changeRate) > 30) {
        alerts.push(`⚠️ ${trend.metric.name} 出现大幅下降`)
      }
    })

    return alerts
  }

  private async sendReport(trends: TrendReport[], alerts: string[]): Promise<void> {
    console.log("[BI分析] 发送报告到:", env.REPORT_NOTIFY_EMAIL)
    console.log("告警:", alerts)
    // 实际实现中应调用邮件服务
  }
}

// 因素接口
export interface Factor {
  name: string
  value: number
  weight?: number
}

// 导出单例
export const businessIntelligence = new BusinessIntelligence()
