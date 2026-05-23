import { type NextRequest, NextResponse } from "next/server"
import { realtimeDataWarehouse } from "@/lib/bigdata/realtime-data-warehouse"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const query = await request.json()

    const result = await realtimeDataWarehouse.queryRealtime(query)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[API] 查询失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "查询失败",
      },
      { status: 500 },
    )
  }
}
