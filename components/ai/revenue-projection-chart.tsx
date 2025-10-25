"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { dynamicPricingEngine, type RevenueProjection } from "@/lib/ai/dynamic-pricing"

export function RevenueProjectionChart() {
  const [projections, setProjections] = useState<RevenueProjection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjections()
  }, [])

  async function loadProjections() {
    try {
      const roomTypes: Array<"small" | "medium" | "large" | "vip"> = ["small", "medium", "large", "vip"]
      const allProjections: RevenueProjection[] = []

      for (const roomType of roomTypes) {
        const projection = await dynamicPricingEngine.maximizeRevenue(
          {
            name: "标准策略",
            description: "基于历史数据的标准定价策略",
            rules: [],
          },
          {
            roomType,
            totalRooms: 10,
            availableRooms: 8,
          },
        )
        allProjections.push(projection)
      }

      setProjections(allProjections)
    } catch (error) {
      console.error("[v0] 加载收益预测失败:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">加载中...</div>
  }

  const chartData = projections.map((p) => ({
    name: getRoomTypeName(p.roomType),
    revenue: p.projectedRevenue,
    occupancy: p.projectedOccupancy * 100,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>收益预测分析</CardTitle>
        <CardDescription>基于AI模型的未来收益预测</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" name="预测收益(元)" />
            <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#10b981" name="入住率(%)" />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">总预测收益</div>
            <div className="text-2xl font-bold">
              ¥{projections.reduce((sum, p) => sum + p.projectedRevenue, 0).toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">平均入住率</div>
            <div className="text-2xl font-bold">
              {((projections.reduce((sum, p) => sum + p.projectedOccupancy, 0) / projections.length) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
