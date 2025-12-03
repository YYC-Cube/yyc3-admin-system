"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendAnalysisPanel } from "./trend-analysis-panel"
import { ComparisonAnalysisPanel } from "./comparison-analysis-panel"
import { AttributionAnalysisPanel } from "./attribution-analysis-panel"
import { OLAPAnalysisPanel } from "./olap-analysis-panel"
import { BarChart3, TrendingUp, GitCompare, Target } from "lucide-react"

export function BIDashboard() {
  const [activeTab, setActiveTab] = useState("trend")

  return (
    <div className="space-y-6">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">决策效率</p>
              <p className="text-2xl font-bold">+60%</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">商业洞察</p>
              <p className="text-2xl font-bold">10倍提升</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">分析模型</p>
              <p className="text-2xl font-bold">4种</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">数据驱动</p>
              <p className="text-2xl font-bold">已建立</p>
            </div>
            <GitCompare className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* 分析面板 */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trend">趋势分析</TabsTrigger>
            <TabsTrigger value="comparison">对比分析</TabsTrigger>
            <TabsTrigger value="attribution">归因分析</TabsTrigger>
            <TabsTrigger value="olap">OLAP分析</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="p-6">
        <TrendAnalysisPanel 
          data={[
            { date: '2024-01', value: 100 },
            { date: '2024-02', value: 150 },
            { date: '2024-03', value: 200 },
            { date: '2024-04', value: 180 },
            { date: '2024-05', value: 250 },
          ]}
          metric="销售额"
        />
      </TabsContent>

          <TabsContent value="comparison" className="p-6">
            <ComparisonAnalysisPanel 
              data={[
                { name: 'Q1', group1: 100, group2: 150 },
                { name: 'Q2', group1: 120, group2: 130 },
                { name: 'Q3', group1: 150, group2: 180 },
                { name: 'Q4', group1: 200, group2: 220 },
              ]}
              group1Name="去年同期"
              group2Name="今年同期"
            />
          </TabsContent>

          <TabsContent value="attribution" className="p-6">
            <AttributionAnalysisPanel 
              factors={[
                { name: '市场推广', contribution: 45, impact: '显著提升用户访问量' },
                { name: '产品迭代', contribution: 30, impact: '提高用户留存率' },
                { name: '价格策略', contribution: 15, impact: '增加转化率' },
                { name: '竞品动态', contribution: 10, impact: '影响市场份额' },
              ]}
              outcome="销售额增长"
            />
          </TabsContent>

          <TabsContent value="olap" className="p-6">
            <OLAPAnalysisPanel />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
