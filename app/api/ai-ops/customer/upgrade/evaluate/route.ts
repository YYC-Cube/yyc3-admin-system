import { NextResponse } from "next/server"
import { customerIntelligencePromotion } from "@/lib/ai-ops/customer-intelligence-promotion"
import { db } from "@/lib/db/mysql"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { memberId } = await request.json()

    if (!memberId) {
      return NextResponse.json(
        {
          success: false,
          error: "会员ID不能为空",
        },
        { status: 400 },
      )
    }

    // 获取会员信息
    const [members] = await db.query("SELECT * FROM members WHERE id = ?", [memberId])
    if (members.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "会员不存在",
        },
        { status: 404 },
      )
    }

    // 评估提档条件
    const evaluation = await customerIntelligencePromotion.evaluateUpgrade(members[0])

    return NextResponse.json({
      success: true,
      data: evaluation,
    })
  } catch (error) {
    console.error("[v0] Upgrade evaluation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "提档评估失败",
      },
      { status: 500 },
    )
  }
}
