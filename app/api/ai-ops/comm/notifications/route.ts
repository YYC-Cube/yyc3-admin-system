import { type NextRequest, NextResponse } from "next/server"
import { internalCommunicationFramework } from "@/lib/ai-ops/internal-communication-framework"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, notification } = body

    if (!userId || !notification) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    await internalCommunicationFramework.pushNotification(userId, notification)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error pushing notification:", error)
    return NextResponse.json({ error: "推送通知失败" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 })
    }

    const notifications = await internalCommunicationFramework.getUserNotifications(userId, limit)

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("[v0] Error getting notifications:", error)
    return NextResponse.json({ error: "获取通知失败" }, { status: 500 })
  }
}
