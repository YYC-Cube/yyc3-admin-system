import { type NextRequest, NextResponse } from "next/server"
import { profitIntelligenceEngine } from "@/lib/ai-ops/profit-intelligence-engine"

export async function POST(request: NextRequest) {
  try {
    const { storeId, assumptions } = await request.json()

    if (!storeId) {
      return NextResponse.json({ error: "缺少门店ID" }, { status: 400 })
    }

    // 获取历史数据(最近30天)
    const historicalData = await profitIntelligenceEngine.getHistoricalData(storeId, 30)

    // 使用默认假设或用户提供的假设
    const defaultAssumptions = {
      revenueGrowthRate: 2,
      costInflationRate: 1,
      marketTrend: "stable" as const,
    }

    const forecast = await profitIntelligenceEngine.forecastProfit(historicalData, assumptions || defaultAssumptions)

    return NextResponse.json({
      forecast,
      historicalData,
      assumptions: assumptions || defaultAssumptions,
    })
  } catch (error) {
    console.error("[v0] 利润预测失败:", error)
    return NextResponse.json({ error: "利润预测失败" }, { status: 500 })
  }
}

export const runtime = "nodejs"
