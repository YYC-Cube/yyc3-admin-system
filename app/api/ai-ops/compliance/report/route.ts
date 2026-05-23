import { type NextRequest, NextResponse } from "next/server"
import { complianceAuditEngine } from "@/lib/ai-ops/compliance-audit-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startDate, endDate, scope } = body

    const report = await complianceAuditEngine.generateAuditReport(
      {
        start: new Date(startDate),
        end: new Date(endDate),
      },
      scope,
    )

    return NextResponse.json({
      success: true,
      data: report,
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
