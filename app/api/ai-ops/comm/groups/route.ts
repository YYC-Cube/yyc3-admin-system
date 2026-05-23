import { type NextRequest, NextResponse } from "next/server"
import { internalCommunicationFramework } from "@/lib/ai-ops/internal-communication-framework"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, members, type, createdBy } = body

    if (!name || !members || !type || !createdBy) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const group = await internalCommunicationFramework.createGroup(name, members, type, createdBy)

    return NextResponse.json({ group })
  } catch (error) {
    console.error("[v0] Error creating group:", error)
    return NextResponse.json({ error: "创建群组失败" }, { status: 500 })
  }
}
