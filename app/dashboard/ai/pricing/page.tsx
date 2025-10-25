import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DynamicPricingDashboard } from "@/components/ai/dynamic-pricing-dashboard"
import { PriceOptimizationPanel } from "@/components/ai/price-optimization-panel"
import { RevenueProjectionChart } from "@/components/ai/revenue-projection-chart"

export default async function AIPricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI智能定价系统</h1>
        <p className="text-muted-foreground mt-2">基于供需关系和竞争分析的动态定价优化</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">定价仪表盘</TabsTrigger>
          <TabsTrigger value="optimization">价格优化</TabsTrigger>
          <TabsTrigger value="projection">收益预测</TabsTrigger>
          <TabsTrigger value="settings">策略设置</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <Suspense fallback={<div>加载中...</div>}>
            <DynamicPricingDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Suspense fallback={<div>加载中...</div>}>
            <PriceOptimizationPanel />
          </Suspense>
        </TabsContent>

        <TabsContent value="projection" className="space-y-6">
          <Suspense fallback={<div>加载中...</div>}>
            <RevenueProjectionChart />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>定价策略配置</CardTitle>
              <CardDescription>设置定价规则和约束条件</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">定价策略配置功能开发中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
