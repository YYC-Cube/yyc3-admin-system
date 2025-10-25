"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { dynamicPricingEngine } from "@/lib/ai/dynamic-pricing"
import { Loader2 } from "lucide-react"

export function PriceOptimizationPanel() {
  const [roomType, setRoomType] = useState<"small" | "medium" | "large" | "vip">("medium")
  const [demandLevel, setDemandLevel] = useState([0.6])
  const [minPrice, setMinPrice] = useState("50")
  const [maxPrice, setMaxPrice] = useState("500")
  const [optimizing, setOptimizing] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleOptimize() {
    setOptimizing(true)
    try {
      const timeSlot = {
        startTime: "18:00",
        endTime: "22:00",
        dayOfWeek: new Date().getDay(),
      }

      const demand = await dynamicPricingEngine.predictDemand(timeSlot, roomType, [])
      demand.predictedDemand = demandLevel[0]

      const optimalPrice = await dynamicPricingEngine.optimizePrice(demand, [], {
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        minMargin: 0.3,
        maxDiscount: 0.3,
      })

      setResult(optimalPrice)
    } catch (error) {
      console.error("[v0] 价格优化失败:", error)
    } finally {
      setOptimizing(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>优化参数</CardTitle>
          <CardDescription>设置价格优化的输入参数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>包厢类型</Label>
            <Select value={roomType} onValueChange={(v: any) => setRoomType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">小包厢</SelectItem>
                <SelectItem value="medium">中包厢</SelectItem>
                <SelectItem value="large">大包厢</SelectItem>
                <SelectItem value="vip">VIP包厢</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>需求水平: {(demandLevel[0] * 100).toFixed(0)}%</Label>
            <Slider value={demandLevel} onValueChange={setDemandLevel} min={0} max={1} step={0.1} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>最低价格</Label>
              <Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>最高价格</Label>
              <Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleOptimize} disabled={optimizing} className="w-full">
            {optimizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            开始优化
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>优化结果</CardTitle>
          <CardDescription>AI推荐的最优价格策略</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">推荐价格</div>
                <div className="text-4xl font-bold text-primary">¥{result.price}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">预期入住率</span>
                  <span className="font-medium">{(result.expectedOccupancy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">预期收益</span>
                  <span className="font-medium">¥{result.expectedRevenue.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm text-muted-foreground mb-1">优化理由</div>
                  <p className="text-sm">{result.reasoning}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">点击"开始优化"查看结果</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
