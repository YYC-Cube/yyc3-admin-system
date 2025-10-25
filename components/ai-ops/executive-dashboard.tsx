"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Briefcase,
  ArrowUpRight,
  Lightbulb,
  Shield,
} from "lucide-react"

export default function ExecutiveDashboard() {
  const [strategicView, setStrategicView] = useState<any>(null)
  const [kpiReport, setKpiReport] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [risks, setRisks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const storeIds = ["store_001"]
      const timeRange = {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      }

      const [viewRes, kpiRes, recRes, riskRes] = await Promise.all([
        fetch("/api/ai-ops/executive/strategic-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeIds, timeRange }),
        }),
        fetch("/api/ai-ops/executive/kpis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeIds, timeRange }),
        }),
        fetch("/api/ai-ops/executive/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeIds, timeRange }),
        }),
        fetch("/api/ai-ops/executive/risks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ storeIds, timeRange }),
        }),
      ])

      const [viewData, kpiData, recData, riskData] = await Promise.all([
        viewRes.json(),
        kpiRes.json(),
        recRes.json(),
        riskRes.json(),
      ])

      setStrategicView(viewData.data)
      setKpiReport(kpiData.data)
      setRecommendations(recData.data || [])
      setRisks(riskData.data || [])
    } catch (error) {
      console.error("加载仪表板数据失败:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !strategicView) {
    return <div>加载中...</div>
  }

  const { overview, financialMetrics, operationalMetrics, customerMetrics, employeeMetrics } = strategicView

  return (
    <div className="space-y-6">
      {/* 经营健康度概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">经营健康度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overview.healthScore}</div>
            <div className="flex items-center gap-2 mt-2">
              {overview.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : overview.trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : (
                <Activity className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm text-muted-foreground">
                {overview.trend === "up" ? "上升趋势" : overview.trend === "down" ? "下降趋势" : "保持稳定"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">风险告警</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{overview.alerts}</div>
            <p className="text-sm text-muted-foreground mt-2">需要立即关注</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">增长机会</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{overview.opportunities}</div>
            <p className="text-sm text-muted-foreground mt-2">可把握的机会</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">营业收入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{(financialMetrics.revenue / 10000).toFixed(1)}万</div>
            <div className="flex items-center gap-2 mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+{financialMetrics.growth.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细指标 */}
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">
            <DollarSign className="h-4 w-4 mr-2" />
            财务指标
          </TabsTrigger>
          <TabsTrigger value="operational">
            <Activity className="h-4 w-4 mr-2" />
            运营指标
          </TabsTrigger>
          <TabsTrigger value="customer">
            <Users className="h-4 w-4 mr-2" />
            客户指标
          </TabsTrigger>
          <TabsTrigger value="employee">
            <Briefcase className="h-4 w-4 mr-2" />
            员工指标
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Lightbulb className="h-4 w-4 mr-2" />
            智能建议
          </TabsTrigger>
          <TabsTrigger value="risks">
            <Shield className="h-4 w-4 mr-2" />
            风险预警
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>营业收入</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{(financialMetrics.revenue / 10000).toFixed(1)}万</div>
                <p className="text-sm text-muted-foreground mt-2">同比增长 {financialMetrics.growth.toFixed(1)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>净利润</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{(financialMetrics.profit / 10000).toFixed(1)}万</div>
                <p className="text-sm text-muted-foreground mt-2">利润率 {financialMetrics.margin.toFixed(1)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>利润率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{financialMetrics.margin.toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground mt-2">健康水平</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>运营效率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMetrics.efficiency}%</div>
                <p className="text-sm text-muted-foreground mt-2">良好水平</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>服务质量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMetrics.quality}%</div>
                <p className="text-sm text-muted-foreground mt-2">优秀水平</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>客户满意度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{operationalMetrics.satisfaction}%</div>
                <p className="text-sm text-muted-foreground mt-2">持续提升</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>新增客户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerMetrics.acquisition}</div>
                <p className="text-sm text-muted-foreground mt-2">本月新增</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>客户留存率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{customerMetrics.retention}%</div>
                <p className="text-sm text-muted-foreground mt-2">良好水平</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>客户生命周期价值</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{customerMetrics.lifetimeValue}</div>
                <p className="text-sm text-muted-foreground mt-2">平均价值</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employee" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>员工总数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employeeMetrics.headcount}</div>
                <p className="text-sm text-muted-foreground mt-2">在职员工</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>员工满意度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employeeMetrics.satisfaction}%</div>
                <p className="text-sm text-muted-foreground mt-2">良好水平</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>员工流失率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employeeMetrics.attrition}%</div>
                <p className="text-sm text-muted-foreground mt-2">正常范围</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <Badge
                      variant={
                        rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "default" : "secondary"
                      }
                    >
                      {rec.priority === "high" ? "高优先级" : rec.priority === "medium" ? "中优先级" : "低优先级"}
                    </Badge>
                  </div>
                  <CardDescription>{rec.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{rec.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">预期收益</p>
                      <p className="text-lg font-semibold text-green-500">
                        +¥{(rec.expectedImpact.revenue / 10000).toFixed(1)}万
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">预期成本</p>
                      <p className="text-lg font-semibold">
                        ¥{(Math.abs(rec.expectedImpact.cost) / 10000).toFixed(1)}万
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">预期ROI</p>
                      <p className="text-lg font-semibold text-blue-500">{rec.expectedImpact.roi}%</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">所需资源:</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.resources.map((resource: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">执行周期: {rec.timeline}</span>
                    <Button size="sm">查看详情</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="space-y-4">
            {risks.map((risk) => (
              <Card key={risk.id} className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{risk.title}</CardTitle>
                    <Badge
                      variant={
                        risk.severity === "critical"
                          ? "destructive"
                          : risk.severity === "high"
                            ? "destructive"
                            : risk.severity === "medium"
                              ? "default"
                              : "secondary"
                      }
                    >
                      {risk.severity === "critical"
                        ? "严重"
                        : risk.severity === "high"
                          ? "高风险"
                          : risk.severity === "medium"
                            ? "中风险"
                            : "低风险"}
                    </Badge>
                  </div>
                  <CardDescription>{risk.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{risk.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">发生概率</p>
                      <p className="text-lg font-semibold">{(risk.probability * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">影响程度</p>
                      <p className="text-lg font-semibold">{(risk.impact * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">风险分数</p>
                      <p className="text-lg font-semibold text-red-500">{(risk.riskScore * 100).toFixed(0)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">缓解措施:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {risk.mitigation.map((measure: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      负责人: {risk.owner} | 截止日期: {new Date(risk.deadline).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline">
                      制定方案
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
