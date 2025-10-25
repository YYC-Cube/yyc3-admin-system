import { type NextRequest, NextResponse } from "next/server"
import { outreachAutomationEngine } from "@/lib/ai-ops/outreach-automation-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, scriptId, scriptContent } = await request.json()

    const script = {
      id: scriptId || `script_${Date.now()}`,
      type: "follow_up" as const,
      content: scriptContent,
      variables: {},
      tone: "friendly" as const,
      estimatedDuration: 60,
    }

    const result = await outreachAutomationEngine.makeCall(phoneNumber, script)

    return NextResponse.json({
      success: result.success,
      data: result,
    })
  } catch (error) {
    console.error("[v0] Call initiation failed:", error)
    return NextResponse.json({ error: "Failed to initiate call" }, { status: 500 })
  }
}
