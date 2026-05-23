import { type NextRequest, NextResponse } from "next/server"
import { profitIntelligenceEngine } from "@/lib/ai-ops/profit-intelligence-engine"

export async function POST(request: NextRequest) {
  try {
    const { storeId, startDate, endDate } = await request.json()

    if (!storeId || !startDate || !endDate) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const costs = await profitIntelligenceEngine.calculateCosts(storeId, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return NextResponse.json(costs)
  } catch (error) {
    console.error("[v0] 成本计算失败:", error)
    return NextResponse.json({ error: "成本计算失败" }, { status: 500 })
  }
}

export const runtime = "nodejs"
