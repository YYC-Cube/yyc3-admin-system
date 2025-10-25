"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, TrendingDown, AlertTriangle } from "lucide-react"
import { EnergyConsumptionChart } from "./energy-consumption-chart"
import { DeviceEnergyList } from "./device-energy-list"
import { OptimizationPanel } from "./optimization-panel"
import { EnergyAlertsPanel } from "./energy-alerts-panel"

export function SmartEnergyDashboard() {
  const [stats, setStats] = useState({
    totalEnergy: 1250.5,
    totalCost: 750.3,
    averagePower: 15200,
    trend: "decreasing" as const,
    trendPercent: -12.5,
    alerts: 3,
  })

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总能耗</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnergy.toFixed(1)} kWh</div>
            <p className="text-xs text-muted-foreground mt-1">本月累计</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">能源成本</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{stats.totalCost.toFixed(2)}</div>
            <p className="text-xs text-green-500 mt-1">
              {stats.trend === "decreasing" ? "↓" : "↑"} {Math.abs(stats.trendPercent)}% vs 上月
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">平均功率</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.averagePower / 1000).toFixed(1)} kW</div>
            <p className="text-xs text-muted-foreground mt-1">实时平均</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">能耗告警</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alerts}</div>
            <p className="text-xs text-orange-500 mt-1">待处理</p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">能耗概览</TabsTrigger>
          <TabsTrigger value="devices">设备能耗</TabsTrigger>
          <TabsTrigger value="optimization">节能优化</TabsTrigger>
          <TabsTrigger value="alerts">告警中心</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <EnergyConsumptionChart />
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <DeviceEnergyList />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <OptimizationPanel />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <EnergyAlertsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
