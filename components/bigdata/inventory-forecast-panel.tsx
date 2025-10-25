"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

interface InventoryForecast {
  productName: string
  currentStock: number
  forecastDemand: number
  recommendedOrder: number
  status: "sufficient" | "warning" | "critical"
}

interface InventoryForecastPanelProps {
  forecasts: InventoryForecast[]
}

export function InventoryForecastPanel({ forecasts }: InventoryForecastPanelProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sufficient":
        return <Badge variant="outline">充足</Badge>
      case "warning":
        return <Badge variant="default">预警</Badge>
      case "critical":
        return <Badge variant="destructive">紧急</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          库存需求预测
        </CardTitle>
        <CardDescription>未来7天库存需求预测</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {forecasts.map((forecast, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{forecast.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    当前库存: {forecast.currentStock} | 预测需求: {forecast.forecastDemand}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(forecast.status)}
                <div className="text-right">
                  <p className="text-sm font-medium">建议订货</p>
                  <p className="text-lg font-bold">{forecast.recommendedOrder}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
