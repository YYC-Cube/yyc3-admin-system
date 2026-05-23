import { type NextRequest, NextResponse } from "next/server"
import { profitIntelligenceEngine } from "@/lib/ai-ops/profit-intelligence-engine"

export async function POST(request: NextRequest) {
  try {
    const { storeId, startDate, endDate } = await request.json()

    if (!storeId || !startDate || !endDate) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 })
    }

    const revenue = await profitIntelligenceEngine.analyzeRevenue(storeId, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return NextResponse.json(revenue)
  } catch (error) {
    console.error("[v0] 收入分析失败:", error)
    return NextResponse.json({ error: "收入分析失败" }, { status: 500 })
  }
}

export const runtime = "nodejs"
