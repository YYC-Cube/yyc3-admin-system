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
          <SalesForecastPanel 
            data={[
              { date: '2024-01-01', actual: 12000, forecast: 12500, upper: 14000, lower: 11000 },
              { date: '2024-01-02', actual: 13200, forecast: 13000, upper: 14500, lower: 11500 },
              { date: '2024-01-03', actual: 14100, forecast: 14200, upper: 15700, lower: 12700 },
              { date: '2024-01-04', actual: 13800, forecast: 14000, upper: 15500, lower: 12500 },
              { date: '2024-01-05', actual: 15200, forecast: 14800, upper: 16300, lower: 13300 },
              { date: '2024-01-06', forecast: 15500, upper: 17000, lower: 14000 },
              { date: '2024-01-07', forecast: 16000, upper: 17500, lower: 14500 }
            ]} 
          />
        </TabsContent>

        <TabsContent value="churn" className="space-y-4">
          <ChurnPredictionPanel 
            customers={[
              {
                id: '1',
                name: '张三',
                riskScore: 85,
                reason: '最近30天内未登录系统',
                recommendation: '发送个性化优惠券并进行电话回访'
              },
              {
                id: '2',
                name: '李四',
                riskScore: 72,
                reason: '购买频率显著下降',
                recommendation: '提供专属折扣并推送新产品信息'
              },
              {
                id: '3',
                name: '王五',
                riskScore: 90,
                reason: '已转向竞争对手',
                recommendation: '提供特别优惠方案争取回流'
              }
            ]} 
          />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <InventoryForecastPanel 
            forecasts={[
              {
                productName: "茅台飞天53度500ml",
                currentStock: 45,
                forecastDemand: 60,
                recommendedOrder: 30,
                status: "warning"
              },
              {
                productName: "五粮液52度500ml",
                currentStock: 15,
                forecastDemand: 40,
                recommendedOrder: 50,
                status: "critical"
              },
              {
                productName: "青岛啤酒330ml",
                currentStock: 120,
                forecastDemand: 90,
                recommendedOrder: 0,
                status: "sufficient"
              }
            ]} 
          />
        </TabsContent>

        <TabsContent value="elasticity" className="space-y-4">
          <PriceElasticityPanel 
            data={[
              { price: 100, demand: 1000 },
              { price: 120, demand: 800 },
              { price: 140, demand: 650 },
              { price: 160, demand: 500 },
              { price: 180, demand: 400 },
              { price: 200, demand: 300 }
            ]} 
            elasticity={-1.2} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
