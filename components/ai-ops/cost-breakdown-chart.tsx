"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "lucide-react"

interface CostBreakdownChartProps {
  costs?: any
}

export function CostBreakdownChart({ costs }: CostBreakdownChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          成本结构
        </CardTitle>
        <CardDescription>固定成本与变动成本分析</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">{costs ? '成本数据加载中...' : '暂无成本数据'}</div>
      </CardContent>
    </Card>
  )
}
