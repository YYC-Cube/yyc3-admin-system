import { type NextRequest, NextResponse } from "next/server"
import { smartInventorySystem } from "@/lib/iot/smart-inventory-system"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const report = await smartInventorySystem.autoInventoryCheck()

    return NextResponse.json({
      success: true,
      data: report,
    })
  } catch (error) {
    console.error("[API] Inventory check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform inventory check",
      },
      { status: 500 },
    )
  }
}
