import { type NextRequest, NextResponse } from "next/server"
import { internalCommunicationFramework } from "@/lib/ai-ops/internal-communication-framework"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const organization = await internalCommunicationFramework.getOrganization()

    return NextResponse.json({ organization })
  } catch (error) {
    console.error("[v0] Error getting organization:", error)
    return NextResponse.json({ error: "获取组织架构失败" }, { status: 500 })
  }
}
