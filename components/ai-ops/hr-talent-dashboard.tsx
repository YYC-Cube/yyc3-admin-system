"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Award, AlertTriangle } from "lucide-react"

export function HRTalentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // 模拟数据
  const stats = {
    totalEmployees: 156,
    avgPerformance: 82.5,
    promotionReady: 12,
    attritionRisk: 8,
  }

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">员工总数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">较上月 +3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均绩效</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgPerformance}</div>
            <p className="text-xs text-muted-foreground">较上月 +2.3</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">晋升候选人</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.promotionReady}</div>
            <p className="text-xs text-muted-foreground">准备度 ≥80%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">离职风险</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.attritionRisk}</div>
            <p className="text-xs text-muted-foreground">需要关注</p>
          </CardContent>
        </Card>
      </div>

      {/* 功能标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="performance">绩效管理</TabsTrigger>
          <TabsTrigger value="talent">人才发展</TabsTrigger>
          <TabsTrigger value="risk">风险预警</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>人力资源概览</CardTitle>
              <CardDescription>员工画像、能力分布、绩效趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>• 员工总数: {stats.totalEmployees}人</p>
                <p>• 平均绩效: {stats.avgPerformance}分</p>
                <p>• 高绩效员工: 45人 (28.8%)</p>
                <p>• 需要改进: 12人 (7.7%)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>绩效管理</CardTitle>
              <CardDescription>KPI/OKR评分、360度评估、绩效排名</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>• 本月已完成评估: 142人</p>
                <p>• 待评估: 14人</p>
                <p>• 平均KPI完成率: 87.3%</p>
                <p>• 平均OKR达成率: 78.5%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="talent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>人才发展</CardTitle>
              <CardDescription>成长路径、培训计划、晋升建议</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>• 晋升候选人: {stats.promotionReady}人</p>
                <p>• 进行中的培训: 28项</p>
                <p>• 导师匹配: 34对</p>
                <p>• 职业规划完成率: 76%</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>风险预警</CardTitle>
              <CardDescription>离职预测、挽留策略、预警通知</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p className="text-destructive">• 高风险: {stats.attritionRisk}人</p>
                <p className="text-orange-500">• 中风险: 15人</p>
                <p>• 低风险: 133人</p>
                <p>• 已采取挽留措施: 6人</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
