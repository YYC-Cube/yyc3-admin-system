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

  // 生成模拟数据的辅助函数
  const getMockDataByType = (type: string) => {
    switch (type) {
      case 'strategic-view':
        return {
          overview: {
            healthScore: 85,
            trend: 'up',
            alerts: 2,
            opportunities: 5
          },
          financialMetrics: {
            revenue: 25600000,
            profit: 5200000,
            margin: 20.3,
            growth: 5.2
          },
          operationalMetrics: {
            efficiency: 82,
            quality: 90,
            satisfaction: 88
          },
          customerMetrics: {
            acquisition: 352,
            retention: 78,
            lifetimeValue: 12500
          },
          employeeMetrics: {
            headcount: 87,
            satisfaction: 83,
            attrition: 4.5
          }
        };
      case 'recommendations':
        return [
          {
            id: 'rec_001',
            title: '优化供应链管理',
            category: '运营优化',
            priority: 'high',
            description: '通过重新评估供应商网络，预计可降低成本并提高交付效率',
            expectedImpact: {
              revenue: 0,
              cost: -800000,
              roi: 156
            },
            resources: ['采购团队', 'IT支持', '管理层审批'],
            timeline: '1-3个月'
          },
          {
            id: 'rec_002',
            title: '拓展高价值客户服务',
            category: '客户增长',
            priority: 'medium',
            description: '为VIP客户提供定制化服务套餐，提高客户留存和消费',
            expectedImpact: {
              revenue: 1200000,
              cost: 350000,
              roi: 243
            },
            resources: ['客户服务', '产品', '营销'],
            timeline: '2-4个月'
          }
        ];
      case 'risks':
        return [
          {
            id: 'risk_001',
            title: '供应链中断风险',
            category: '运营风险',
            severity: 'high',
            description: '主要供应商面临生产问题，可能导致原材料短缺',
            probability: 0.6,
            impact: 0.8,
            riskScore: 0.48,
            mitigation: [
              '开发备用供应商',
              '增加关键材料库存',
              '制定应急采购计划'
            ],
            owner: '供应链总监',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      default:
        return null;
    }
  };

  // 通用数据获取函数，包含错误处理
  const fetchData = async (endpoint: string, storeIds: string[], timeRange: any) => {
    try {
      const response = await fetch(`/api/ai-ops/executive/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeIds, timeRange }),
      });

      // 检查响应状态
      if (!response.ok) {
        // 针对403错误提供更明确的错误信息和增强的用户体验
        if (response.status === 403) {
          console.error(`🚫 【权限警告】加载${endpoint}数据失败: 访问权限不足(403)，系统将使用演示数据。建议联系管理员申请适当权限。`);
          // 返回模拟数据作为后备，并添加更详细的错误信息标记
          return {
            ...getMockDataByType(endpoint),
            _isDemoData: true,
            _errorType: 'permission',
            _errorMessage: `访问${endpoint}数据的权限不足，请联系系统管理员申请访问权限。`,
            _endpoint: endpoint
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || getMockDataByType(endpoint);
    } catch (error) {
      console.error(`加载${endpoint}数据失败:`, error);
      // 返回模拟数据作为后备，并添加完整的错误标记
      return {
        ...getMockDataByType(endpoint),
        _isDemoData: true,
        _errorType: 'unknown',
        _errorMessage: `加载${endpoint}数据时发生未知错误`,
        _endpoint: endpoint
      };
    }
  };

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const storeIds = ["store_001"]
      const timeRange = {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      }

      // 并行获取所有数据，每个请求都有独立的错误处理
      const [strategicViewData, kpiData, recommendationsData, risksData] = await Promise.all([
        fetchData("strategic-view", storeIds, timeRange),
        fetchData("kpis", storeIds, timeRange),
        fetchData("recommendations", storeIds, timeRange),
        fetchData("risks", storeIds, timeRange)
      ]);

      setStrategicView(strategicViewData);
      setKpiReport(kpiData);
      // 确保recommendations始终是数组类型
      setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : []);
      // 确保risks始终是数组类型
      setRisks(Array.isArray(risksData) ? risksData : []);
    } catch (error) {
      console.error("仪表板数据加载失败:", error);
      // 确保即使在顶层错误情况下也有基本数据显示
      if (!strategicView) {
        setStrategicView(getMockDataByType('strategic-view'));
      }
      if (!kpiReport) {
        setKpiReport(getMockDataByType('kpis'));
      }
      if (recommendations.length === 0) {
        const mockRecommendations = getMockDataByType('recommendations');
        setRecommendations(Array.isArray(mockRecommendations) ? mockRecommendations : []);
      }
      if (risks.length === 0) {
        const mockRisks = getMockDataByType('risks');
        setRisks(Array.isArray(mockRisks) ? mockRisks : []);
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-800">战略决策支持系统加载中</h2>
          <p className="text-gray-500 max-w-md mx-auto">正在获取最新的业务数据，请稍候...</p>
        </div>
      </div>
    );
  }

  // 检查是否使用了演示数据（权限问题）
  const isUsingDemoData = strategicView?._isDemoData || false;
  
  // 收集所有权限错误信息
  const permissionErrors = [];
  if (strategicView?._errorType === 'permission' && strategicView?._errorMessage) {
    permissionErrors.push(strategicView._errorMessage);
  }
  if (kpiReport?._errorType === 'permission' && kpiReport?._errorMessage) {
    permissionErrors.push(kpiReport._errorMessage);
  }
  // 移除有问题的错误检查
  
  // 确保即使在数据部分失败的情况下也能显示基础UI
  if (!strategicView) {
    // 直接使用模拟数据初始化strategicView
    const mockStrategicView = getMockDataByType('strategic-view');
    setStrategicView(mockStrategicView);
    // 确保返回数组类型
    const mockRecommendations = getMockDataByType('recommendations');
    setRecommendations(Array.isArray(mockRecommendations) ? mockRecommendations : []);
    const mockRisks = getMockDataByType('risks');
    setRisks(Array.isArray(mockRisks) ? mockRisks : []);
    
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 font-medium">
                  系统正在使用演示数据
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  提示：演示数据仅供参考，不反映实际业务状况。
                </p>
                {permissionErrors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-red-600 font-medium">权限问题详情：</p>
                    <ul className="list-disc list-inside text-xs text-red-500 mt-1">
                      {permissionErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center py-20">
            <Button onClick={loadDashboardData} className="mt-4">
              重新加载数据
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { overview, financialMetrics, operationalMetrics, customerMetrics, employeeMetrics } = strategicView

  return (
    <div className="space-y-6">
      {/* 权限问题提示 */}
      {isUsingDemoData && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700">
                🔒 当前显示的是演示数据。您可能没有足够的权限访问实时数据或数据服务暂时不可用。
              </p>
              <div className="mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                  onClick={loadDashboardData}
                >
                  尝试重新加载 <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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
