import { type NextRequest, NextResponse } from "next/server"
import { feedbackIntelligenceSystem } from "@/lib/ai-ops/feedback-intelligence-system"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startDate, endDate } = body

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "缺少时间范围参数" }, { status: 400 })
    }

    const insights = await feedbackIntelligenceSystem.generateInsights({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return NextResponse.json({
      success: true,
      data: insights,
    })
  } catch (error) {
    console.error("[v0] Generate insights error:", error)
    return NextResponse.json({ error: "生成洞察失败" }, { status: 500 })
  }
}
