import { type NextRequest, NextResponse } from "next/server"
import { hrTalentIntelligence } from "@/lib/ai-ops/hr-talent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, indicators } = await request.json()

    if (!employeeId || !indicators) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const attritionRisk = await hrTalentIntelligence.predictAttrition(employeeId, indicators)

    return NextResponse.json({
      success: true,
      attritionRisk,
    })
  } catch (error: any) {
    console.error("[v0] Predict attrition failed:", error)
    return NextResponse.json({ error: error.message || "离职预测失败" }, { status: 500 })
  }
}
