"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Database, TrendingUp, Zap } from "lucide-react"
import { motion } from "framer-motion"
import type { CacheMetrics } from "@/lib/edge/cache-system"

export function CacheMetricsDashboard() {
  const [metrics, setMetrics] = useState<CacheMetrics>({
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    cacheSize: 0,
    evictions: 0,
  })

  useEffect(() => {
    // 模拟实时数据更新
    const interval = setInterval(() => {
      setMetrics({
        hits: Math.floor(Math.random() * 10000),
        misses: Math.floor(Math.random() * 2000),
        hitRate: 85 + Math.random() * 10,
        totalRequests: Math.floor(Math.random() * 12000),
        avgResponseTime: 30 + Math.random() * 20,
        cacheSize: Math.floor(Math.random() * 100),
        evictions: Math.floor(Math.random() * 100),
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const cards = [
    {
      title: "缓存命中率",
      value: `${metrics.hitRate.toFixed(2)}%`,
      icon: TrendingUp,
      description: "目标: 85%+",
      color: "text-green-500",
    },
    {
      title: "平均响应时间",
      value: `${metrics.avgResponseTime.toFixed(0)}ms`,
      icon: Zap,
      description: "目标: <50ms",
      color: "text-blue-500",
    },
    {
      title: "总请求数",
      value: metrics.totalRequests.toLocaleString(),
      icon: Activity,
      description: `命中: ${metrics.hits} / 未命中: ${metrics.misses}`,
      color: "text-purple-500",
    },
    {
      title: "缓存大小",
      value: `${metrics.cacheSize} MB`,
      icon: Database,
      description: `驱逐: ${metrics.evictions} 次`,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
