import { Suspense } from "react"
import { OutreachDashboard } from "@/components/ai-ops/outreach-dashboard"

export const metadata = {
  title: "AI智能回访邀约系统 - KTV管理系统",
  description: "自动化客户回访、邀约、短信发送和语音呼叫",
}

export default function OutreachPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI智能回访邀约系统</h1>
          <p className="text-muted-foreground mt-2">自动化客户回访、邀约、短信发送和语音呼叫，提升客户触达效率</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <OutreachDashboard />
      </Suspense>
    </div>
  )
}
