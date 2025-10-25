import { type NextRequest, NextResponse } from "next/server"
import { executiveIntelligenceDashboard } from "@/lib/ai-ops/executive-intelligence-dashboard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeIds, timeRange, kpiDefinitions } = body

    if (!storeIds || !Array.isArray(storeIds)) {
      return NextResponse.json({ error: "门店ID列表必填" }, { status: 400 })
    }

    const startDate = timeRange?.startDate
      ? new Date(timeRange.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = timeRange?.endDate ? new Date(timeRange.endDate) : new Date()

    // 默认KPI定义
    const defaultKPIs = [
      { name: "revenue", category: "financial" as const, target: 1000000, weight: 0.3 },
      { name: "profit", category: "financial" as const, target: 200000, weight: 0.25 },
      { name: "efficiency", category: "operational" as const, target: 85, weight: 0.2 },
      { name: "satisfaction", category: "customer" as const, target: 90, weight: 0.15 },
      { name: "retention", category: "customer" as const, target: 80, weight: 0.1 },
    ]

    const kpis = kpiDefinitions || defaultKPIs

    const kpiReport = await executiveIntelligenceDashboard.calculateKPIs(storeIds, { startDate, endDate }, kpis)

    return NextResponse.json({
      success: true,
      data: kpiReport,
    })
  } catch (error) {
    console.error("[KPI计算API] 错误:", error)
    return NextResponse.json({ error: "计算KPI失败" }, { status: 500 })
  }
}
