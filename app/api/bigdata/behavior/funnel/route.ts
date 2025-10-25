import { type NextRequest, NextResponse } from "next/server"
import { userBehaviorAnalytics } from "@/lib/bigdata/user-behavior-analytics"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { steps } = await request.json()

    if (!steps || !Array.isArray(steps)) {
      return NextResponse.json({ error: "缺少漏斗步骤" }, { status: 400 })
    }

    // 漏斗分析
    const report = await userBehaviorAnalytics.funnelAnalysis(steps)

    return NextResponse.json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("[API] 漏斗分析失败:", error)
    return NextResponse.json({ error: "漏斗分析失败" }, { status: 500 })
  }
}
