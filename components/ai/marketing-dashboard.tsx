"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerSegmentPanel } from "./customer-segment-panel"
import { CampaignGeneratorPanel } from "./campaign-generator-panel"
import { CampaignPerformancePanel } from "./campaign-performance-panel"
import { Users, Target, TrendingUp, Zap } from "lucide-react"

export function MarketingDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    segments: 0,
    activeCampaigns: 0,
    avgROI: 0,
  })

  useEffect(() => {
    // 模拟加载统计数据
    setStats({
      totalCustomers: 8542,
      segments: 6,
      activeCampaigns: 12,
      avgROI: 2.3,
    })
  }, [])

  const statCards = [
    {
      title: "总客户数",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "客户细分",
      value: stats.segments,
      icon: Target,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "活跃活动",
      value: stats.activeCampaigns,
      icon: Zap,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "平均ROI",
      value: `${stats.avgROI.toFixed(1)}x`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 功能标签页 */}
      <Tabs defaultValue="segments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="segments">客户细分</TabsTrigger>
          <TabsTrigger value="generator">活动生成</TabsTrigger>
          <TabsTrigger value="performance">效果分析</TabsTrigger>
        </TabsList>

        <TabsContent value="segments" className="space-y-4">
          <CustomerSegmentPanel />
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <CampaignGeneratorPanel />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <CampaignPerformancePanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
