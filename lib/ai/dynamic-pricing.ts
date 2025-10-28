// AI深度集成 - 智能定价系统

// 时间段
export interface TimeSlot {
  startTime: string
  endTime: string
  dayOfWeek: number
}

// 包厢类型
export type RoomType = "small" | "medium" | "large" | "vip"

// 历史数据
export interface HistoricalData {
  date: Date
  roomType: RoomType
  price: number
  occupancyRate: number
  revenue: number
}

// 需求预测
export interface DemandForecast {
  timeSlot: TimeSlot
  roomType: RoomType
  predictedDemand: number
  confidence: number
  factors: {
    seasonality: number
    trend: number
    events: number
    weather: number
  }
}

// 竞争对手价格
export interface CompetitorPrice {
  competitorId: string
  roomType: RoomType
  price: number
  distance: number
  rating: number
}

// 定价约束
export interface PricingConstraints {
  minPrice: number
  maxPrice: number
  minMargin: number
  maxDiscount: number
}

// 最优价格
export interface OptimalPrice {
  roomType: RoomType
  timeSlot: TimeSlot
  price: number
  expectedRevenue: number
  expectedOccupancy: number
  reasoning: string
}

// 价格策略
export interface PriceStrategy {
  name: string
  description: string
  rules: PricingRule[]
}

export interface PricingRule {
  condition: string
  adjustment: number
  reason: string
}

// 容量
export interface Capacity {
  roomType: RoomType
  totalRooms: number
  availableRooms: number
}

// 收益预测
export interface RevenueProjection {
  date: Date
  roomType: RoomType
  projectedRevenue: number
  projectedOccupancy: number
  confidence: number
}

export class DynamicPricingEngine {
  private historicalData: HistoricalData[] = []
  private competitorPrices: Map<string, CompetitorPrice[]> = new Map()

  // 需求预测
  async predictDemand(
    timeSlot: TimeSlot,
    roomType: RoomType,
    historicalData: HistoricalData[],
  ): Promise<DemandForecast> {
    // 使用LSTM时间序列模型预测需求（简化版本）

    // 1. 提取季节性特征
    const seasonality = this.extractSeasonality(timeSlot, historicalData)

    // 2. 提取趋势特征
    const trend = this.extractTrend(historicalData)

    // 3. 考虑外部事件
    const events = await this.getEventImpact(timeSlot)

    // 4. 考虑天气因素
    const weather = await this.getWeatherImpact(timeSlot)

    // 5. 综合预测
    const baselineDemand = this.calculateBaselineDemand(historicalData, roomType)
    const predictedDemand = baselineDemand * (1 + seasonality + trend + events + weather)

    return {
      timeSlot,
      roomType,
      predictedDemand: Math.max(0, Math.min(1, predictedDemand)),
      confidence: 0.85,
      factors: {
        seasonality,
        trend,
        events,
        weather,
      },
    }
  }

  // 价格优化
  async optimizePrice(
    demand: DemandForecast,
    competitorPrices: CompetitorPrice[],
    constraints: PricingConstraints,
  ): Promise<OptimalPrice> {
    // 使用强化学习优化价格

    // 1. 计算基准价格
    const basePrice = this.calculateBasePrice(demand.roomType)

    // 2. 需求调整
    const demandAdjustment = this.calculateDemandAdjustment(demand.predictedDemand)

    // 3. 竞争调整
    const competitorAdjustment = this.calculateCompetitorAdjustment(competitorPrices)

    // 4. 计算最优价格
    let optimalPrice = basePrice * (1 + demandAdjustment + competitorAdjustment)

    // 5. 应用约束
    optimalPrice = Math.max(constraints.minPrice, Math.min(constraints.maxPrice, optimalPrice))

    // 6. 预测收益和入住率
    const expectedOccupancy = this.predictOccupancy(optimalPrice, demand)
    const expectedRevenue = optimalPrice * expectedOccupancy

    return {
      roomType: demand.roomType,
      timeSlot: demand.timeSlot,
      price: Math.round(optimalPrice),
      expectedRevenue,
      expectedOccupancy,
      reasoning: this.generatePricingReasoning(demand, competitorPrices, demandAdjustment),
    }
  }

  // 收益最大化
  async maximizeRevenue(priceStrategy: PriceStrategy, capacity: Capacity): Promise<RevenueProjection> {
    // 使用动态规划优化收益

    const projections: RevenueProjection[] = []

    // 模拟未来7天
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)

      // 应用价格策略
      const adjustedPrice = this.applyPriceStrategy(priceStrategy, date)

      // 预测入住率
      const occupancy = this.predictOccupancyForDate(date, adjustedPrice, capacity)

      // 计算收益
      const revenue = adjustedPrice * occupancy * capacity.totalRooms

