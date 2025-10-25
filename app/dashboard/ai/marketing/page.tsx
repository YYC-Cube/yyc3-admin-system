import { Suspense } from "react"
import { MarketingDashboard } from "@/components/ai/marketing-dashboard"

export default function AIMarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI智能营销助手</h1>
        <p className="text-muted-foreground mt-2">基于AI的客户细分、营销活动生成和效果优化</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <MarketingDashboard />
      </Suspense>
    </div>
  )
}
