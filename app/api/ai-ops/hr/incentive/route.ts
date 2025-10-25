import { type NextRequest, NextResponse } from "next/server"
import { hrTalentIntelligence } from "@/lib/ai-ops/hr-talent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { performance, incentiveSystem } = await request.json()

    if (!performance || !incentiveSystem) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const incentiveAction = await hrTalentIntelligence.linkIncentive(performance, incentiveSystem)

    return NextResponse.json({
      success: true,
      incentiveAction,
    })
  } catch (error: any) {
    console.error("[v0] Link incentive failed:", error)
    return NextResponse.json({ error: error.message || "激励联动失败" }, { status: 500 })
  }
}
