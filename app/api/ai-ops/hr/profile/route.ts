import { type NextRequest, NextResponse } from "next/server"
import { hrTalentIntelligence } from "@/lib/ai-ops/hr-talent-intelligence"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, data } = await request.json()

    if (!employeeId || !data) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const profile = await hrTalentIntelligence.buildEmployeeProfile(employeeId, data)

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error: any) {
    console.error("[v0] Build employee profile failed:", error)
    return NextResponse.json({ error: error.message || "构建员工画像失败" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")

    if (!employeeId) {
      return NextResponse.json({ error: "缺少员工ID" }, { status: 400 })
    }

    // 获取员工画像
    const profile = await hrTalentIntelligence["getEmployeeProfile"](employeeId)

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error: any) {
    console.error("[v0] Get employee profile failed:", error)
    return NextResponse.json({ error: error.message || "获取员工画像失败" }, { status: 500 })
  }
}
