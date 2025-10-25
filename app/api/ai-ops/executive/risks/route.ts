import { type NextRequest, NextResponse } from "next/server"
import { executiveIntelligenceDashboard } from "@/lib/ai-ops/executive-intelligence-dashboard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeIds, timeRange, thresholds } = body

    if (!storeIds || !Array.isArray(storeIds)) {
      return NextResponse.json({ error: "门店ID列表必填" }, { status: 400 })
    }

    const startDate = timeRange?.startDate
      ? new Date(timeRange.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = timeRange?.endDate ? new Date(timeRange.endDate) : new Date()

    // 默认风险阈值
    const defaultThresholds = [
      { metric: "margin", warningLevel: 15, criticalLevel: 10 },
      { metric: "efficiency", warningLevel: 75, criticalLevel: 70 },
      { metric: "retention", warningLevel: 70, criticalLevel: 60 },
      { metric: "attrition", warningLevel: 15, criticalLevel: 20 },
    ]

    const riskThresholds = thresholds || defaultThresholds

    const risks = await executiveIntelligenceDashboard.detectRisks(storeIds, { startDate, endDate }, riskThresholds)

    return NextResponse.json({
      success: true,
      data: risks,
    })
  } catch (error) {
    console.error("[风险预警API] 错误:", error)
    return NextResponse.json({ error: "风险检测失败" }, { status: 500 })
  }
}
