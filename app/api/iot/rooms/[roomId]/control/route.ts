import { type NextRequest, NextResponse } from "next/server"
import { smartRoomControl, type LightingMode, type ACMode, type SceneMode } from "@/lib/iot/smart-room-control"

export const runtime = "nodejs"

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { roomId } = params
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case "lighting":
        await smartRoomControl.controlLighting(roomId, data.mode as LightingMode, data.brightness, data.color)
        break

      case "ac":
        await smartRoomControl.controlAirConditioner(roomId, data.temperature, data.mode as ACMode, data.fanSpeed)
        break

      case "audio":
        await smartRoomControl.controlAudio(roomId, data.volume, data.equalizer)
        break

      case "scene":
        await smartRoomControl.setSceneMode(roomId, data.scene as SceneMode)
        break

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const status = smartRoomControl.getRoomStatus(roomId)

    return NextResponse.json({
      success: true,
      status,
    })
  } catch (error) {
    console.error("[IoT Control API] Error:", error)
    return NextResponse.json({ error: "Failed to control device" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { roomId } = params
    const status = smartRoomControl.getRoomStatus(roomId)

    if (!status) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json({ status })
  } catch (error) {
    console.error("[IoT Control API] Error:", error)
    return NextResponse.json({ error: "Failed to get room status" }, { status: 500 })
  }
}
