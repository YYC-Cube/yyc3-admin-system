import { type NextRequest, NextResponse } from "next/server"
import { opsExecutionTrackerIncentive } from "@/lib/ai-ops/ops-execution-tracker-incentive"

export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const taskStatus = await opsExecutionTrackerIncentive.trackTask(params.taskId)

    return NextResponse.json({
      success: true,
      data: taskStatus,
    })
  } catch (error) {
    console.error("[v0] Task tracking failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Task tracking failed",
      },
      { status: 500 },
    )
  }
}
