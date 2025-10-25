import { type NextRequest, NextResponse } from "next/server"
import { profitIntelligenceEngine } from "@/lib/ai-ops/profit-intelligence-engine"

export async function POST(request: NextRequest) {
  try {
    const { storeIds, startDate, endDate } = await request.json()

    if (!storeIds || !Array.isArray(storeIds) || storeIds.length === 0) {
      return NextResponse.json({ error: "缺少门店ID列表" }, { status: 400 })
    }

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "缺少时间范围" }, { status: 400 })
    }

    const comparison = await profitIntelligenceEngine.compareStores(storeIds, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return NextResponse.json(comparison)
  } catch (error) {
    console.error("[v0] 门店对比失败:", error)
    return NextResponse.json({ error: "门店对比失败" }, { status: 500 })
  }
}

export const runtime = "nodejs"
