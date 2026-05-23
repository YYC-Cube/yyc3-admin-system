import { type NextRequest, NextResponse } from "next/server"
import { businessIntelligence } from "@/lib/bigdata/business-intelligence"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { groups, metric } = body

    const result = await businessIntelligence.compareAnalysis(groups, metric)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[API] 对比分析失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "对比分析失败",
      },
      { status: 500 },
    )
  }
}
