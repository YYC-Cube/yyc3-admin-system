import { Suspense } from "react"
import { TrafficPredictionDashboard } from "@/components/ai/traffic-prediction-dashboard"
import { TrafficForecastChart } from "@/components/ai/traffic-forecast-chart"
import { AnomalyAlertPanel } from "@/components/ai/anomaly-alert-panel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 服务端组件 - 获取预测数据
async function getTrafficPredictions() {
  // 模拟获取历史数据
  const historicalTraffic = Array.from({ length: 168 }, (_, i) => ({
    date: new Date(Date.now() - (168 - i) * 3600000),
    hour: i % 24,
    count: Math.floor(Math.random() * 100) + 50,
  }))

  const externalFactors = {
    weather: "sunny" as const,
    temperature: 25,
    isHoliday: false,
    hasEvent: false,
  }

  return { historicalTraffic, externalFactors }
}

export default async function TrafficPredictionPage() {
  const { historicalTraffic, externalFactors } = await getTrafficPredictions()

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold">智能客流预测</h1>
        <p className="text-muted-foreground mt-2">基于AI的客流量预测和异常检测系统</p>
      </div>

      {/* 预测仪表盘 */}
      <Suspense fallback={<div>加载中...</div>}>
        <TrafficPredictionDashboard historicalTraffic={historicalTraffic} externalFactors={externalFactors} />
      </Suspense>

      {/* 详细预测和分析 */}
      <Tabs defaultValue="short-term" className="space-y-4">
        <TabsList>
          <TabsTrigger value="short-term">短期预测 (7天)</TabsTrigger>
          <TabsTrigger value="long-term">长期预测 (3个月)</TabsTrigger>
          <TabsTrigger value="anomaly">异常检测</TabsTrigger>
        </TabsList>

        <TabsContent value="short-term" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>未来7天客流预测</CardTitle>
              <CardDescription>基于历史数据和外部因素的短期客流预测</CardDescription>
            </CardHeader>
            <CardContent>
              <TrafficForecastChart type="short-term" historicalTraffic={historicalTraffic} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="long-term" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>未来3个月客流预测</CardTitle>
              <CardDescription>基于季节性模式和趋势分析的长期预测</CardDescription>
            </CardHeader>
            <CardContent>
              <TrafficForecastChart type="long-term" historicalTraffic={historicalTraffic} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-4">
          <AnomalyAlertPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
