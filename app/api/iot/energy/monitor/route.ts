import { type NextRequest, NextResponse } from "next/server"
import { smartEnergyManagement } from "@/lib/iot/smart-energy-management"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get("deviceId")

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 })
    }

    const energyData = smartEnergyManagement.monitorEnergyConsumption(deviceId)

    if (!energyData) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    return NextResponse.json(energyData)
  } catch (error) {
    console.error("[API] Energy monitor error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
