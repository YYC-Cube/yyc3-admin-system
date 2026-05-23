import { type NextRequest, NextResponse } from "next/server"
import { edgeCacheSystem } from "@/lib/edge/cache-system"

export async function POST(request: NextRequest) {
  try {
    const { pattern } = await request.json()

    if (!pattern) {
      return NextResponse.json({ error: "缺少缓存键模式" }, { status: 400 })
    }

    const count = await edgeCacheSystem.invalidateCache(pattern)

    return NextResponse.json({
      success: true,
      count,
      message: `已失效 ${count} 条缓存`,
    })
  } catch (error) {
    console.error("[API] 缓存失效失败:", error)
    return NextResponse.json({ error: "缓存失效失败" }, { status: 500 })
  }
}
