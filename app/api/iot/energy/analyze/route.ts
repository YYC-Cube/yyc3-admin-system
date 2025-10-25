import { type NextRequest, NextResponse } from "next/server"
import { smartEnergyManagement } from "@/lib/iot/smart-energy-management"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startDate, endDate, granularity } = body

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start date and end date are required" }, { status: 400 })
    }

    const analysis = smartEnergyManagement.analyzeEnergyUsage({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      granularity: granularity || "day",
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("[API] Energy analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
