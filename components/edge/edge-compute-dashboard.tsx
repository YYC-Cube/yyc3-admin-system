"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, BarChart3Icon, ActivityIcon, ZapIcon } from "lucide-react"
import { ImageProcessPanel } from "./image-process-panel"
import { DataAggregatePanel } from "./data-aggregate-panel"
import { RealtimeAnalysisPanel } from "./realtime-analysis-panel"

export function EdgeComputeDashboard() {
  const [metrics] = useState({
    totalRequests: 15234,
    avgLatency: 42,
    dataReduction: 58,
    costSavings: 1250,
  })

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总请求数</CardTitle>
            <ZapIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">边缘计算处理</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均延迟</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgLatency}ms</div>
            <p className="text-xs text-green-600">↓ 70% vs 传统方式</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">数据传输减少</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dataReduction}%</div>
            <p className="text-xs text-muted-foreground">节省带宽成本</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">成本节省</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{metrics.costSavings}</div>
            <p className="text-xs text-muted-foreground">本月累计</p>
          </CardContent>
        </Card>
      </div>

      {/* 功能面板 */}
      <Tabs defaultValue="image" className="space-y-4">
        <TabsList>
          <TabsTrigger value="image">图片处理</TabsTrigger>
          <TabsTrigger value="aggregate">数据聚合</TabsTrigger>
          <TabsTrigger value="analysis">实时分析</TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-4">
          <ImageProcessPanel />
        </TabsContent>

        <TabsContent value="aggregate" className="space-y-4">
          <DataAggregatePanel />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <RealtimeAnalysisPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
