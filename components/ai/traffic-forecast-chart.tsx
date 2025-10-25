"use client"

import { useEffect, useState } from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { trafficPredictionSystem, type TrafficData } from "@/lib/ai/traffic-prediction"

interface Props {
  type: "short-term" | "long-term"
  historicalTraffic: TrafficData[]
}

export function TrafficForecastChart({ type, historicalTraffic }: Props) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        if (type === "short-term") {
          const forecasts = await trafficPredictionSystem.shortTermForecast(historicalTraffic, {
            weather: "sunny",
            temperature: 25,
            isHoliday: false,
            hasEvent: false,
          })

          // 按天聚合数据
          const dailyData = forecasts.reduce(
            (acc, f) => {
              const dateStr = new Date(f.date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
              if (!acc[dateStr]) {
                acc[dateStr] = { date: dateStr, predicted: 0, min: 0, max: 0, count: 0 }
              }
              acc[dateStr].predicted += f.predictedCount
              acc[dateStr].min += f.range.min
              acc[dateStr].max += f.range.max
              acc[dateStr].count += 1
              return acc
            },
            {} as Record<string, any>,
          )

          const data = Object.values(dailyData).map((d: any) => ({
            date: d.date,
            predicted: Math.round(d.predicted / d.count),
            min: Math.round(d.min / d.count),
            max: Math.round(d.max / d.count),
          }))

          setChartData(data)
        } else {
          const forecasts = await trafficPredictionSystem.longTermForecast(
            [
              {
                type: "monthly",
                pattern: [1.0, 0.9, 1.1, 1.2, 1.0, 0.95, 1.15, 1.3, 1.1, 1.0, 0.9, 1.4],
              },
            ],
            {
              direction: "up",
              strength: 0.8,
              changeRate: 0.05,
            },
          )

          const data = forecasts.map((f) => ({
            month: f.month,
            traffic: f.predictedTraffic,
            revenue: f.predictedRevenue,
          }))

          setChartData(data)
        }
      } catch (error) {
        console.error("加载预测数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [type, historicalTraffic])

  if (loading) {
    return <div className="h-[400px] flex items-center justify-center">加载中...</div>
  }

  if (type === "short-term") {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="max"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
            name="最大值"
          />
          <Area type="monotone" dataKey="predicted" stackId="2" stroke="#8884d8" fill="#8884d8" name="预测值" />
          <Area
            type="monotone"
            dataKey="min"
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
            fillOpacity={0.3}
            name="最小值"
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="traffic" stroke="#8884d8" name="预测客流" />
        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="预测收益 (¥)" />
      </LineChart>
    </ResponsiveContainer>
  )
}
