import { NextResponse } from "next/server"
import { edgeCacheSystem } from "@/lib/edge/cache-system"

export async function POST() {
  try {
    await edgeCacheSystem.clearAll()

    return NextResponse.json({
      success: true,
      message: "已清空所有缓存",
    })
  } catch (error) {
    console.error("[API] 清空缓存失败:", error)
    return NextResponse.json({ error: "清空缓存失败" }, { status: 500 })
  }
}
