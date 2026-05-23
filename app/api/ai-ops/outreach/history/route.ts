import { type NextRequest, NextResponse } from "next/server"
import { outreachAutomationEngine } from "@/lib/ai-ops/outreach-automation-engine"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get("customerId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
    }

    const history = await outreachAutomationEngine.getContactHistory(customerId, limit)

    return NextResponse.json({
      success: true,
      data: history,
      total: history.length,
    })
  } catch (error) {
    console.error("[v0] Failed to get contact history:", error)
    return NextResponse.json({ error: "Failed to get contact history" }, { status: 500 })
  }
}
