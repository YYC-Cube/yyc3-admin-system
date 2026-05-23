import { type NextRequest, NextResponse } from "next/server"
import { edgeComputeFunction } from "@/lib/edge/compute-functions"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { dataPoints } = await request.json()

    if (!Array.isArray(dataPoints)) {
      return NextResponse.json({ error: "数据格式错误" }, { status: 400 })
    }

    // 在边缘节点聚合数据
    const aggregatedData = await edgeComputeFunction.aggregateData(dataPoints)

    return NextResponse.json({
      success: true,
      data: aggregatedData,
      processedAt: "edge",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[Edge Aggregate] 处理失败:", error)
    return NextResponse.json({ error: "数据聚合失败" }, { status: 500 })
  }
}
