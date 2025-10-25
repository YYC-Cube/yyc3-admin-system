import { type NextRequest, NextResponse } from "next/server"
import { edgeAIInference } from "@/lib/edge/ai-inference"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const metrics = edgeAIInference.getMetrics()

    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
