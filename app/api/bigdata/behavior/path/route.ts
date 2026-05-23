import { type NextRequest, NextResponse } from "next/server"
import { userBehaviorAnalytics } from "@/lib/bigdata/user-behavior-analytics"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { sessionData } = await request.json()

    if (!sessionData) {
      return NextResponse.json({ error: "缺少会话数据" }, { status: 400 })
    }

    // 路径分析
    const analysis = await userBehaviorAnalytics.analyzeUserPath(sessionData)

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error) {
    console.error("[API] 路径分析失败:", error)
    return NextResponse.json({ error: "路径分析失败" }, { status: 500 })
  }
}
