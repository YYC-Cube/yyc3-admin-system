// 销售数据
export interface SalesData {
  date: Date
  amount: number
  quantity: number
  category: string
  productId: string
}

// 外部因素
export interface ExternalFactor {
  name: string
  value: number
  impact: "positive" | "negative" | "neutral"
}

// 销售预测
export interface SalesForecast {
  period: string
  predictedAmount: number
  confidence: number
  lowerBound: number
  upperBound: number
  factors: ExternalFactor[]
  insights: string[]
}

// 客户数据
export interface CustomerData {
  customerId: string
  lastPurchaseDate: Date
  totalPurchases: number
  totalSpent: number
  avgOrderValue: number
  frequency: number
  recency: number
  engagementScore: number
}

// 流失预测
export interface ChurnPrediction {
  customerId: string
  churnProbability: number
  riskLevel: "low" | "medium" | "high"
  reasons: string[]
  recommendations: string[]
  retentionValue: number
}

// 需求数据
export interface DemandData {
  date: Date
  productId: string
  quantity: number
  price: number
}

// 季节性模式
export interface SeasonalPattern {
  season: "spring" | "summer" | "autumn" | "winter"
  multiplier: number
  peakDays: number[]
}

// 库存预测
export interface InventoryForecast {
  productId: string
  period: string
  predictedDemand: number
  recommendedStock: number
  reorderPoint: number
  safetyStock: number
  insights: string[]
}

// 价格数据
export interface PriceData {
  date: Date
  productId: string
  price: number
}

// 价格弹性分析
export interface ElasticityAnalysis {
  productId: string
  elasticity: number
  type: "elastic" | "inelastic" | "unitary"
  optimalPrice: number
  revenueImpact: number
  recommendations: string[]
}

/**
 * 预测分析引擎
 *
 * 功能:
 * 1. 销售预测 - 基于历史数据和外部因素预测未来销售
 * 2. 客户流失预测 - 识别高风险流失客户
 * 3. 库存需求预测 - 优化库存管理
 * 4. 价格弹性分析 - 优化定价策略
 */
export class PredictiveAnalytics {
  /**
   * 销售预测
   * 使用时间序列分析和机器学习预测未来销售
   */
  async forecastSales(historicalData: SalesData[], externalFactors: ExternalFactor[]): Promise<SalesForecast[]> {
    console.log(`[预测分析] 开始销售预测，历史数据: ${historicalData.length} 条`)

    // 数据预处理
    const processedData = this.preprocessSalesData(historicalData)

    // 特征工程
    const features = this.extractSalesFeatures(processedData, externalFactors)

    // 时间序列分解
    const { trend, seasonal, residual } = this.decomposeTimeSeries(processedData)

    // 预测未来7天
    const forecasts: SalesForecast[] = []
    for (let i = 1; i <= 7; i++) {
      const forecast = this.predictSalesForDay(i, trend, seasonal, residual, externalFactors)
      forecasts.push(forecast)
    }

    console.log(`[预测分析] 销售预测完成，生成 ${forecasts.length} 个预测`)
    return forecasts
  }

  /**
   * 客户流失预测
   * 使用机器学习模型预测客户流失概率
   */
  async predictChurn(customerData: CustomerData[]): Promise<ChurnPrediction[]> {
    console.log(`[预测分析] 开始客户流失预测，客户数量: ${customerData.length}`)

    const predictions: ChurnPrediction[] = []

    for (const customer of customerData) {
      // 计算RFM分数
      const rfmScore = this.calculateRFMScore(customer)

      // 计算流失概率
      const churnProbability = this.calculateChurnProbability(customer, rfmScore)

      // 确定风险等级
      const riskLevel = this.determineRiskLevel(churnProbability)

      // 分析流失原因
      const reasons = this.analyzeChurnReasons(customer, rfmScore)

      // 生成挽留建议
      const recommendations = this.generateRetentionRecommendations(customer, reasons)

      // 计算挽留价值
      const retentionValue = this.calculateRetentionValue(customer)

      predictions.push({
        customerId: customer.customerId,
        churnProbability,
        riskLevel,
        reasons,
        recommendations,
        retentionValue,
      })
    }

    // 按流失概率排序
    predictions.sort((a, b) => b.churnProbability - a.churnProbability)

    console.log(`[预测分析] 客户流失预测完成，高风险客户: ${predictions.filter((p) => p.riskLevel === "high").length}`)
    return predictions
  }

