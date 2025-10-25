import { type NextRequest, NextResponse } from "next/server"
import { businessIntelligence } from "@/lib/bigdata/business-intelligence"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric, timeRange } = body

    // 转换时间范围
    const parsedTimeRange = {
      start: new Date(timeRange.start),
      end: new Date(timeRange.end),
      granularity: timeRange.granularity,
    }

    const result = await businessIntelligence.trendAnalysis(metric, parsedTimeRange)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[API] 趋势分析失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "趋势分析失败",
      },
      { status: 500 },
    )
  }
}
