import { NextResponse } from "next/server"
import { predictiveAnalytics, type CustomerData } from "@/lib/bigdata/predictive-analytics"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { customerData } = await request.json()

    // 转换日期字符串为Date对象
    const customers: CustomerData[] = customerData.map((c: any) => ({
      ...c,
      lastPurchaseDate: new Date(c.lastPurchaseDate),
    }))

    const predictions = await predictiveAnalytics.predictChurn(customers)

    return NextResponse.json({
      success: true,
      predictions,
    })
  } catch (error) {
    console.error("[API] 客户流失预测失败:", error)
    return NextResponse.json(
      {
        success: false,
        error: "客户流失预测失败",
      },
      { status: 500 },
    )
  }
}
