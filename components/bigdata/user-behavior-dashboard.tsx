"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Target, Repeat } from "lucide-react"
import { UserProfilePanel } from "@/components/bigdata/user-profile-panel"
import { PathAnalysisPanel } from "@/components/bigdata/path-analysis-panel"
import { FunnelAnalysisPanel } from "@/components/bigdata/funnel-analysis-panel"
import { RetentionAnalysisPanel } from "@/components/bigdata/retention-analysis-panel"

export function UserBehaviorDashboard() {
  const [activeTab, setActiveTab] = useState("profile")

  // 模拟关键指标
  const metrics = {
    totalUsers: 125680,
    activeUsers: 45230,
    avgSessionDuration: 342,
    conversionRate: 12.5,
  }

  // 模拟用户画像数据
  const mockProfile = {
    name: "张三",
    segment: "高价值用户",
    tags: ["VIP客户", "高频访问", "高消费"],
    value: 25800,
    lastVisit: "2024-11-03",
  }

  // 模拟路径分析数据
  const mockPathSteps = [
    { page: "首页", users: 10000, dropRate: 0 },
    { page: "产品列表", users: 7500, dropRate: 25 },
    { page: "产品详情", users: 5000, dropRate: 33.3 },
    { page: "购物车", users: 3000, dropRate: 40 },
    { page: "结算", users: 1500, dropRate: 50 },
    { page: "支付成功", users: 1250, dropRate: 16.7 },
  ]

  // 模拟漏斗分析数据
  const mockFunnelSteps = [
    { name: "访问首页", users: 10000, conversionRate: 100 },
    { name: "浏览商品", users: 7500, conversionRate: 75 },
    { name: "加入购物车", users: 3000, conversionRate: 30 },
    { name: "提交订单", users: 1500, conversionRate: 15 },
    { name: "完成支付", users: 1250, conversionRate: 12.5 },
  ]

  // 模拟留存数据
  const mockRetentionData = [
    { day: "Day 1", rate: 100 },
    { day: "Day 3", rate: 75 },
    { day: "Day 7", rate: 55 },
    { day: "Day 14", rate: 42 },
    { day: "Day 30", rate: 35 },
  ]

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% 较上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.3% 较上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均会话时长</CardTitle>
            <Repeat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(metrics.avgSessionDuration / 60)}分钟</div>
            <p className="text-xs text-muted-foreground">+15.2% 较上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">转化率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% 较上月</p>
          </CardContent>
        </Card>
      </div>

      {/* 分析面板 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">用户画像</TabsTrigger>
          <TabsTrigger value="path">路径分析</TabsTrigger>
          <TabsTrigger value="funnel">漏斗分析</TabsTrigger>
          <TabsTrigger value="retention">留存分析</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <UserProfilePanel profile={mockProfile} />
        </TabsContent>

        <TabsContent value="path" className="space-y-4">
          <PathAnalysisPanel steps={mockPathSteps} />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <FunnelAnalysisPanel steps={mockFunnelSteps} />
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <RetentionAnalysisPanel data={mockRetentionData} cohortName="2024年10月" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
