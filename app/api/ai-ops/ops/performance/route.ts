import { type NextRequest, NextResponse } from "next/server"
import { opsExecutionTrackerIncentive } from "@/lib/ai-ops/ops-execution-tracker-incentive"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { employeeId, startDate, endDate } = await request.json()

    if (!employeeId || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters",
        },
        { status: 400 },
      )
    }

    const performance = await opsExecutionTrackerIncentive.evaluatePerformance(employeeId, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return NextResponse.json({
      success: true,
      data: performance,
    })
  } catch (error) {
    console.error("[v0] Performance evaluation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Performance evaluation failed",
      },
      { status: 500 },
    )
  }
}
