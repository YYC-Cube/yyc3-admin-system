import { type NextRequest, NextResponse } from "next/server"
import { smartEnergyManagement } from "@/lib/iot/smart-energy-management"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { maxPower, maxCost, priorityDevices, timeSlots } = body

    const plan = smartEnergyManagement.optimizeEnergyUsage({
      maxPower: maxPower || 50000,
      maxCost: maxCost || 1000,
      priorityDevices: priorityDevices || [],
      timeSlots: timeSlots || [],
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error("[API] Energy optimization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
