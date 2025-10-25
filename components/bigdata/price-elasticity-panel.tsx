"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DollarSign } from "lucide-react"

interface ElasticityData {
  price: number
  demand: number
}

interface PriceElasticityPanelProps {
  data: ElasticityData[]
  elasticity: number
}

export function PriceElasticityPanel({ data, elasticity }: PriceElasticityPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          价格弹性分析
        </CardTitle>
        <CardDescription>价格与需求关系分析</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">价格弹性系数</p>
          <p className="text-2xl font-bold">{elasticity.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {Math.abs(elasticity) > 1 ? "需求富有弹性" : "需求缺乏弹性"}
          </p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="price" name="价格" />
            <YAxis dataKey="demand" name="需求量" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="hsl(var(--primary))" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
