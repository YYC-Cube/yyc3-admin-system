import { type NextRequest, NextResponse } from "next/server"
import { executiveIntelligenceDashboard } from "@/lib/ai-ops/executive-intelligence-dashboard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeIds, timeRange, goals } = body

    if (!storeIds || !Array.isArray(storeIds)) {
      return NextResponse.json({ error: "门店ID列表必填" }, { status: 400 })
    }

    const startDate = timeRange?.startDate
      ? new Date(timeRange.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = timeRange?.endDate ? new Date(timeRange.endDate) : new Date()

    // 默认战略目标
    const defaultGoals = {
      revenue: 1200000,
      profit: 250000,
      customerGrowth: 200,
      employeeSatisfaction: 85,
    }

    const strategicGoals = goals || defaultGoals

    const recommendations = await executiveIntelligenceDashboard.generateRecommendations(
      storeIds,
      { startDate, endDate },
      strategicGoals,
    )

    return NextResponse.json({
      success: true,
      data: recommendations,
    })
  } catch (error) {
    console.error("[智能建议API] 错误:", error)
    return NextResponse.json({ error: "生成建议失败" }, { status: 500 })
  }
}
