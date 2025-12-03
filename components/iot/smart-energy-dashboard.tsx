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
  const [stats] = useState({
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
          <EnergyConsumptionChart 
            data={[
              { time: '00:00', consumption: 120, cost: 60 },
              { time: '04:00', consumption: 90, cost: 45 },
              { time: '08:00', consumption: 200, cost: 100 },
              { time: '12:00', consumption: 250, cost: 125 },
              { time: '16:00', consumption: 230, cost: 115 },
              { time: '20:00', consumption: 180, cost: 90 }
            ]} 
          />
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <DeviceEnergyList 
            devices={[
              { name: '中央空调', type: 'ac', consumption: 450, percentage: 45 },
              { name: '照明系统', type: 'lighting', consumption: 250, percentage: 25 },
              { name: '音响设备', type: 'audio', consumption: 150, percentage: 15 },
              { name: '监控系统', type: 'lighting', consumption: 100, percentage: 10 },
              { name: '其他设备', type: 'ac', consumption: 50, percentage: 5 }
            ]} 
          />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <OptimizationPanel 
            suggestions={[
              {
                title: '优化空调使用时间',
                description: '根据使用情况调整空调运行时间，预计每月可节省25%能耗',
                savings: 25,
                priority: 'high'
              },
              {
                title: '更换LED照明',
                description: '将传统照明更换为LED灯，预计每月可节省15%照明能耗',
                savings: 15,
                priority: 'medium'
              },
              {
                title: '设备待机管理',
                description: '设置非工作时间自动关闭闲置设备，预计每月可节省10%能耗',
                savings: 10,
                priority: 'low'
              }
            ]} 
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <EnergyAlertsPanel 
            alerts={[
              {
                id: 'alert-001',
                type: 'critical',
                title: '中央空调能耗异常',
                message: '3号楼3层中央空调能耗超出正常值50%，请立即检查',
                timestamp: '2024-10-15 14:30:00'
              },
              {
                id: 'alert-002',
                type: 'warning',
                title: '照明系统运行超时',
                message: '办公区域照明系统在非工作时间仍处于开启状态',
                timestamp: '2024-10-15 18:45:00'
              },
              {
                id: 'alert-003',
                type: 'info',
                title: '能耗数据更新',
                message: '本月能耗报告已生成，请查看详情',
                timestamp: '2024-10-15 08:00:00'
              }
            ]} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
