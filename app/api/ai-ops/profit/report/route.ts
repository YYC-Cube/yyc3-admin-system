import { type NextRequest, NextResponse } from "next/server"
import { profitIntelligenceEngine } from "@/lib/ai-ops/profit-intelligence-engine"

export async function POST(request: NextRequest) {
  try {
    const { storeId, startDate, endDate } = await request.json()

    if (!storeId || !startDate || !endDate) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const timeRange = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    }

    const [costs, revenue] = await Promise.all([
      profitIntelligenceEngine.calculateCosts(storeId, timeRange),
      profitIntelligenceEngine.analyzeRevenue(storeId, timeRange),
    ])

    const report = profitIntelligenceEngine.calculateProfitLoss(costs, revenue)

    return NextResponse.json({
      ...report,
      costs,
      revenue,
      timeRange,
    })
  } catch (error) {
    console.error("[v0] 盈亏报告生成失败:", error)
    return NextResponse.json({ error: "盈亏报告生成失败" }, { status: 500 })
  }
}

export const runtime = "nodejs"
