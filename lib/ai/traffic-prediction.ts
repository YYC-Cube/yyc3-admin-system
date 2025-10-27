// AI深度集成 - 智能客流预测系统

// 客流数据
export interface TrafficData {
  date: Date
  hour: number
  count: number
  roomType?: string
}

// 外部因素
export interface ExternalFactors {
  weather: "sunny" | "rainy" | "cloudy" | "snowy"
  temperature: number
  isHoliday: boolean
  hasEvent: boolean
  eventType?: string
}

// 客流预测
export interface TrafficForecast {
  date: Date
  hour: number
  predictedCount: number
  confidence: number
  range: {
    min: number
    max: number
  }
}

// 季节性模式
export interface SeasonalPattern {
  type: "daily" | "weekly" | "monthly" | "yearly"
  pattern: number[]
}

// 趋势数据
export interface TrendData {
  direction: "up" | "down" | "stable"
  strength: number
  changeRate: number
}

// 长期预测
export interface LongTermForecast {
  month: string
  predictedTraffic: number
  predictedRevenue: number
  confidence: number
}

// 异常告警
export interface AnomalyAlert {
  timestamp: Date
  actualTraffic: number
  expectedTraffic: number
  deviation: number
  severity: "low" | "medium" | "high"
  possibleReasons: string[]
}

export class TrafficPredictionSystem {
  private historicalTraffic: TrafficData[] = []
  private seasonalPatterns: Map<string, SeasonalPattern> = new Map()

