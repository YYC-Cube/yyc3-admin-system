import { type NextRequest, NextResponse } from "next/server"
import { userBehaviorAnalytics } from "@/lib/bigdata/user-behavior-analytics"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { cohort, timeRange } = await request.json()

    if (!cohort || !timeRange) {
      return NextResponse.json({ error: "缺少必需参数" }, { status: 400 })
    }

    // 留存分析
    const report = await userBehaviorAnalytics.retentionAnalysis(cohort, timeRange)

    return NextResponse.json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("[API] 留存分析失败:", error)
    return NextResponse.json({ error: "留存分析失败" }, { status: 500 })
  }
}
