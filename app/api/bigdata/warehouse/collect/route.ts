import { type NextRequest, NextResponse } from "next/server"
import { realtimeDataWarehouse } from "@/lib/bigdata/realtime-data-warehouse"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source, schema } = body

    await realtimeDataWarehouse.collectData(source, schema)

    return NextResponse.json({
      success: true,
      message: "数据采集成功",
    })
  } catch (error) {
    console.error("[API] 数据采集失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "数据采集失败",
      },
      { status: 500 },
    )
  }
}
