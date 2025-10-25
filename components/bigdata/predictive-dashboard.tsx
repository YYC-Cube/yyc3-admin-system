"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Package, DollarSign } from "lucide-react"
import { SalesForecastPanel } from "./sales-forecast-panel"
import { ChurnPredictionPanel } from "./churn-prediction-panel"
import { InventoryForecastPanel } from "./inventory-forecast-panel"
import { PriceElasticityPanel } from "./price-elasticity-panel"

export function PredictiveDashboard() {
  const [activeTab, setActiveTab] = useState("sales")

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预测准确率</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">过去30天平均</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高风险客户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">流失概率 &gt; 70%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">库存优化</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32%</div>
            <p className="text-xs text-muted-foreground">周转率提升</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">收益优化</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥45,230</div>
            <p className="text-xs text-muted-foreground">价格优化潜在收益</p>
          </CardContent>
        </Card>
      </div>

      {/* 预测分析面板 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">销售预测</TabsTrigger>
          <TabsTrigger value="churn">流失预测</TabsTrigger>
          <TabsTrigger value="inventory">库存预测</TabsTrigger>
          <TabsTrigger value="elasticity">价格弹性</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <SalesForecastPanel />
        </TabsContent>

        <TabsContent value="churn" className="space-y-4">
          <ChurnPredictionPanel />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryForecastPanel />
        </TabsContent>

        <TabsContent value="elasticity" className="space-y-4">
          <PriceElasticityPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
