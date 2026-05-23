import { type NextRequest, NextResponse } from "next/server"
import { hrTalentIntelligence } from "@/lib/ai-ops/hr-talent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { profile, goals } = await request.json()

    if (!profile || !goals) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const careerPath = await hrTalentIntelligence.generateCareerPath(profile, goals)

    return NextResponse.json({
      success: true,
      careerPath,
    })
  } catch (error: any) {
    console.error("[v0] Generate career path failed:", error)
    return NextResponse.json({ error: error.message || "生成成长路径失败" }, { status: 500 })
  }
}
