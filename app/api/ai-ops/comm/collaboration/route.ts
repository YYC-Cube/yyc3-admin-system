import { type NextRequest, NextResponse } from "next/server"
import { internalCommunicationFramework } from "@/lib/ai-ops/internal-communication-framework"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskId, participants } = body

    if (!taskId || !participants) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const collaboration = await internalCommunicationFramework.collaborateOnTask(taskId, participants)

    return NextResponse.json({ collaboration })
  } catch (error) {
    console.error("[v0] Error creating collaboration:", error)
    return NextResponse.json({ error: "创建协作失败" }, { status: 500 })
  }
}