  /**
   * 库存需求预测
   * 基于历史需求和季节性模式预测未来库存需求
   */
  async forecastInventory(historicalDemand: DemandData[], seasonality: SeasonalPattern): Promise<InventoryForecast[]> {
    console.log(`[预测分析] 开始库存需求预测，历史数据: ${historicalDemand.length} 条`)

    // 按产品分组
    const productGroups = this.groupByProduct(historicalDemand)

    const forecasts: InventoryForecast[] = []

    for (const [productId, demands] of Object.entries(productGroups)) {
      // 计算平均需求
      const avgDemand = demands.reduce((sum, d) => sum + d.quantity, 0) / demands.length

      // 应用季节性调整
      const seasonalAdjustment = seasonality.multiplier
      const predictedDemand = Math.round(avgDemand * seasonalAdjustment)

      // 计算安全库存
      const stdDev = this.calculateStdDev(demands.map((d) => d.quantity))
      const safetyStock = Math.ceil(stdDev * 1.65) // 95%服务水平

      // 计算再订货点
      const leadTime = 3 // 假设3天交货期
      const reorderPoint = Math.ceil(avgDemand * leadTime + safetyStock)

      // 推荐库存量
      const recommendedStock = Math.ceil(predictedDemand * 7 + safetyStock) // 7天库存

      // 生成洞察
      const insights = this.generateInventoryInsights(predictedDemand, avgDemand, safetyStock)

      forecasts.push({
        productId,
        period: "next_7_days",
        predictedDemand,
        recommendedStock,
        reorderPoint,
        safetyStock,
        insights,
      })
    }

    console.log(`[预测分析] 库存需求预测完成，产品数量: ${forecasts.length}`)
    return forecasts
  }

  /**
   * 价格弹性分析
   * 分析价格变化对销量的影响
   */
  async analyzePriceElasticity(priceHistory: PriceData[], salesHistory: SalesData[]): Promise<ElasticityAnalysis[]> {
    console.log(`[预测分析] 开始价格弹性分析`)

    // 按产品分组
    const productIds = [...new Set(priceHistory.map((p) => p.productId))]

    const analyses: ElasticityAnalysis[] = []

    for (const productId of productIds) {
      // 获取该产品的价格和销量数据
      const prices = priceHistory.filter((p) => p.productId === productId)
      const sales = salesHistory.filter((s) => s.productId === productId)

      if (prices.length < 2 || sales.length < 2) continue

      // 计算价格弹性
      const elasticity = this.calculatePriceElasticity(prices, sales)

      // 确定弹性类型
      const type = this.determineElasticityType(elasticity)

      // 计算最优价格
      const optimalPrice = this.calculateOptimalPrice(prices, sales, elasticity)

      // 估算收益影响
      const currentRevenue = sales.reduce((sum, s) => sum + s.amount, 0)
      const revenueImpact = this.estimateRevenueImpact(currentRevenue, elasticity, optimalPrice, prices)

      // 生成建议
      const recommendations = this.generatePricingRecommendations(elasticity, type, optimalPrice, revenueImpact)

      analyses.push({
        productId,
        elasticity,
        type,
        optimalPrice,
        revenueImpact,
        recommendations,
      })
    }

    console.log(`[预测分析] 价格弹性分析完成，产品数量: ${analyses.length}`)
    return analyses
  }

  // 私有辅助方法

