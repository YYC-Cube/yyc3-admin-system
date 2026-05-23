'use client'

import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DynamicPricingDashboard } from '@/components/ai/dynamic-pricing-dashboard'
import { PriceOptimizationPanel } from '@/components/ai/price-optimization-panel'
import { RevenueProjectionChart } from '@/components/ai/revenue-projection-chart'

export default function AIPricingPage() {
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
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">基础价格</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="100"
                    />
                    <p className="text-xs text-muted-foreground">设置商品基础价格(元)</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">最低折扣</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.7"
                    />
                    <p className="text-xs text-muted-foreground">最低折扣系数(0-1)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">动态定价规则</label>
                  <div className="space-y-2">
                    {[
                      { time: '高峰时段(18:00-23:00)', adjustment: '+20%', status: '启用' },
                      { time: '低峰时段(10:00-18:00)', adjustment: '-10%', status: '启用' },
                      { time: '会员专享', adjustment: '-15%', status: '启用' },
                    ].map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{rule.time}</p>
                          <p className="text-xs text-muted-foreground">
                            价格调整: {rule.adjustment}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${rule.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                        >
                          {rule.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
