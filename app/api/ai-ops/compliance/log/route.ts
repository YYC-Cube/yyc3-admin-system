import { type NextRequest, NextResponse } from "next/server"
import { complianceAuditEngine, type OperationType } from "@/lib/ai-ops/compliance-audit-engine"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, operation, context } = body

    const log = await complianceAuditEngine.logOperation(userId, operation as OperationType, context)

    return NextResponse.json({
      success: true,
      data: log,
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

export async function GET(_request: NextRequest) {
  try {

    // 获取审计日志
    // 实际应该从数据库查询
    const logs: any[] = []

    return NextResponse.json({
      success: true,
      data: logs,
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
