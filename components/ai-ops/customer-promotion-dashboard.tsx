"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Target, TrendingUp, Award } from "lucide-react"
import { CustomerSegmentPanel } from "./customer-segment-panel"
import { CampaignGeneratorPanel } from "./campaign-generator-panel"
import { UpgradeTrackerPanel } from "./upgrade-tracker-panel"
import { PerformanceTrackerPanel } from "./performance-tracker-panel"

interface DashboardStats {
  totalCustomers: number
  activeSegments: number
  activeCampaigns: number
  upgradeRate: number
}

export function CustomerPromotionDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeSegments: 0,
    activeCampaigns: 0,
    upgradeRate: 0,
  })

  useEffect(() => {
    // 模拟数据加载
    setStats({
      totalCustomers: 1250,
      activeSegments: 6,
      activeCampaigns: 8,
      upgradeRate: 15.8,
    })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总客户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">活跃客户</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">客户细分</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSegments}</div>
            <p className="text-xs text-muted-foreground mt-1">活跃细分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">营销活动</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-muted-foreground mt-1">进行中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">提档率</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upgradeRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">本月提档率</p>
          </CardContent>
        </Card>
      </div>

      {/* 功能面板 */}
      <Tabs defaultValue="segment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="segment">客户分层</TabsTrigger>
          <TabsTrigger value="campaign">营销活动</TabsTrigger>
          <TabsTrigger value="upgrade">提档管理</TabsTrigger>
          <TabsTrigger value="performance">效果追踪</TabsTrigger>
        </TabsList>

        <TabsContent value="segment" className="space-y-4">
          <CustomerSegmentPanel />
        </TabsContent>

        <TabsContent value="campaign" className="space-y-4">
          <CampaignGeneratorPanel />
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-4">
          <UpgradeTrackerPanel />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceTrackerPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
