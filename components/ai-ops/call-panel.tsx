"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneCall } from "lucide-react"

export function CallPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="h-5 w-5" />
          呼叫系统
        </CardTitle>
        <CardDescription>语音呼叫与录音管理</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">暂无呼叫记录</div>
      </CardContent>
    </Card>
  )
}
