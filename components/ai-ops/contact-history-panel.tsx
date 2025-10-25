"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"

export function ContactHistoryPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          联系历史
        </CardTitle>
        <CardDescription>客户沟通记录与反馈</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">暂无联系记录</div>
      </CardContent>
    </Card>
  )
}
