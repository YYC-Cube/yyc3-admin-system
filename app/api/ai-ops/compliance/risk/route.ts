import { type NextRequest, NextResponse } from "next/server"
import { complianceAuditEngine } from "@/lib/ai-ops/compliance-audit-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { findings } = body

    const riskLevel = await complianceAuditEngine.assessRiskLevel(findings || [])

    return NextResponse.json({
      success: true,
      data: riskLevel,
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
