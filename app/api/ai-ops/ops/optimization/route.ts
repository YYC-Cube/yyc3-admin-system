import { type NextRequest, NextResponse } from "next/server"
import { opsExecutionTrackerIncentive } from "@/lib/ai-ops/ops-execution-tracker-incentive"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { executionData } = await request.json()

    if (!executionData || !Array.isArray(executionData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid execution data",
        },
        { status: 400 },
      )
    }

    const optimization = await opsExecutionTrackerIncentive.generateOptimization(executionData)

    return NextResponse.json({
      success: true,
      data: optimization,
    })
  } catch (error) {
    console.error("[v0] Optimization generation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Optimization generation failed",
      },
      { status: 500 },
    )
  }
}
