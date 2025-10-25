"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Activity, Zap, TrendingUp } from "lucide-react"
import { DataCollectionPanel } from "./data-collection-panel"
import { QueryBuilderPanel } from "./query-builder-panel"

export function DataWarehouseDashboard() {
  const [stats, setStats] = useState({
    dataSources: 0,
    schemas: 0,
    models: 0,
    bufferedRecords: 0,
    cachedQueries: 0,
    queryLatency: 0,
    dataFreshness: 0,
    qps: 0,
  })

  useEffect(() => {
    // 模拟统计数据
    setStats({
      dataSources: 5,
      schemas: 8,
      models: 3,
      bufferedRecords: 1250,
      cachedQueries: 45,
      queryLatency: 850,
      dataFreshness: 8,
      qps: 1200,
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">查询延迟</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.queryLatency}ms</div>
            <p className="text-xs text-muted-foreground mt-1">目标 &lt;1秒</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">数据新鲜度</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dataFreshness}秒</div>
            <p className="text-xs text-muted-foreground mt-1">目标 &lt;10秒</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">并发查询</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qps} QPS</div>
            <p className="text-xs text-muted-foreground mt-1">目标 1000+ QPS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">数据模型</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.models}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.schemas} 个模式</p>
          </CardContent>
        </Card>
      </div>

      {/* 数据采集面板 */}
      <DataCollectionPanel />

      {/* 查询构建器面板 */}
      <QueryBuilderPanel />
    </div>
  )
}
