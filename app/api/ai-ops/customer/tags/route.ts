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

    // 获取行为数据
    const [behaviorData] = await db.query(
      `SELECT 
        member_id as memberId,
        visit_frequency as visitFrequency,
        avg_spending as avgSpending,
        DATEDIFF(NOW(), last_visit_date) as lastVisitDays,
        total_spending as totalSpending,
        favorite_categories as favoriteCategories,
        preferred_time_slots as preferredTimeSlots,
        response_rate as responseRate,
        churn_risk as churnRisk
      FROM member_behavior
      WHERE member_id = ?`,
      [memberId],
    )

    if (behaviorData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "行为数据不存在",
        },
        { status: 404 },
      )
    }

    const behavior = {
      ...behaviorData[0],
      favoriteCategories: JSON.parse(behaviorData[0].favoriteCategories || "[]"),
      preferredTimeSlots: JSON.parse(behaviorData[0].preferredTimeSlots || "[]"),
    }

    // 生成客户标签
    const tags = await customerIntelligencePromotion.tagCustomers(members[0], behavior)

    return NextResponse.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    console.error("[v0] Customer tagging failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "客户标签生成失败",
      },
      { status: 500 },
    )
  }
}