  private preprocessSalesData(data: SalesData[]): SalesData[] {
    // 按日期排序
    return data.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  private extractSalesFeatures(data: SalesData[], externalFactors: ExternalFactor[]): Record<string, any>[] {
    return data.map((d) => ({
      dayOfWeek: d.date.getDay(),
      dayOfMonth: d.date.getDate(),
      month: d.date.getMonth(),
      isWeekend: d.date.getDay() === 0 || d.date.getDay() === 6,
      amount: d.amount,
      quantity: d.quantity,
      externalFactors: externalFactors.map((f) => f.value),
    }))
  }

  private decomposeTimeSeries(data: SalesData[]): {
    trend: number[]
    seasonal: number[]
    residual: number[]
  } {
    const values = data.map((d) => d.amount)

    // 简单移动平均作为趋势
    const windowSize = 7
    const trend = this.movingAverage(values, windowSize)

    // 计算季节性
    const seasonal = values.map((v, i) => v - (trend[i] || v))

    // 残差
    const residual = values.map((v, i) => v - (trend[i] || v) - (seasonal[i] || 0))

    return { trend, seasonal, residual }
  }

  private movingAverage(values: number[], windowSize: number): number[] {
    const result: number[] = []
    for (let i = 0; i < values.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2))
      const end = Math.min(values.length, i + Math.ceil(windowSize / 2))
      const window = values.slice(start, end)
      const avg = window.reduce((sum, v) => sum + v, 0) / window.length
      result.push(avg)
    }
    return result
  }

  private predictSalesForDay(
    daysAhead: number,
    trend: number[],
    seasonal: number[],
    residual: number[],
    externalFactors: ExternalFactor[],
  ): SalesForecast {
    // 简单线性外推
    const lastTrend = trend[trend.length - 1] || 0
    const trendSlope = trend.length > 1 ? trend[trend.length - 1] - trend[trend.length - 2] : 0
    const predictedTrend = lastTrend + trendSlope * daysAhead

    // 季节性周期
    const seasonalIndex = (seasonal.length + daysAhead - 1) % seasonal.length
    const seasonalComponent = seasonal[seasonalIndex] || 0

    // 外部因素影响
    const externalImpact = externalFactors.reduce((sum, f) => {
      const impact = f.impact === "positive" ? f.value : f.impact === "negative" ? -f.value : 0
      return sum + impact
    }, 0)

    // 预测值
    const predictedAmount = Math.max(0, predictedTrend + seasonalComponent + externalImpact)

    // 置信区间
    const stdDev = this.calculateStdDev(residual)
    const confidence = 0.85
    const margin = stdDev * 1.96 // 95%置信区间
    const lowerBound = Math.max(0, predictedAmount - margin)
    const upperBound = predictedAmount + margin

    // 生成洞察
    const insights: string[] = []
    if (externalImpact > 0) {
      insights.push(`外部因素预计带来 ${externalImpact.toFixed(0)} 元的正面影响`)
    } else if (externalImpact < 0) {
      insights.push(`外部因素预计带来 ${Math.abs(externalImpact).toFixed(0)} 元的负面影响`)
    }

    const today = new Date()
    const forecastDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000)

    return {
      period: forecastDate.toLocaleDateString(),
      predictedAmount: Math.round(predictedAmount),
      confidence,
      lowerBound: Math.round(lowerBound),
      upperBound: Math.round(upperBound),
      factors: externalFactors,
      insights,
    }
  }

  private calculateStdDev(values: number[]): number {
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const squaredDiffs = values.map((v) => Math.pow(v - avg, 2))
    const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length
    return Math.sqrt(variance)
  }

  private calculateRFMScore(customer: CustomerData): { r: number; f: number; m: number } {
    // Recency (0-5分)
    const daysSinceLastPurchase = (Date.now() - customer.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    const r =
      daysSinceLastPurchase < 30
        ? 5
        : daysSinceLastPurchase < 60
          ? 4
          : daysSinceLastPurchase < 90
            ? 3
            : daysSinceLastPurchase < 180
              ? 2
              : 1

    // Frequency (0-5分)
    const f =
      customer.totalPurchases >= 20
        ? 5
        : customer.totalPurchases >= 10
          ? 4
          : customer.totalPurchases >= 5
            ? 3
            : customer.totalPurchases >= 2
              ? 2
              : 1

    // Monetary (0-5分)
    const m =
      customer.totalSpent >= 10000
        ? 5
        : customer.totalSpent >= 5000
          ? 4
          : customer.totalSpent >= 2000
            ? 3
            : customer.totalSpent >= 500
              ? 2
              : 1

    return { r, f, m }
  }

  private calculateChurnProbability(customer: CustomerData, rfmScore: { r: number; f: number; m: number }): number {
    // 基于RFM分数计算流失概率
    const totalScore = rfmScore.r + rfmScore.f + rfmScore.m
    const maxScore = 15

    // 分数越低，流失概率越高
    const baseChurnProb = 1 - totalScore / maxScore

    // 考虑参与度
    const engagementFactor = 1 - customer.engagementScore / 100

    // 综合流失概率
    const churnProbability = (baseChurnProb * 0.7 + engagementFactor * 0.3) * 100

    return Math.min(100, Math.max(0, churnProbability))
  }

  private determineRiskLevel(churnProbability: number): "low" | "medium" | "high" {
    if (churnProbability >= 70) return "high"
    if (churnProbability >= 40) return "medium"
    return "low"
  }

  private analyzeChurnReasons(customer: CustomerData, rfmScore: { r: number; f: number; m: number }): string[] {
    const reasons: string[] = []

    if (rfmScore.r <= 2) {
      const daysSinceLastPurchase = (Date.now() - customer.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24)
      reasons.push(`长时间未消费 (${Math.round(daysSinceLastPurchase)} 天)`)
    }

    if (rfmScore.f <= 2) {
      reasons.push(`消费频次低 (仅 ${customer.totalPurchases} 次)`)
    }

    if (rfmScore.m <= 2) {
      reasons.push(`消费金额低 (仅 ${customer.totalSpent} 元)`)
    }

    if (customer.engagementScore < 30) {
      reasons.push(`参与度低 (${customer.engagementScore}%)`)
    }

    if (customer.avgOrderValue < 100) {
      reasons.push(`客单价低 (${customer.avgOrderValue} 元)`)
    }

    return reasons
  }

  private generateRetentionRecommendations(customer: CustomerData, reasons: string[]): string[] {
    const recommendations: string[] = []

    if (reasons.some((r) => r.includes("长时间未消费"))) {
      recommendations.push("发送专属优惠券，激活沉睡客户")
      recommendations.push("推送个性化商品推荐")
    }

    if (reasons.some((r) => r.includes("消费频次低"))) {
      recommendations.push("建立会员积分体系，提升复购率")
      recommendations.push("定期发送新品通知")
    }

    if (reasons.some((r) => r.includes("消费金额低"))) {
      recommendations.push("推荐��价值商品组合")
      recommendations.push("提供满减优惠，提升客单价")
    }

    if (reasons.some((r) => r.includes("参与度低"))) {
      recommendations.push("邀请参加会员活动")
      recommendations.push("发送个性化内容，提升互动")
    }

    return recommendations
  }

  private calculateRetentionValue(customer: CustomerData): number {
    // 客户生命周期价值 (CLV)
    const avgMonthlySpend = customer.totalSpent / Math.max(1, customer.frequency)
    const expectedLifetimeMonths = 24 // 假设2年生命周期
    const clv = avgMonthlySpend * expectedLifetimeMonths

    // 挽留价值 = CLV * 挽留成功率
    const retentionSuccessRate = 0.3 // 假设30%挽留成功率
    return Math.round(clv * retentionSuccessRate)
  }

  private groupByProduct(demands: DemandData[]): Record<string, DemandData[]> {
    const groups: Record<string, DemandData[]> = {}
    for (const demand of demands) {
      if (!groups[demand.productId]) {
        groups[demand.productId] = []
      }
      groups[demand.productId].push(demand)
    }
    return groups
  }

  private generateInventoryInsights(predictedDemand: number, avgDemand: number, safetyStock: number): string[] {
    const insights: string[] = []

    const changeRate = ((predictedDemand - avgDemand) / avgDemand) * 100

    if (changeRate > 20) {
      insights.push(`预计需求将增长 ${changeRate.toFixed(0)}%，建议提前备货`)
    } else if (changeRate < -20) {
      insights.push(`预计需求将下降 ${Math.abs(changeRate).toFixed(0)}%，建议控制库存`)
    } else {
      insights.push(`需求相对稳定，维持正常库存水平`)
    }

    insights.push(`建议保持 ${safetyStock} 件安全库存`)

    return insights
  }

  private calculatePriceElasticity(prices: PriceData[], sales: SalesData[]): number {
    // 简化的价格弹性计算
    if (prices.length < 2 || sales.length < 2) return -1

    // 计算价格变化率
    const priceChange = ((prices[prices.length - 1].price - prices[0].price) / prices[0].price) * 100

    // 计算销量变化率
    const quantityChange = ((sales[sales.length - 1].quantity - sales[0].quantity) / sales[0].quantity) * 100

    // 价格弹性 = 销量变化率 / 价格变化率
    const elasticity = priceChange !== 0 ? quantityChange / priceChange : -1

    return elasticity
  }

  private determineElasticityType(elasticity: number): "elastic" | "inelastic" | "unitary" {
    const absElasticity = Math.abs(elasticity)
    if (absElasticity > 1) return "elastic"
    if (absElasticity < 1) return "inelastic"
    return "unitary"
  }

  private calculateOptimalPrice(prices: PriceData[], sales: SalesData[], elasticity: number): number {
    // 简化的最优价格计算
    const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length
    const avgQuantity = sales.reduce((sum, s) => sum + s.quantity, 0) / sales.length

    // 如果需求弹性大，建议降价；如果需求弹性小，建议提价
    const priceAdjustment = elasticity < -1 ? -0.1 : elasticity > -0.5 ? 0.1 : 0

    return Math.round(avgPrice * (1 + priceAdjustment))
  }

  private estimateRevenueImpact(
    currentRevenue: number,
    elasticity: number,
    optimalPrice: number,
    prices: PriceData[],
  ): number {
    const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length
    const priceChange = ((optimalPrice - avgPrice) / avgPrice) * 100

    // 估算销量变化
    const quantityChange = elasticity * priceChange

    // 估算收益变化
    const revenueChange = priceChange + quantityChange + (priceChange * quantityChange) / 100

    return Math.round((currentRevenue * revenueChange) / 100)
  }

  private generatePricingRecommendations(
    elasticity: number,
    type: string,
    optimalPrice: number,
    revenueImpact: number,
  ): string[] {
    const recommendations: string[] = []

    if (type === "elastic") {
      recommendations.push("需求对价格敏感，建议采用低价策略扩大市场份额")
      recommendations.push("可以通过促销活动显著提升销量")
    } else if (type === "inelastic") {
      recommendations.push("需求对价格不敏感，建议适当提价增加利润")
      recommendations.push("重点提升产品价值和品牌形象")
    } else {
      recommendations.push("需求弹性适中，维持当前价格策略")
    }

    if (revenueImpact > 0) {
      recommendations.push(`调整至最优价格 ${optimalPrice} 元，预计增加收益 ${revenueImpact} 元`)
    } else if (revenueImpact < 0) {
      recommendations.push(`当前价格已接近最优，不建议大幅调整`)
    }

    return recommendations
  }
}

// 导出单例
export const predictiveAnalytics = new PredictiveAnalytics()
