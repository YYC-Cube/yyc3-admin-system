import { type NextRequest, NextResponse } from "next/server"
import { edgeComputeFunction } from "@/lib/edge/compute-functions"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json()

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: "事件数据格式错误" }, { status: 400 })
    }

    // 在边缘节点实时分析
    const analysisResult = await edgeComputeFunction.analyzeRealtime(events)

    return NextResponse.json({
      success: true,
      data: analysisResult,
      processedAt: "edge",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[Edge Analyze] 处理失败:", error)
    return NextResponse.json({ error: "实时分析失败" }, { status: 500 })
  }
}
