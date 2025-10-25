"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingUp, Users, Award } from "lucide-react"

export function OpsTrackerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // 模拟数据
  const stats = {
    totalTasks: 156,
    completedTasks: 128,
    overdueTasks: 8,
    anomalies: 12,
    avgCompletionRate: 82,
    avgQualityScore: 87,
    totalBonus: 15600,
    totalPenalty: 2400,
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">任务完成率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks}/{stats.totalTasks} 已完成
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">质量评分</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgQualityScore}/100</div>
            <p className="text-xs text-muted-foreground">平均质量评分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">异常告警</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.anomalies}</div>
            <p className="text-xs text-muted-foreground">{stats.overdueTasks} 个逾期任务</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">奖惩总额</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ¥{(stats.totalBonus - stats.totalPenalty).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              奖励 ¥{stats.totalBonus.toLocaleString()} - 惩罚 ¥{stats.totalPenalty.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="tasks">任务跟踪</TabsTrigger>
          <TabsTrigger value="anomalies">异常监控</TabsTrigger>
          <TabsTrigger value="performance">绩效评估</TabsTrigger>
          <TabsTrigger value="incentive">奖惩管理</TabsTrigger>
          <TabsTrigger value="optimization">优化建议</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>系统概览</CardTitle>
              <CardDescription>运维执行跟踪与奖惩系统整体情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">任务执行效率</span>
                  <span className="text-sm text-muted-foreground">较上月 +12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">异常识别率</span>
                  <span className="text-sm text-muted-foreground">95.6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">员工积极性</span>
                  <span className="text-sm text-muted-foreground">较上月 +18%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">运营成本</span>
                  <span className="text-sm text-green-600">较上月 -15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>任务跟踪</CardTitle>
              <CardDescription>实时跟踪所有运营任务的执行情况</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">任务跟踪功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>异常监控</CardTitle>
              <CardDescription>智能识别和监控运营异常</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">异常监控功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>绩效评估</CardTitle>
              <CardDescription>员工和部门绩效评估与排名</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">绩效评估功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incentive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>奖惩管理</CardTitle>
              <CardDescription>自动计算和执行奖惩机制</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">奖惩管理功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>优化建议</CardTitle>
              <CardDescription>AI分析并提供运营优化建议</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">优化建议功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
