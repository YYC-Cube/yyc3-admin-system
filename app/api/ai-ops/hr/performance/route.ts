import { type NextRequest, NextResponse } from "next/server"
import { hrTalentIntelligence } from "@/lib/ai-ops/hr-talent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, period, metrics } = await request.json()

    if (!employeeId || !period || !metrics) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const performanceScore = await hrTalentIntelligence.scorePerformance(employeeId, period, metrics)

    return NextResponse.json({
      success: true,
      performanceScore,
    })
  } catch (error: any) {
    console.error("[v0] Score performance failed:", error)
    return NextResponse.json({ error: error.message || "绩效评分失败" }, { status: 500 })
  }
}
