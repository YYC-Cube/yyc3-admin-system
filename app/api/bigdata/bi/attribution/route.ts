import { type NextRequest, NextResponse } from "next/server"
import { businessIntelligence } from "@/lib/bigdata/business-intelligence"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { outcome, factors } = body

    const result = await businessIntelligence.attributionAnalysis(outcome, factors)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("[API] 归因分析失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "归因分析失败",
      },
      { status: 500 },
    )
  }
}
