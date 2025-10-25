"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, MousePointer, ShoppingCart, DollarSign, AlertCircle } from "lucide-react"
import type { CampaignMetrics, Optimization } from "@/lib/ai/marketing-assistant"

interface CampaignPerformance {
  id: string
  name: string
  status: string
  metrics: CampaignMetrics
  optimizations?: Optimization[]
}

export function CampaignPerformancePanel() {
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignPerformance | null>(null)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = () => {
    // 模拟加载活动数据
    const mockCampaigns: CampaignPerformance[] = [
      {
        id: "1",
        name: "VIP客户积分翻倍活动",
        status: "running",
        metrics: {
          sent: 342,
          delivered: 325,
          opened: 243,
          clicked: 156,
          converted: 89,
          revenue: 134500,
          cost: 15000,
        },
        optimizations: [
          {
            aspect: "发送时间",
            before: "10:00",
            after: "14:00",
            impact: "+12% 打开率",
          },
        ],
      },
      {
        id: "2",
        name: "潜力客户充值优惠",
        status: "running",
        metrics: {
          sent: 892,
          delivered: 856,
          opened: 512,
          clicked: 287,
          converted: 134,
          revenue: 268000,
          cost: 25000,
        },
      },
      {
        id: "3",
        name: "流失客户唤醒活动",
        status: "completed",
        metrics: {
          sent: 654,
          delivered: 612,
          opened: 245,
          clicked: 98,
          converted: 34,
          revenue: 51000,
          cost: 18000,
        },
      },
    ]
    setCampaigns(mockCampaigns)
    setSelectedCampaign(mockCampaigns[0])
  }

  const calculateMetrics = (metrics: CampaignMetrics) => {
    const deliveryRate = (metrics.delivered / metrics.sent) * 100
    const openRate = (metrics.opened / metrics.delivered) * 100
    const clickRate = (metrics.clicked / metrics.opened) * 100
    const conversionRate = (metrics.converted / metrics.clicked) * 100
    const roi = ((metrics.revenue - metrics.cost) / metrics.cost) * 100

    return { deliveryRate, openRate, clickRate, conversionRate, roi }
  }

  const funnelData = selectedCampaign
    ? [
        { stage: "发送", value: selectedCampaign.metrics.sent, percentage: 100 },
        {
          stage: "送达",
          value: selectedCampaign.metrics.delivered,
          percentage: (selectedCampaign.metrics.delivered / selectedCampaign.metrics.sent) * 100,
        },
        {
          stage: "打开",
          value: selectedCampaign.metrics.opened,
          percentage: (selectedCampaign.metrics.opened / selectedCampaign.metrics.sent) * 100,
        },
        {
          stage: "点击",
          value: selectedCampaign.metrics.clicked,
          percentage: (selectedCampaign.metrics.clicked / selectedCampaign.metrics.sent) * 100,
        },
        {
          stage: "转化",
          value: selectedCampaign.metrics.converted,
          percentage: (selectedCampaign.metrics.converted / selectedCampaign.metrics.sent) * 100,
        },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* 活动列表 */}
      <div className="grid gap-4 md:grid-cols-3">
        {campaigns.map((campaign, index) => {
          const metrics = calculateMetrics(campaign.metrics)
          return (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all ${
                  selectedCampaign?.id === campaign.id ? "ring-2 ring-primary" : "hover:shadow-md"
                }`}
                onClick={() => setSelectedCampaign(campaign)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-sm">{campaign.name}</h4>
                    <Badge variant={campaign.status === "running" ? "default" : "secondary"}>
                      {campaign.status === "running" ? "进行中" : "已完成"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">转化率</p>
                      <p className="font-bold">{metrics.conversionRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ROI</p>
                      <p className="font-bold text-green-500">{metrics.roi.toFixed(0)}%</p>
                    </div>
                  </div>

                  {campaign.optimizations && campaign.optimizations.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-orange-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>{campaign.optimizations.length}个优化建议</span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {selectedCampaign && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 关键指标 */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">关键指标</h3>
            <div className="space-y-4">
              {(() => {
                const metrics = calculateMetrics(selectedCampaign.metrics)
                const indicators = [
                  { label: "送达率", value: metrics.deliveryRate, icon: Users, color: "text-blue-500" },
                  { label: "打开率", value: metrics.openRate, icon: MousePointer, color: "text-green-500" },
                  { label: "点击率", value: metrics.clickRate, icon: MousePointer, color: "text-purple-500" },
                  { label: "转化率", value: metrics.conversionRate, icon: ShoppingCart, color: "text-orange-500" },
                ]

                return indicators.map((indicator) => (
                  <div key={indicator.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <indicator.icon className={`h-4 w-4 ${indicator.color}`} />
                        <span className="text-sm">{indicator.label}</span>
                      </div>
                      <span className="font-bold">{indicator.value.toFixed(1)}%</span>
                    </div>
                    <Progress value={indicator.value} className="h-2" />
                  </div>
                ))
              })()}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm">投资回报率</span>
                  </div>
                  <span className="text-2xl font-bold text-green-500">
                    {calculateMetrics(selectedCampaign.metrics).roi.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* 转化漏斗 */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">转化漏斗</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 优化建议 */}
          {selectedCampaign.optimizations && selectedCampaign.optimizations.length > 0 && (
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  AI优化建议
                </h3>
                <Button size="sm">应用全部优化</Button>
              </div>
              <div className="space-y-3">
                {selectedCampaign.optimizations.map((opt, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{opt.aspect}</Badge>
                          <span className="text-sm text-green-500 font-medium">{opt.impact}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">当前</p>
                            <p className="font-medium">{opt.before}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">建议</p>
                            <p className="font-medium text-primary">{opt.after}</p>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        应用
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
