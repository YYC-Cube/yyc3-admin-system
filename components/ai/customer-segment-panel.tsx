"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CustomerSegment } from "@/lib/ai/marketing-assistant"
import { Users, TrendingUp, AlertCircle } from "lucide-react"

export function CustomerSegmentPanel() {
  const [segments, setSegments] = useState<CustomerSegment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSegments()
  }, [])

  const loadSegments = async () => {
    setLoading(true)
    // 模拟加载客户细分数据
    setTimeout(() => {
      const mockSegments: CustomerSegment[] = [
        {
          id: "vip",
          name: "VIP客户",
          description: "高价值、高频次、近期活跃的核心客户",
          criteria: { minSpending: 5000, minVisits: 10 },
          memberCount: 342,
          avgLifetimeValue: 15000,
          characteristics: ["高消费", "高频次", "高忠诚度", "低流失风险"],
        },
        {
          id: "loyal",
          name: "忠诚客户",
          description: "中高价值、高频次的稳定客户",
          criteria: { minSpending: 2000, minVisits: 8 },
          memberCount: 1256,
          avgLifetimeValue: 8000,
          characteristics: ["中高消费", "高频次", "稳定"],
        },
        {
          id: "potential",
          name: "潜力客户",
          description: "消费能力强但频次较低的客户",
          criteria: { minSpending: 3000, maxVisits: 5 },
          memberCount: 892,
          avgLifetimeValue: 6000,
          characteristics: ["高消费", "低频次", "有增长潜力"],
        },
        {
          id: "at_risk",
          name: "流失风险客户",
          description: "曾经活跃但近期减少访问的客户",
          criteria: { minSpending: 1000 },
          memberCount: 654,
          avgLifetimeValue: 4000,
          characteristics: ["曾经活跃", "近期减少", "流失风险高"],
        },
        {
          id: "new",
          name: "新客户",
          description: "新注册或首次消费的客户",
          criteria: { maxVisits: 2 },
          memberCount: 2134,
          avgLifetimeValue: 1500,
          characteristics: ["新注册", "待培养", "潜力未知"],
        },
        {
          id: "dormant",
          name: "休眠客户",
          description: "长期未访问的客户",
          criteria: {},
          memberCount: 3264,
          avgLifetimeValue: 2000,
          characteristics: ["长期未访问", "需要唤醒"],
        },
      ]
      setSegments(mockSegments)
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return <div className="text-center py-12">加载客户细分数据...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {segments.map((segment, index) => (
        <motion.div
          key={segment.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{segment.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
                </div>
                {segment.id === "at_risk" && <AlertCircle className="h-5 w-5 text-orange-500" />}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>客户数</span>
                  </div>
                  <p className="text-xl font-bold mt-1">{segment.memberCount.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>平均LTV</span>
                  </div>
                  <p className="text-xl font-bold mt-1">¥{segment.avgLifetimeValue.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {segment.characteristics.map((char) => (
                  <Badge key={char} variant="secondary">
                    {char}
                  </Badge>
                ))}
              </div>

              <Button className="w-full bg-transparent" variant="outline">
                创建营销活动
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
