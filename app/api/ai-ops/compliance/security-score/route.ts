import { type NextRequest, NextResponse } from "next/server"
import { complianceAuditEngine } from "@/lib/ai-ops/compliance-audit-engine"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const securityScore = await complianceAuditEngine.calculateSecurityScore()

    return NextResponse.json({
      success: true,
      data: securityScore,
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
