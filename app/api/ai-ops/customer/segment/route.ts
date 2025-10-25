import { NextResponse } from "next/server"
import { customerIntelligencePromotion } from "@/lib/ai-ops/customer-intelligence-promotion"
import { db } from "@/lib/db/mysql"

export const runtime = "nodejs"

export async function GET() {
  try {
    // 获取所有会员
    const [members] = await db.query("SELECT * FROM members WHERE status = 'active'")

    // 执行客户分层
    const segments = await customerIntelligencePromotion.segmentCustomers(members)

    return NextResponse.json({
      success: true,
      data: segments,
    })
  } catch (error) {
    console.error("[v0] Customer segmentation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "客户分层失败",
      },
      { status: 500 },
    )
  }
}
