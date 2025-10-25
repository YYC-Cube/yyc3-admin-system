import { db } from "@/lib/db/mysql"

export interface TimeRange {
  startDate: Date
  endDate: Date
}

export interface CostBreakdown {
  fixedCosts: {
    rent: number
    labor: number
    depreciation: number
    insurance: number
  }
  variableCosts: {
    utilities: number
    supplies: number
    marketing: number
    maintenance: number
  }
  totalCosts: number
}

export interface RevenueAnalysis {
  roomRevenue: number
  beverageRevenue: number
  packageRevenue: number
  membershipRevenue: number
  otherRevenue: number
  totalRevenue: number
}

export interface ProfitLossReport {
  revenue: number
  costs: number
  grossProfit: number
  grossMargin: number
  netProfit: number
  netMargin: number
  roi: number
  breakEvenPoint: number
}

export interface ComparisonReport {
  stores: {
    storeId: string
    storeName: string
    revenue: number
    costs: number
    profit: number
    margin: number
  }[]
  summary: {
    totalRevenue: number
    totalCosts: number
    totalProfit: number
    avgMargin: number
  }
}

export interface HistoricalData {
  date: Date
  revenue: number
  costs: number
  profit: number
}

export interface Assumptions {
  revenueGrowthRate: number
  costInflationRate: number
  marketTrend: "up" | "down" | "stable"
}

export interface ProfitForecast {
  period: string
  forecastRevenue: number
  forecastCosts: number
  forecastProfit: number
  confidence: number
  trend: "up" | "down" | "stable"
}

export class ProfitIntelligenceEngine {
  // 成本计算
  async calculateCosts(storeId: string, timeRange: TimeRange): Promise<CostBreakdown> {
    // 查询固定成本
    const fixedCostsQuery = `
      SELECT 
        SUM(CASE WHEN cost_type = 'rent' THEN amount ELSE 0 END) as rent,
        SUM(CASE WHEN cost_type = 'labor' THEN amount ELSE 0 END) as labor,
        SUM(CASE WHEN cost_type = 'depreciation' THEN amount ELSE 0 END) as depreciation,
        SUM(CASE WHEN cost_type = 'insurance' THEN amount ELSE 0 END) as insurance
      FROM costs
      WHERE store_id = ? 
        AND cost_category = 'fixed'
        AND date BETWEEN ? AND ?
    `

    // 查询变动成本
    const variableCostsQuery = `
      SELECT 
        SUM(CASE WHEN cost_type = 'utilities' THEN amount ELSE 0 END) as utilities,
        SUM(CASE WHEN cost_type = 'supplies' THEN amount ELSE 0 END) as supplies,
        SUM(CASE WHEN cost_type = 'marketing' THEN amount ELSE 0 END) as marketing,
        SUM(CASE WHEN cost_type = 'maintenance' THEN amount ELSE 0 END) as maintenance
      FROM costs
      WHERE store_id = ? 
        AND cost_category = 'variable'
        AND date BETWEEN ? AND ?
    `

    const [fixedCosts] = await db.query(fixedCostsQuery, [storeId, timeRange.startDate, timeRange.endDate])

    const [variableCosts] = await db.query(variableCostsQuery, [storeId, timeRange.startDate, timeRange.endDate])

    const fixed = fixedCosts[0] || {
      rent: 0,
      labor: 0,
      depreciation: 0,
      insurance: 0,
    }
    const variable = variableCosts[0] || {
      utilities: 0,
      supplies: 0,
      marketing: 0,
      maintenance: 0,
    }

    const totalFixed = fixed.rent + fixed.labor + fixed.depreciation + fixed.insurance
    const totalVariable = variable.utilities + variable.supplies + variable.marketing + variable.maintenance

    return {
      fixedCosts: fixed,
      variableCosts: variable,
      totalCosts: totalFixed + totalVariable,
    }
  }

  // 收入分析
  async analyzeRevenue(storeId: string, timeRange: TimeRange): Promise<RevenueAnalysis> {
    const query = `
      SELECT 
        SUM(CASE WHEN revenue_type = 'room' THEN amount ELSE 0 END) as roomRevenue,
        SUM(CASE WHEN revenue_type = 'beverage' THEN amount ELSE 0 END) as beverageRevenue,
        SUM(CASE WHEN revenue_type = 'package' THEN amount ELSE 0 END) as packageRevenue,
        SUM(CASE WHEN revenue_type = 'membership' THEN amount ELSE 0 END) as membershipRevenue,
        SUM(CASE WHEN revenue_type = 'other' THEN amount ELSE 0 END) as otherRevenue,
        SUM(amount) as totalRevenue
      FROM revenue
      WHERE store_id = ? 
        AND date BETWEEN ? AND ?
    `

    const [result] = await db.query(query, [storeId, timeRange.startDate, timeRange.endDate])

    return (
      result[0] || {
        roomRevenue: 0,
        beverageRevenue: 0,
        packageRevenue: 0,
        membershipRevenue: 0,
        otherRevenue: 0,
        totalRevenue: 0,
      }
    )
  }

