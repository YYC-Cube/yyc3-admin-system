"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Zap } from "lucide-react"

interface EnergyData {
  time: string
  consumption: number
  cost: number
}

interface EnergyConsumptionChartProps {
  data: EnergyData[]
}

export function EnergyConsumptionChart({ data }: EnergyConsumptionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          能耗趋势
        </CardTitle>
        <CardDescription>实时能源消耗监控</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="consumption" stroke="hsl(var(--primary))" name="能耗(kWh)" />
            <Line yAxisId="right" type="monotone" dataKey="cost" stroke="hsl(var(--chart-2))" name="成本(¥)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
