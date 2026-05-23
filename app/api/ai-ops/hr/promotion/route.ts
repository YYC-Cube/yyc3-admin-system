import { type NextRequest, NextResponse } from "next/server"
import { hrTalentIntelligence } from "@/lib/ai-ops/hr-talent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { employeeId } = await request.json()

    if (!employeeId) {
      return NextResponse.json({ error: "缺少员工ID" }, { status: 400 })
    }

    const suggestion = await hrTalentIntelligence.suggestPromotion(employeeId)

    return NextResponse.json({
      success: true,
      suggestion,
    })
  } catch (error: any) {
    console.error("[v0] Suggest promotion failed:", error)
    return NextResponse.json({ error: error.message || "生成晋升建议失败" }, { status: 500 })
  }
}