  // 盈亏计算
  calculateProfitLoss(costs: CostBreakdown, revenue: RevenueAnalysis): ProfitLossReport {
    const totalRevenue = revenue.totalRevenue
    const totalCosts = costs.totalCosts

    const grossProfit = totalRevenue - totalCosts
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

    // 假设净利润为毛利润的80%(扣除税费等)
    const netProfit = grossProfit * 0.8
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    // 计算ROI (假设初始投资为固定成本的10倍)
    const initialInvestment = costs.fixedCosts.rent * 10
    const roi = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0

    // 计算盈亏平衡点
    const breakEvenPoint = grossMargin > 0 ? (costs.totalCosts / grossMargin) * 100 : 0

    return {
      revenue: totalRevenue,
      costs: totalCosts,
      grossProfit,
      grossMargin,
      netProfit,
      netMargin,
      roi,
      breakEvenPoint,
    }
  }

  // 对比分析
  async compareStores(storeIds: string[], timeRange: TimeRange): Promise<ComparisonReport> {
    const stores = await Promise.all(
      storeIds.map(async (storeId) => {
        const costs = await this.calculateCosts(storeId, timeRange)
        const revenue = await this.analyzeRevenue(storeId, timeRange)
        const profitLoss = this.calculateProfitLoss(costs, revenue)

        // 获取门店名称
        const [storeInfo] = await db.query("SELECT name FROM stores WHERE id = ?", [storeId])

        return {
          storeId,
          storeName: storeInfo[0]?.name || `门店${storeId}`,
          revenue: profitLoss.revenue,
          costs: profitLoss.costs,
          profit: profitLoss.netProfit,
          margin: profitLoss.netMargin,
        }
      }),
    )

    const summary = stores.reduce(
      (acc, store) => ({
        totalRevenue: acc.totalRevenue + store.revenue,
        totalCosts: acc.totalCosts + store.costs,
        totalProfit: acc.totalProfit + store.profit,
        avgMargin: 0, // 将在下面计算
      }),
      { totalRevenue: 0, totalCosts: 0, totalProfit: 0, avgMargin: 0 },
    )

    summary.avgMargin = stores.length > 0 ? stores.reduce((sum, s) => sum + s.margin, 0) / stores.length : 0

    return { stores, summary }
  }

  // 预测分析
  async forecastProfit(historicalData: HistoricalData[], assumptions: Assumptions): Promise<ProfitForecast[]> {
    if (historicalData.length === 0) {
      return []
    }

    // 简单的线性预测模型
    const forecasts: ProfitForecast[] = []
    const lastData = historicalData[historicalData.length - 1]

    // 预测未来7天
    for (let i = 1; i <= 7; i++) {
      const forecastDate = new Date(lastData.date)
      forecastDate.setDate(forecastDate.getDate() + i)

      // 应用增长率和通胀率
      const forecastRevenue = lastData.revenue * (1 + assumptions.revenueGrowthRate / 100)
      const forecastCosts = lastData.costs * (1 + assumptions.costInflationRate / 100)
      const forecastProfit = forecastRevenue - forecastCosts

      // 根据市场趋势调整
      let adjustedRevenue = forecastRevenue
      if (assumptions.marketTrend === "up") {
        adjustedRevenue *= 1.05
      } else if (assumptions.marketTrend === "down") {
        adjustedRevenue *= 0.95
      }

      // 计算置信度(基于历史数据的稳定性)
      const variance = this.calculateVariance(historicalData)
      const confidence = Math.max(0, Math.min(100, 100 - variance * 10))

      forecasts.push({
        period: forecastDate.toISOString().split("T")[0],
        forecastRevenue: adjustedRevenue,
        forecastCosts,
        forecastProfit: adjustedRevenue - forecastCosts,
        confidence,
        trend: assumptions.marketTrend,
      })
    }

    return forecasts
  }

  // 计算方差(用于置信度计算)
  private calculateVariance(data: HistoricalData[]): number {
    if (data.length < 2) return 0

    const profits = data.map((d) => d.profit)
    const mean = profits.reduce((sum, p) => sum + p, 0) / profits.length
    const variance = profits.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / profits.length

    return Math.sqrt(variance) / mean
  }

  // 获取历史数据
  async getHistoricalData(storeId: string, days = 30): Promise<HistoricalData[]> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const query = `
      SELECT 
        DATE(date) as date,
        SUM(CASE WHEN type = 'revenue' THEN amount ELSE 0 END) as revenue,
        SUM(CASE WHEN type = 'cost' THEN amount ELSE 0 END) as costs
      FROM financial_records
      WHERE store_id = ? 
        AND date BETWEEN ? AND ?
      GROUP BY DATE(date)
      ORDER BY date ASC
    `

    const [results] = await db.query(query, [storeId, startDate, endDate])

    return results.map((row: any) => ({
      date: new Date(row.date),
      revenue: row.revenue || 0,
      costs: row.costs || 0,
      profit: (row.revenue || 0) - (row.costs || 0),
    }))
  }
}

export const profitIntelligenceEngine = new ProfitIntelligenceEngine()