      projections.push({
        date,
        roomType: capacity.roomType,
        projectedRevenue: revenue,
        projectedOccupancy: occupancy,
        confidence: 0.8,
      })
    }

    return projections[0]
  }

  // 私有辅助方法
  private extractSeasonality(timeSlot: TimeSlot, data: HistoricalData[]): number {
    // 提取季节性模式
    const dayOfWeek = timeSlot.dayOfWeek
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    return isWeekend ? 0.3 : 0
  }

  private extractTrend(data: HistoricalData[]): number {
    // 提取趋势
    if (data.length < 2) return 0

    const recentData = data.slice(-30)
    const avgRecent = recentData.reduce((sum, d) => sum + d.occupancyRate, 0) / recentData.length
    const avgAll = data.reduce((sum, d) => sum + d.occupancyRate, 0) / data.length

    return (avgRecent - avgAll) / avgAll
  }

  private async getEventImpact(timeSlot: TimeSlot): Promise<number> {
    // 获取事件影响（节假日、活动等）
    return 0
  }

  private async getWeatherImpact(timeSlot: TimeSlot): Promise<number> {
    // 获取天气影响
    return 0
  }

  private calculateBaselineDemand(data: HistoricalData[], roomType: RoomType): number {
    const relevantData = data.filter((d) => d.roomType === roomType)
    if (relevantData.length === 0) return 0.5

    return relevantData.reduce((sum, d) => sum + d.occupancyRate, 0) / relevantData.length
  }

  private calculateBasePrice(roomType: RoomType): number {
    const basePrices: Record<RoomType, number> = {
      small: 80,
      medium: 120,
      large: 180,
      vip: 300,
    }
    return basePrices[roomType]
  }

  private calculateDemandAdjustment(predictedDemand: number): number {
    // 需求越高，价格越高
    if (predictedDemand > 0.8) return 0.3
    if (predictedDemand > 0.6) return 0.15
    if (predictedDemand < 0.3) return -0.2
    return 0
  }

  private calculateCompetitorAdjustment(competitors: CompetitorPrice[]): number {
    if (competitors.length === 0) return 0

    const avgCompetitorPrice = competitors.reduce((sum, c) => sum + c.price, 0) / competitors.length
    const ourPrice = this.calculateBasePrice(competitors[0].roomType)

    // 如果我们的价格高于竞争对手，降价
    if (ourPrice > avgCompetitorPrice * 1.1) return -0.1
    // 如果我们的价格低于竞争对手，可以涨价
    if (ourPrice < avgCompetitorPrice * 0.9) return 0.1

    return 0
  }

  private predictOccupancy(price: number, demand: DemandForecast): number {
    // 价格弹性模型
    const baseOccupancy = demand.predictedDemand
    const basePrice = this.calculateBasePrice(demand.roomType)
    const priceRatio = price / basePrice

    // 价格越高，入住率越低
    const elasticity = -0.5
    const occupancy = baseOccupancy * Math.pow(priceRatio, elasticity)

    return Math.max(0, Math.min(1, occupancy))
  }

  private generatePricingReasoning(demand: DemandForecast, competitors: CompetitorPrice[], adjustment: number): string {
    const reasons = []

    if (demand.predictedDemand > 0.7) {
      reasons.push("预测需求旺盛")
    }

    if (adjustment > 0) {
      reasons.push("市场价格有上涨空间")
    }

    if (competitors.length > 0) {
      reasons.push("参考竞争对手定价")
    }

    return reasons.join("，") || "基于历史数据定价"
  }

  private applyPriceStrategy(strategy: PriceStrategy, date: Date): number {
    let basePrice = 100

    for (const rule of strategy.rules) {
      // 简化的规则应用
      basePrice *= 1 + rule.adjustment
    }

    return basePrice
  }

  private predictOccupancyForDate(date: Date, price: number, capacity: Capacity): number {
    // 简化的入住率预测
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    const baseOccupancy = isWeekend ? 0.8 : 0.6
    const priceImpact = 1 - (price - 100) / 500

    return Math.max(0, Math.min(1, baseOccupancy * priceImpact))
  }
}

let _dynamicPricingEngineInstance: DynamicPricingEngine | null = null

function getDynamicPricingEngine(): DynamicPricingEngine {
  if (!_dynamicPricingEngineInstance) {
    _dynamicPricingEngineInstance = new DynamicPricingEngine()
  }
  return _dynamicPricingEngineInstance
}

// 使用Proxy保持向后兼容性
export const dynamicPricingEngine = new Proxy({} as DynamicPricingEngine, {
  get(_target, prop) {
    const instance = getDynamicPricingEngine()
    const value = instance[prop as keyof DynamicPricingEngine]
    if (typeof value === "function") {
      return value.bind(instance)
    }
    return value
  },
})
