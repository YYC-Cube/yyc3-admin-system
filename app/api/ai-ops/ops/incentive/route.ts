import { type NextRequest, NextResponse } from "next/server"
import { opsExecutionTrackerIncentive } from "@/lib/ai-ops/ops-execution-tracker-incentive"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { performance, rules } = await request.json()

    if (!performance || !rules) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters",
        },
        { status: 400 },
      )
    }

    const incentive = await opsExecutionTrackerIncentive.calculateIncentive(performance, rules)

    return NextResponse.json({
      success: true,
      data: incentive,
    })
  } catch (error) {
    console.error("[v0] Incentive calculation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Incentive calculation failed",
      },
      { status: 500 },
    )
  }
}
