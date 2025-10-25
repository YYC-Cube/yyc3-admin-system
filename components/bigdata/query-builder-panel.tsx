"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Search, Play } from "lucide-react"

export function QueryBuilderPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          查询构建器
        </CardTitle>
        <CardDescription>自定义SQL查询</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea placeholder="输入SQL查询语句..." rows={6} className="font-mono text-sm" />

        <div className="flex gap-2">
          <Button className="flex-1">
            <Play className="mr-2 h-4 w-4" />
            执行查询
          </Button>
          <Button variant="outline">保存查询</Button>
        </div>

        <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">查询结果将显示在这里</div>
      </CardContent>
    </Card>
  )
}
