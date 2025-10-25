import { type NextRequest, NextResponse } from "next/server"
import { outreachAutomationEngine } from "@/lib/ai-ops/outreach-automation-engine"
import { db } from "@/lib/db/mysql"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { customerId, eventId } = await request.json()

    // 获取客户信息
    const [customers] = await db.query("SELECT * FROM members WHERE id = ?", [customerId])
    const customer = customers[0]

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // 获取活动信息
    const [events] = await db.query("SELECT * FROM events WHERE id = ?", [eventId])
    const event = events[0]

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // 生成邀约
    const invitation = await outreachAutomationEngine.generateInvitation(customer, event)

    // 发送邀约
    const sent = await outreachAutomationEngine.sendInvitation(invitation)

    return NextResponse.json({
      success: sent,
      data: invitation,
    })
  } catch (error) {
    console.error("[v0] Invitation generation failed:", error)
    return NextResponse.json({ error: "Failed to generate invitation" }, { status: 500 })
  }
}
