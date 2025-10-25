"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BarChart3Icon, Loader2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DataAggregatePanel() {
  const [dataInput, setDataInput] = useState(`[
  { "timestamp": ${Date.now()}, "value": 100, "category": "sales" },
  { "timestamp": ${Date.now()}, "value": 200, "category": "sales" },
  { "timestamp": ${Date.now()}, "value": 150, "category": "orders" },
  { "timestamp": ${Date.now()}, "value": 300, "category": "orders" }
]`)
  const [aggregating, setAggregating] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const handleAggregate = async () => {
    setAggregating(true)
    try {
      const dataPoints = JSON.parse(dataInput)

      const response = await fetch("/api/edge/aggregate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataPoints }),
      })

      if (!response.ok) {
        throw new Error("数据聚合失败")
      }

      const data = await response.json()
      setResult(data.data)

      toast({
        title: "聚合成功",
        description: "数据已在边缘节点聚合完成",
      })
    } catch (error) {
      toast({
        title: "聚合失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setAggregating(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>数据输入</CardTitle>
          <CardDescription>输入需要聚合的数据点（JSON格式）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            rows={15}
            className="font-mono text-sm"
            placeholder="输入JSON格式的数据..."
          />

          <Button onClick={handleAggregate} disabled={aggregating} className="w-full">
            {aggregating ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                聚合中...
              </>
            ) : (
              <>
                <BarChart3Icon className="mr-2 h-4 w-4" />
                开始聚合
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>聚合结果</CardTitle>
          <CardDescription>边缘节点聚合后的统计数据</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">总和</div>
                  <div className="text-2xl font-bold">{result.total}</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">平均值</div>
                  <div className="text-2xl font-bold">{result.average.toFixed(2)}</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">最小值</div>
                  <div className="text-2xl font-bold">{result.min}</div>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">最大值</div>
                  <div className="text-2xl font-bold">{result.max}</div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium mb-2">分组统计</div>
                <div className="space-y-2">
                  {Object.entries(result.groupBy).map(([category, data]: [string, any]) => (
                    <div key={category} className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">{category}</span>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">数量: {data.count}</div>
                        <div className="text-sm font-medium">平均: {data.average.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <BarChart3Icon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">聚合结果将显示在这里</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
