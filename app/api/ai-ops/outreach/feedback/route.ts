import { type NextRequest, NextResponse } from "next/server"
import { outreachAutomationEngine } from "@/lib/ai-ops/outreach-automation-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { customerId, contactId, type, rating, content } = await request.json()

    await outreachAutomationEngine.recordFeedback(customerId, contactId, {
      type,
      rating,
      content,
    })

    return NextResponse.json({
      success: true,
      message: "Feedback recorded successfully",
    })
  } catch (error) {
    console.error("[v0] Feedback recording failed:", error)
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 })
  }
}
