"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, CheckCircle, FileText, TrendingUp, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function ComplianceDashboard() {
  const [securityScore, setSecurityScore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSecurityScore()
  }, [])

  const fetchSecurityScore = async () => {
    try {
      const response = await fetch("/api/ai-ops/compliance/security-score")
      const result = await response.json()
      if (result.success) {
        setSecurityScore(result.data)
      }
    } catch (error) {
      console.error("获取安全评分失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      const response = await fetch("/api/ai-ops/compliance/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString(),
          scope: "全系统",
        }),
      })
      const result = await response.json()
      if (result.success) {
        alert("审计报告生成成功")
      }
    } catch (error) {
      console.error("生成报告失败:", error)
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">安全评分</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityScore?.overall || 0}/100</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Badge variant={securityScore?.trend === "improving" ? "default" : "secondary"}>
                  {securityScore?.trend === "improving" ? "改善中" : "稳定"}
                </Badge>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">合规评分</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85/100</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Badge variant="default">A级</Badge>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">风险等级</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">中等</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Badge variant="secondary">45/100</Badge>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">审计日志</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,458</div>
              <p className="text-xs text-muted-foreground mt-1">本月记录数</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 详细信息 */}
      <Tabs defaultValue="security" className="space-y-4">
        <TabsList>
          <TabsTrigger value="security">安全评分</TabsTrigger>
          <TabsTrigger value="compliance">合规检查</TabsTrigger>
          <TabsTrigger value="audit">审计日志</TabsTrigger>
          <TabsTrigger value="risk">风险评估</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>安全评分详情</CardTitle>
              <CardDescription>各维度安全评分和改进建议</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityScore?.categories &&
                Object.entries(securityScore.categories).map(([key, value]: [string, any]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <span className="text-sm text-muted-foreground">{value}/100</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}

              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-medium">改进建议</h4>
                <ul className="space-y-1">
                  {securityScore?.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>合规检查</CardTitle>
              <CardDescription>系统合规性检查结果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">GDPR - 数据保护</p>
                      <p className="text-sm text-muted-foreground">符合欧盟数据保护条例</p>
                    </div>
                  </div>
                  <Badge variant="default">通过</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">ISO 27001 - 信息安全</p>
                      <p className="text-sm text-muted-foreground">符合信息安全管理标准</p>
                    </div>
                  </div>
                  <Badge variant="default">通过</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">等保2.0 - 网络安全</p>
                      <p className="text-sm text-muted-foreground">部分项目需要改进</p>
                    </div>
                  </div>
                  <Badge variant="secondary">待改进</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>审计日志</CardTitle>
                <CardDescription>系统操作审计记录</CardDescription>
              </div>
              <Button onClick={generateReport}>
                <FileText className="h-4 w-4 mr-2" />
                生成报告
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">用户登录</p>
                      <p className="text-xs text-muted-foreground">admin@example.com - 2分钟前</p>
                    </div>
                  </div>
                  <Badge variant="outline">成功</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">数据导出</p>
                      <p className="text-xs text-muted-foreground">manager@example.com - 15分钟前</p>
                    </div>
                  </div>
                  <Badge variant="outline">成功</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">权限变更</p>
                      <p className="text-xs text-muted-foreground">admin@example.com - 1小时前</p>
                    </div>
                  </div>
                  <Badge variant="secondary">高风险</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>风险评估</CardTitle>
              <CardDescription>系统风险等级和缓解策略</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">风险因素</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">数据泄露风险</span>
                      <Badge variant="secondary">30%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">未授权访问风险</span>
                      <Badge variant="secondary">25%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">合规违规风险</span>
                      <Badge variant="secondary">20%</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">缓解策略</h4>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted-foreground">• 加强数据加密和访问控制</li>
                    <li className="text-sm text-muted-foreground">• 实施多因素认证</li>
                    <li className="text-sm text-muted-foreground">• 定期进行安全审计</li>
                    <li className="text-sm text-muted-foreground">• 加强员工安全培训</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
