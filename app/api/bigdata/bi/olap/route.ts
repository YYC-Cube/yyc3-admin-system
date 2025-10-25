import { type NextRequest, NextResponse } from "next/server"
import { businessIntelligence } from "@/lib/bigdata/business-intelligence"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cube, dimensions, measures } = body

    const result = await businessIntelligence.olapAnalysis(cube, dimensions, measures)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[API] OLAP分析失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "OLAP分析失败",
      },
      { status: 500 },
    )
  }
}
