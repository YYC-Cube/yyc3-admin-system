import { NextResponse } from "next/server"
import { predictiveAnalytics, type DemandData } from "@/lib/bigdata/predictive-analytics"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { historicalDemand, seasonality } = await request.json()

    // 转换日期字符串为Date对象
    const demandData: DemandData[] = historicalDemand.map((d: any) => ({
      ...d,
      date: new Date(d.date),
    }))

    const forecasts = await predictiveAnalytics.forecastInventory(demandData, seasonality)

    return NextResponse.json({
      success: true,
      forecasts,
    })
  } catch (error) {
    console.error("[API] 库存需求预测失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: "库存需求预测失败",
      },
      { status: 500 },
    )
  }
}