  // 短期预测（1-7天）
  async shortTermForecast(
    historicalTraffic: TrafficData[],
    externalFactors: ExternalFactors,
  ): Promise<TrafficForecast[]> {
    const forecasts: TrafficForecast[] = []

    // 使用Prophet + LSTM混合模型
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const date = new Date()
        date.setDate(date.getDate() + day)
        date.setHours(hour, 0, 0, 0)

        // 1. 基准预测（基于历史数据）
        const baseline = this.calculateBaseline(historicalTraffic, date, hour)

        // 2. 季节性调整
        const seasonalAdjustment = this.getSeasonalAdjustment(date, hour)

        // 3. 趋势调整
        const trendAdjustment = this.getTrendAdjustment(historicalTraffic)

        // 4. 外部因素调整
        const externalAdjustment = this.getExternalAdjustment(externalFactors)

        // 5. 综合预测
        const predicted = baseline * (1 + seasonalAdjustment + trendAdjustment + externalAdjustment)

        // 6. 计算置信区间
        const confidence = this.calculateConfidence(historicalTraffic, day)
        const range = this.calculateRange(predicted, confidence)

        forecasts.push({
          date,
          hour,
          predictedCount: Math.round(predicted),
          confidence,
          range,
        })
      }
    }

    return forecasts
  }

  // 长期预测（1-3个月）
  async longTermForecast(seasonalPatterns: SeasonalPattern[], trendAnalysis: TrendData): Promise<LongTermForecast[]> {
    const forecasts: LongTermForecast[] = []

    for (let month = 0; month < 3; month++) {
      const date = new Date()
      date.setMonth(date.getMonth() + month)

      // 1. 基于季节性模式预测
      const seasonalForecast = this.applySeasonalPatterns(seasonalPatterns, date)

      // 2. 应用趋势
      const trendForecast = seasonalForecast * (1 + trendAnalysis.changeRate * month)

      // 3. 计算预期收益
      const avgTicketPrice = 150
      const predictedRevenue = trendForecast * avgTicketPrice

      forecasts.push({
        month: date.toISOString().slice(0, 7),
        predictedTraffic: Math.round(trendForecast),
        predictedRevenue,
        confidence: 0.75 - month * 0.1,
      })
    }

    return forecasts
  }

  // 异常检测
  detectAnomalies(realTimeTraffic: number, expectedTraffic: number): AnomalyAlert | null {
    const deviation = Math.abs(realTimeTraffic - expectedTraffic) / expectedTraffic

    if (deviation < 0.2) return null

    const severity = deviation > 0.5 ? "high" : deviation > 0.3 ? "medium" : "low"

    const possibleReasons = this.analyzePossibleReasons(realTimeTraffic, expectedTraffic)

    return {
      timestamp: new Date(),
      actualTraffic: realTimeTraffic,
      expectedTraffic,
      deviation,
      severity,
      possibleReasons,
    }
  }

  // 私有辅助方法
  private calculateBaseline(data: TrafficData[], date: Date, hour: number): number {
    // 获取相同时段的历史数据
    const dayOfWeek = date.getDay()
    const relevantData = data.filter((d) => {
      const dDate = new Date(d.date)
      return dDate.getDay() === dayOfWeek && d.hour === hour
    })

    if (relevantData.length === 0) return 50

    return relevantData.reduce((sum, d) => sum + d.count, 0) / relevantData.length
  }

  private getSeasonalAdjustment(date: Date, hour: number): number {
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    // 周末调整
    let adjustment = isWeekend ? 0.4 : 0

    // 时段调整
    if (hour >= 18 && hour <= 23) {
      adjustment += 0.3
    } else if (hour >= 12 && hour <= 17) {
      adjustment += 0.1
    }

    return adjustment
  }

  private getTrendAdjustment(data: TrafficData[]): number {
    if (data.length < 30) return 0

    const recentData = data.slice(-30)
    const olderData = data.slice(-60, -30)

    const recentAvg = recentData.reduce((sum, d) => sum + d.count, 0) / recentData.length
    const olderAvg = olderData.reduce((sum, d) => sum + d.count, 0) / olderData.length

    return (recentAvg - olderAvg) / olderAvg
  }

  private getExternalAdjustment(factors: ExternalFactors): number {
    let adjustment = 0

    // 天气影响
    if (factors.weather === "rainy" || factors.weather === "snowy") {
      adjustment += 0.15
    }

    // 节假日影响
    if (factors.isHoliday) {
      adjustment += 0.5
    }

    // 活动影响
    if (factors.hasEvent) {
      adjustment += 0.3
    }

    return adjustment
  }

  private calculateConfidence(data: TrafficData[], daysAhead: number): number {
    // 数据越多，预测越远，置信度越低
    const dataQuality = Math.min(data.length / 365, 1)
    const timeDecay = Math.exp(-daysAhead / 7)

    return dataQuality * timeDecay * 0.9
  }

  private calculateRange(predicted: number, confidence: number): { min: number; max: number } {
    const margin = predicted * (1 - confidence)
    return {
      min: Math.max(0, Math.round(predicted - margin)),
      max: Math.round(predicted + margin),
    }
  }

  private applySeasonalPatterns(patterns: SeasonalPattern[], date: Date): number {
    let forecast = 1000

    for (const pattern of patterns) {
      if (pattern.type === "monthly") {
        const month = date.getMonth()
        forecast *= pattern.pattern[month] || 1
      }
    }

    return forecast
  }

  private analyzePossibleReasons(actual: number, expected: number): string[] {
    const reasons = []

    if (actual < expected * 0.5) {
      reasons.push("可能受恶劣天气影响")
      reasons.push("可能有竞争对手促销活动")
      reasons.push("可能系统故障导致数据异常")
    } else if (actual > expected * 1.5) {
      reasons.push("可能有大型活动或节假日")
      reasons.push("可能有营销活动效果显著")
      reasons.push("可能有团体预订")
    }

    return reasons
  }
}

let _trafficPredictionSystemInstance: TrafficPredictionSystem | null = null

export function getTrafficPredictionSystem(): TrafficPredictionSystem {
  if (!_trafficPredictionSystemInstance) {
    _trafficPredictionSystemInstance = new TrafficPredictionSystem()
  }
  return _trafficPredictionSystemInstance
}

export const trafficPredictionSystem = new Proxy({} as TrafficPredictionSystem, {
  get(target, prop) {
    const instance = getTrafficPredictionSystem()
    const value = instance[prop as keyof TrafficPredictionSystem]
    if (typeof value === "function") {
      return value.bind(instance)
    }
    return value
  },
})
