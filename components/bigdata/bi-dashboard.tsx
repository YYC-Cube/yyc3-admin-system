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
            <TrendAnalysisPanel />
          </TabsContent>

          <TabsContent value="comparison" className="p-6">
            <ComparisonAnalysisPanel />
          </TabsContent>

          <TabsContent value="attribution" className="p-6">
            <AttributionAnalysisPanel />
          </TabsContent>

          <TabsContent value="olap" className="p-6">
            <OLAPAnalysisPanel />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
