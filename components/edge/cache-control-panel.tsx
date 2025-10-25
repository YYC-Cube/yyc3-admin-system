"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, RefreshCw, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CacheControlPanel() {
  const [pattern, setPattern] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInvalidate = async () => {
    if (!pattern) {
      toast({
        title: "请输入缓存键模式",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // 调用API失效缓存
      const response = await fetch("/api/edge/cache/invalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pattern }),
      })

      const data = await response.json()

      toast({
        title: "缓存失效成功",
        description: `已失效 ${data.count} 条缓存`,
      })
    } catch (error) {
      toast({
        title: "缓存失效失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/edge/cache/clear", { method: "POST" })
      toast({
        title: "已清空所有缓存",
      })
    } catch (error) {
      toast({
        title: "清空缓存失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleWarmup = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/edge/cache/warmup", { method: "POST" })
      toast({
        title: "缓存预热已启动",
        description: "预计需要1-2分钟完成",
      })
    } catch (error) {
      toast({
        title: "缓存预热失败",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>缓存控制</CardTitle>
        <CardDescription>管理边缘缓存数据</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pattern">缓存键模式</Label>
          <div className="flex gap-2">
            <Input
              id="pattern"
              placeholder="例如: products:* 或 api:*"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
            />
            <Button onClick={handleInvalidate} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              失效
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">支持通配符 * 匹配多个缓存键</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleWarmup} disabled={isLoading}>
            <Zap className="h-4 w-4 mr-2" />
            缓存预热
          </Button>
          <Button variant="destructive" onClick={handleClearAll} disabled={isLoading}>
            <Trash2 className="h-4 w-4 mr-2" />
            清空所有缓存
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
