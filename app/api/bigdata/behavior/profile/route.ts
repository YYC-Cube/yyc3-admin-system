import { type NextRequest, NextResponse } from "next/server"
import { userBehaviorAnalytics } from "@/lib/bigdata/user-behavior-analytics"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { userId, behaviorData } = await request.json()

    if (!userId || !behaviorData) {
      return NextResponse.json({ error: "缺少必需参数" }, { status: 400 })
    }

    // 构建用户画像
    const profile = await userBehaviorAnalytics.buildUserProfile(userId, behaviorData)

    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error) {
    console.error("[API] 用户画像构建失败:", error)
    return NextResponse.json({ error: "用户画像构建失败" }, { status: 500 })
  }
}
