import { type NextRequest, NextResponse } from "next/server"
import { complianceAuditEngine } from "@/lib/ai-ops/compliance-audit-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entity, data } = body

    const result = await complianceAuditEngine.checkCompliance(entity, data)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
