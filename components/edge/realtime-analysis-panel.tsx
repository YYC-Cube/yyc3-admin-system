"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ActivityIcon, Loader2Icon, AlertTriangleIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function RealtimeAnalysisPanel() {
  const [eventsInput, setEventsInput] = useState(`[
  { "id": "1", "type": "page_view", "timestamp": ${Date.now()}, "data": {}, "userId": "user1" },
  { "id": "2", "type": "button_click", "timestamp": ${Date.now()}, "data": {}, "userId": "user2" },
  { "id": "3", "type": "page_view", "timestamp": ${Date.now()}, "data": {}, "userId": "user1" },
  { "id": "4", "type": "error", "timestamp": ${Date.now()}, "data": {}, "userId": "user3" }
]`)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const events = JSON.parse(eventsInput)

      const response = await fetch("/api/edge/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      })

      if (!response.ok) {
        throw new Error("实时分析失败")
      }

      const data = await response.json()
      setResult(data.data)

      toast({
        title: "分析成功",
        description: "事件已在边缘节点分析完成",
      })
    } catch (error) {
      toast({
        title: "分析失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>事件输入</CardTitle>
            <CardDescription>输入需要分析的事件数据（JSON格式）</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={eventsInput}
              onChange={(e) => setEventsInput(e.target.value)}
              rows={15}
              className="font-mono text-sm"
              placeholder="输入JSON格式的事件..."
            />

            <Button onClick={handleAnalyze} disabled={analyzing} className="w-full">
              {analyzing ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <ActivityIcon className="mr-2 h-4 w-4" />
                  开始分析
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>分析摘要</CardTitle>
            <CardDescription>边缘节点实时分析结果</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">总事件数</div>
                    <div className="text-2xl font-bold">{result.summary.totalEvents}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">活跃用户</div>
                    <div className="text-2xl font-bold">{result.summary.uniqueUsers}</div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium mb-2">事件类型分布</div>
                  <div className="space-y-2">
                    {Object.entries(result.summary.eventTypes).map(([type, count]: [string, any]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium mb-2">智能洞察</div>
                  <ul className="space-y-1">
                    {result.insights.map((insight: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
                <div className="text-center">
                  <ActivityIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">分析结果将显示在这里</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {result && result.trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>趋势分析</CardTitle>
            <CardDescription>事件数量随时间变化趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={result.trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {result && result.anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>异常检测</CardTitle>
            <CardDescription>发现的异常事件和告警</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.anomalies.map((anomaly: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 rounded-lg border p-4 ${
                    anomaly.severity === "high"
                      ? "border-red-200 bg-red-50"
                      : anomaly.severity === "medium"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <AlertTriangleIcon
                    className={`h-5 w-5 ${
                      anomaly.severity === "high"
                        ? "text-red-600"
                        : anomaly.severity === "medium"
                          ? "text-yellow-600"
                          : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{anomaly.type}</div>
                    <div className="text-sm text-muted-foreground">{anomaly.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(anomaly.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      anomaly.severity === "high"
                        ? "bg-red-100 text-red-700"
                        : anomaly.severity === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {anomaly.severity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
