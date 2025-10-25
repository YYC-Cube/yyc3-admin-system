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

    const anomalies = await opsExecutionTrackerIncentive.detectAnomalies(executionData)

    return NextResponse.json({
      success: true,
      data: {
        anomalies,
        count: anomalies.length,
        criticalCount: anomalies.filter((a) => a.severity === "critical").length,
        highCount: anomalies.filter((a) => a.severity === "high").length,
      },
    })
  } catch (error) {
    console.error("[v0] Anomaly detection failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Anomaly detection failed",
      },
      { status: 500 },
    )
  }
}
