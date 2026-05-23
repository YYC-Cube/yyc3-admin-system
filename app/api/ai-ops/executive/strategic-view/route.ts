import { type NextRequest, NextResponse } from "next/server"
import { executiveIntelligenceDashboard } from "@/lib/ai-ops/executive-intelligence-dashboard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeIds, timeRange } = body

    if (!storeIds || !Array.isArray(storeIds)) {
      return NextResponse.json({ error: "门店ID列表必填" }, { status: 400 })
    }

    const startDate = timeRange?.startDate
      ? new Date(timeRange.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = timeRange?.endDate ? new Date(timeRange.endDate) : new Date()

    const strategicView = await executiveIntelligenceDashboard.generateStrategicView(storeIds, {
      startDate,
      endDate,
    })

    return NextResponse.json({
      success: true,
      data: strategicView,
    })
  } catch (error) {
    console.error("[战略视图API] 错误:", error)
    return NextResponse.json({ error: "生成战略视图失败" }, { status: 500 })
  }
}
