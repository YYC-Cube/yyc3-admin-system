import { NextResponse } from "next/server"
import { predictiveAnalytics, type PriceData, type SalesData } from "@/lib/bigdata/predictive-analytics"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { priceHistory, salesHistory } = await request.json()

    // 转换日期字符串为Date对象
    const prices: PriceData[] = priceHistory.map((p: any) => ({
      ...p,
      date: new Date(p.date),
    }))

    const sales: SalesData[] = salesHistory.map((s: any) => ({
      ...s,
      date: new Date(s.date),
    }))

    const analyses = await predictiveAnalytics.analyzePriceElasticity(prices, sales)

    return NextResponse.json({
      success: true,
      analyses,
    })
  } catch (error) {
    console.error("[API] 价格弹性分析失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: "价格弹性分析失败",
      },
      { status: 500 },
    )
  }
}
