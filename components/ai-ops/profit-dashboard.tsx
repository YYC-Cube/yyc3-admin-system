"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { CostBreakdownChart } from "./cost-breakdown-chart"
import { ProfitTrendChart } from "./profit-trend-chart"
import { StoreComparisonChart } from "./store-comparison-chart"

export function ProfitDashboard() {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<any>(null)

  const loadReport = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-ops/profit/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: "1", // 默认门店
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setReport(data)
      }
    } catch (error) {
      console.error("[v0] 加载盈亏报告失败:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReport()
  }, [startDate, endDate])

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <Card>
        <CardHeader>
          <CardTitle>时间范围</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, "PPP", { locale: zhCN })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} />
            </PopoverContent>
          </Popover>

          <span className="flex items-center">至</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(endDate, "PPP", { locale: zhCN })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} />
            </PopoverContent>
          </Popover>

          <Button onClick={loadReport} disabled={loading}>
            {loading ? "加载中..." : "查询"}
          </Button>
        </CardContent>
      </Card>

      {/* 关键指标 */}
      {report && (
        <>
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">总收入</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{report.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">营业收入总额</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">总成本</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{report.costs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">经营成本总额</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">净利润</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥{report.netProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">净利润率: {report.netMargin.toFixed(2)}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.roi.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground mt-1">投资回报率</p>
              </CardContent>
            </Card>
          </div>

          {/* 图表 */}
          <div className="grid gap-6 md:grid-cols-2">
            <CostBreakdownChart costs={report.costs} />
            <ProfitTrendChart storeId="1" />
          </div>

          <StoreComparisonChart startDate={startDate} endDate={endDate} />
        </>
      )}
    </div>
  )
}
