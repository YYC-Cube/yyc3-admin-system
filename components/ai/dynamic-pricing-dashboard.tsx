"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { dynamicPricingEngine, type OptimalPrice, type DemandForecast } from "@/lib/ai/dynamic-pricing"

export function DynamicPricingDashboard() {
  const [priceRecommendations, setPriceRecommendations] = useState<OptimalPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPriceRecommendations()
  }, [])

  async function loadPriceRecommendations() {
    try {
      const timeSlot = {
        startTime: "18:00",
        endTime: "22:00",
        dayOfWeek: new Date().getDay(),
      }

      const roomTypes: Array<"small" | "medium" | "large" | "vip"> = ["small", "medium", "large", "vip"]
      const recommendations: OptimalPrice[] = []

      for (const roomType of roomTypes) {
        // 预测需求
        const demand: DemandForecast = await dynamicPricingEngine.predictDemand(timeSlot, roomType, [])

        // 优化价格
        const optimalPrice = await dynamicPricingEngine.optimizePrice(
          demand,
          [], // 竞争对手价格
          {
            minPrice: 50,
            maxPrice: 500,
            minMargin: 0.3,
            maxDiscount: 0.3,
          },
        )

        recommendations.push(optimalPrice)
      }

      setPriceRecommendations(recommendations)
    } catch (error) {
      console.error("[v0] 加载价格推荐失败:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">加载中...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {priceRecommendations.map((rec) => (
        <Card key={rec.roomType}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{getRoomTypeName(rec.roomType)}</span>
              <Badge variant={rec.expectedOccupancy > 0.7 ? "default" : "secondary"}>
                {rec.expectedOccupancy > 0.7 ? "高需求" : "正常"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs">{rec.reasoning}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">推荐价格</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold">¥{rec.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">预期入住率</span>
                <div className="flex items-center gap-1">
                  {rec.expectedOccupancy > 0.7 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-orange-600" />
                  )}
                  <span className="font-medium">{(rec.expectedOccupancy * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">预期收益</span>
                <span className="font-medium">¥{rec.expectedRevenue.toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getRoomTypeName(type: string): string {
  const names: Record<string, string> = {
    small: "小包厢",
    medium: "中包厢",
    large: "大包厢",
    vip: "VIP包厢",
  }
  return names[type] || type
}
