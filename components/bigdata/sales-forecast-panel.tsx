"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp } from "lucide-react"

interface ForecastData {
  date: string
  actual?: number
  forecast: number
  upper: number
  lower: number
}

interface SalesForecastPanelProps {
  data: ForecastData[]
}

export function SalesForecastPanel({ data }: SalesForecastPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          销售预测
        </CardTitle>
        <CardDescription>未来30天销售额预测</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" name="实际" />
            <Line type="monotone" dataKey="forecast" stroke="hsl(var(--chart-2))" name="预测" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="upper"
              stroke="hsl(var(--muted-foreground))"
              name="上限"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="lower"
              stroke="hsl(var(--muted-foreground))"
              name="下限"
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
