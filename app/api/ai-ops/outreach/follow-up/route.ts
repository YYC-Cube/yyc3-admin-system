import { type NextRequest, NextResponse } from "next/server"
import { outreachAutomationEngine } from "@/lib/ai-ops/outreach-automation-engine"
import { db } from "@/lib/db/mysql"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { customerId, reason, lastVisitDays, lastOrderAmount, customerSegment } = await request.json()

    // 获取客户信息
    const [customers] = await db.query("SELECT * FROM members WHERE id = ?", [customerId])
    const customer = customers[0]

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // 生成回访话术
    const script = await outreachAutomationEngine.generateFollowUpScript(customer, {
      reason,
      lastVisitDays,
      lastOrderAmount,
      customerSegment,
      preferredChannel: "sms",
    })

    return NextResponse.json({
      success: true,
      script,
    })
  } catch (error) {
    console.error("[v0] Follow-up generation failed:", error)
    return NextResponse.json({ error: "Failed to generate follow-up script" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // 获取待跟进客户列表
    const pendingFollowUps = await outreachAutomationEngine.getPendingFollowUps()

    return NextResponse.json({
      success: true,
      data: pendingFollowUps,
      total: pendingFollowUps.length,
    })
  } catch (error) {
    console.error("[v0] Failed to get pending follow-ups:", error)
    return NextResponse.json({ error: "Failed to get pending follow-ups" }, { status: 500 })
  }
}
