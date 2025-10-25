import { type NextRequest, NextResponse } from "next/server"
import { outreachAutomationEngine } from "@/lib/ai-ops/outreach-automation-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message, templateId, batch } = await request.json()

    if (batch && Array.isArray(phoneNumber)) {
      // 批量发送
      const results = await outreachAutomationEngine.sendBatchSMS(phoneNumber, message)

      const successCount = results.filter((r) => r.success).length
      const failedCount = results.length - successCount

      return NextResponse.json({
        success: true,
        results,
        summary: {
          total: results.length,
          success: successCount,
          failed: failedCount,
        },
      })
    } else {
      // 单条发送
      const result = await outreachAutomationEngine.sendSMS(phoneNumber, message)

      return NextResponse.json({
        success: result.success,
        data: result,
      })
    }
  } catch (error) {
    console.error("[v0] SMS sending failed:", error)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}
