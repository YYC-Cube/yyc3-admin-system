import { type NextRequest, NextResponse } from "next/server"
import { executiveIntelligenceDashboard } from "@/lib/ai-ops/executive-intelligence-dashboard"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeIds, scenario, assumptions } = body

    if (!storeIds || !Array.isArray(storeIds)) {
      return NextResponse.json({ error: "门店ID列表必填" }, { status: 400 })
    }

    if (!scenario || !scenario.name) {
      return NextResponse.json({ error: "情景名称必填" }, { status: 400 })
    }

    const defaultAssumptions = [
      { name: "revenueGrowth", value: 10 },
      { name: "costReduction", value: 5 },
    ]

    const scenarioAssumptions = assumptions || defaultAssumptions

    const simulation = await executiveIntelligenceDashboard.simulateScenario(storeIds, scenario, scenarioAssumptions)

    return NextResponse.json({
      success: true,
      data: simulation,
    })
  } catch (error) {
    console.error("[情景模拟API] 错误:", error)
    return NextResponse.json({ error: "情景模拟失败" }, { status: 500 })
  }
}
