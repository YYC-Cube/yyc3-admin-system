import { NextResponse } from "next/server"
import { customerIntelligencePromotion } from "@/lib/ai-ops/customer-intelligence-promotion"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")

    if (!campaignId) {
      return NextResponse.json(
        {
          success: false,
          error: "活动ID不能为空",
        },
        { status: 400 },
      )
    }

    // 追踪营销效果
    const performance = await customerIntelligencePromotion.trackCampaignPerformance(campaignId)

    return NextResponse.json({
      success: true,
      data: performance,
    })
  } catch (error) {
    console.error("[v0] Campaign performance tracking failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "营销效果追踪失败",
      },
      { status: 500 },
    )
  }
}
