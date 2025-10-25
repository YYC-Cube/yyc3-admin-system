import { type NextRequest, NextResponse } from "next/server"
import { smartInventorySystem } from "@/lib/iot/smart-inventory-system"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const threshold = searchParams.get("threshold")

    const alerts = threshold
      ? smartInventorySystem.lowStockAlert(Number.parseInt(threshold))
      : smartInventorySystem.getAllAlerts()

    return NextResponse.json({
      success: true,
      data: alerts,
    })
  } catch (error) {
    console.error("[API] Get alerts error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get alerts",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { alertId } = await request.json()

    smartInventorySystem.acknowledgeAlert(alertId)

    return NextResponse.json({
      success: true,
      message: "Alert acknowledged",
    })
  } catch (error) {
    console.error("[API] Acknowledge alert error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to acknowledge alert",
      },
      { status: 500 },
    )
  }
}
