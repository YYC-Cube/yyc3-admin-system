"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, AlertTriangle } from "lucide-react"
import { trafficPredictionSystem, type TrafficData, type ExternalFactors } from "@/lib/ai/traffic-prediction"

interface Props {
  historicalTraffic: TrafficData[]
  externalFactors: ExternalFactors
}

export function TrafficPredictionDashboard({ historicalTraffic, externalFactors }: Props) {
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPredictions() {
      try {
        const forecasts = await trafficPredictionSystem.shortTermForecast(historicalTraffic, externalFactors)
        setPredictions(forecasts)
      } catch (error) {
        console.error("预测失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPredictions()
  }, [historicalTraffic, externalFactors])

  if (loading) {
    return <div className="text-center py-8">正在生成预测...</div>
  }

  // 计算今日预测
  const today = predictions.filter((p) => {
    const date = new Date(p.date)
    const now = new Date()
    return date.toDateString() === now.toDateString()
  })

  const todayTotal = today.reduce((sum, p) => sum + p.predictedCount, 0)
  const todayPeak = Math.max(...today.map((p) => p.predictedCount))
  const todayAvgConfidence = today.reduce((sum, p) => sum + p.confidence, 0) / today.length

  // 计算明日预测
  const tomorrow = predictions.filter((p) => {
    const date = new Date(p.date)
    const tmr = new Date()
    tmr.setDate(tmr.getDate() + 1)
    return date.toDateString() === tmr.toDateString()
  })

  const tomorrowTotal = tomorrow.reduce((sum, p) => sum + p.predictedCount, 0)
  const trend = ((tomorrowTotal - todayTotal) / todayTotal) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 今日预测客流 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日预测客流</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">置信度: {(todayAvgConfidence * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* 高峰时段客流 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高峰时段客流</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPeak}</div>
            <p className="text-xs text-muted-foreground">预计在18:00-22:00</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* 明日趋势 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">明日趋势</CardTitle>
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tomorrowTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {trend > 0 ? "+" : ""}
              {trend.toFixed(1)}% vs 今日
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* 预警信息 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预警信息</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">当前无异常</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
