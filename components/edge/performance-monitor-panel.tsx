"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

export function PerformanceMonitorPanel() {
  const [latencyData, setLatencyData] = useState<Array<{ time: string; latency: number }>>([])

  useEffect(() => {
    // 生成模拟数据
    const generateData = () => {
      const now = Date.now()
      const data = []
      for (let i = 11; i >= 0; i--) {
        data.push({
          time: new Date(now - i * 5000).toLocaleTimeString(),
          latency: Math.random() * 30 + 20,
        })
      }
      return data
    }

    setLatencyData(generateData())

    // 定时更新数据
    const interval = setInterval(() => {
      setLatencyData((prev) => {
        const newData = [...prev.slice(1)]
        newData.push({
          time: new Date().toLocaleTimeString(),
          latency: Math.random() * 30 + 20,
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">性能监控</h2>
        <p className="text-sm text-muted-foreground mt-1">实时监控AI推理性能指标</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">推理延迟趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">平均延迟</p>
            <p className="text-2xl font-bold mt-2">
              {latencyData.length > 0
                ? (latencyData.reduce((sum, d) => sum + d.latency, 0) / latencyData.length).toFixed(0)
                : 0}
              ms
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">最小延迟</p>
            <p className="text-2xl font-bold mt-2">
              {latencyData.length > 0 ? Math.min(...latencyData.map((d) => d.latency)).toFixed(0) : 0}ms
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">最大延迟</p>
            <p className="text-2xl font-bold mt-2">
              {latencyData.length > 0 ? Math.max(...latencyData.map((d) => d.latency)).toFixed(0) : 0}ms
            </p>
          </div>
        </div>
      </motion.div>
    </Card>
  )
}
