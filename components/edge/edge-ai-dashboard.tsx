"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Brain, Zap, Shield, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"
import { ModelManagementPanel } from "./model-management-panel"
import { InferenceTestPanel } from "./inference-test-panel"
import { PerformanceMonitorPanel } from "./performance-monitor-panel"

export function EdgeAIDashboard() {
  const [metrics, setMetrics] = useState({
    totalInferences: 0,
    avgLatency: 0,
    successRate: 0,
    loadedModels: 0,
  })

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/edge/ai/models")
      const result = await response.json()
      if (result.success) {
        setMetrics(result.data)
      }
    } catch (error) {
      console.error("获取指标失败:", error)
    }
  }

  const stats = [
    {
      title: "推理次数",
      value: metrics.totalInferences.toLocaleString(),
      icon: Brain,
      color: "text-blue-500",
    },
    {
      title: "平均延迟",
      value: `${metrics.avgLatency.toFixed(0)}ms`,
      icon: Zap,
      color: "text-green-500",
    },
    {
      title: "成功率",
      value: `${(metrics.successRate * 100).toFixed(1)}%`,
      icon: Shield,
      color: "text-purple-500",
    },
    {
      title: "已加载模型",
      value: metrics.loadedModels.toString(),
      icon: TrendingDown,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 模型管理 */}
      <ModelManagementPanel />

      {/* 推理测试 */}
      <InferenceTestPanel />

      {/* 性能监控 */}
      <PerformanceMonitorPanel />
    </div>
  )
}
