import { NextResponse } from "next/server"
import { predictiveAnalytics, type SalesData } from "@/lib/bigdata/predictive-analytics"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { historicalData, externalFactors } = await request.json()

    // 转换日期字符串为Date对象
    const salesData: SalesData[] = historicalData.map((d: any) => ({
      ...d,
      date: new Date(d.date),
    }))

    const forecasts = await predictiveAnalytics.forecastSales(salesData, externalFactors || [])

    return NextResponse.json({
      success: true,
      forecasts,
    })
  } catch (error) {
    console.error("[API] 销售预测失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: "销售预测失败",
      },
      { status: 500 },
    )
  }
}
