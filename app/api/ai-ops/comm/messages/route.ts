import { type NextRequest, NextResponse } from "next/server"
import { internalCommunicationFramework } from "@/lib/ai-ops/internal-communication-framework"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, message } = body

    if (!from || !to || !message) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const result = await internalCommunicationFramework.sendMessage(from, to, message)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "发送消息失败" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!userId) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 })
    }

    const messages = await internalCommunicationFramework.getUserMessages(userId, limit)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error getting messages:", error)
    return NextResponse.json({ error: "获取消息失败" }, { status: 500 })
  }
}
