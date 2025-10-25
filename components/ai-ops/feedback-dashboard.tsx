"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, TrendingUp, AlertCircle, ThumbsUp } from "lucide-react"

export function FeedbackDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // 模拟数据
  const stats = {
    totalFeedback: 1248,
    avgSatisfaction: 78.5,
    responseRate: 92.3,
    resolutionRate: 87.6,
  }

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">反馈总数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">本月收集反馈</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均满意度</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSatisfaction}分</div>
            <p className="text-xs text-green-600">+3.2% 较上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">响应率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">24小时内响应</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">解决率</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
            <p className="text-xs text-green-600">+5.1% 较上月</p>
          </CardContent>
        </Card>
      </div>

      {/* 功能标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="customer">客户反馈</TabsTrigger>
          <TabsTrigger value="internal">内部反馈</TabsTrigger>
          <TabsTrigger value="insights">数据洞察</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>反馈概览</CardTitle>
              <CardDescription>查看所有反馈的汇总信息</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">反馈概览功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>客户反馈</CardTitle>
              <CardDescription>管理客户反馈，自动分类和情绪识别</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">客户反馈功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>内部反馈</CardTitle>
              <CardDescription>收集和管理员工反馈，支持匿名反馈</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">内部反馈功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据洞察</CardTitle>
              <CardDescription>反馈趋势分析和改进建议</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">数据洞察功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
