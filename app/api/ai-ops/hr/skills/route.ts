import { type NextRequest, NextResponse } from "next/server"
import { hrTalentIntelligence } from "@/lib/ai-ops/hr-talent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, skillMatrix } = await request.json()

    if (!employeeId || !skillMatrix) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const assessment = await hrTalentIntelligence.assessSkills(employeeId, skillMatrix)

    return NextResponse.json({
      success: true,
      assessment,
    })
  } catch (error: any) {
    console.error("[v0] Assess skills failed:", error)
    return NextResponse.json({ error: error.message || "技能评估失败" }, { status: 500 })
  }
}
