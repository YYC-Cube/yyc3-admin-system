import { type NextRequest, NextResponse } from "next/server"
import { feedbackIntelligenceSystem } from "@/lib/ai-ops/feedback-intelligence-system"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, source, content, customerId, employeeId, isAnonymous } = body

    if (!type || !source || !content) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
    }

    const feedback = await feedbackIntelligenceSystem.collectFeedback(
      type,
      source,
      content,
      customerId,
      employeeId,
      isAnonymous || false,
    )

    return NextResponse.json({
      success: true,
      data: feedback,
    })
  } catch (error) {
    console.error("[v0] Collect feedback error:", error)
    return NextResponse.json({ error: "收集反馈失败" }, { status: 500 })
  }
}
