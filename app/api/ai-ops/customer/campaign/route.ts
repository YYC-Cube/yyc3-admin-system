import { NextResponse } from "next/server"
import { customerIntelligencePromotion } from "@/lib/ai-ops/customer-intelligence-promotion"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { segment } = await request.json()

    if (!segment) {
      return NextResponse.json(
        {
          success: false,
          error: "客户细分不能为空",
        },
        { status: 400 },
      )
    }

    // 生成个性化营销活动
    const campaign = customerIntelligencePromotion.generatePersonalizedCampaign(segment)

    return NextResponse.json({
      success: true,
      data: campaign,
    })
  } catch (error) {
    console.error("[v0] Campaign generation failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "营销活动生成失败",
      },
      { status: 500 },
    )
  }
}
