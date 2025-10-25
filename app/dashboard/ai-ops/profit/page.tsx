import { Suspense } from "react"
import { ProfitDashboard } from "@/components/ai-ops/profit-dashboard"

export default function ProfitIntelligencePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI智能经营成本盈亏计算器</h1>
          <p className="text-muted-foreground mt-2">自动计算和分析经营成本、收入、利润，提供多维度盈亏分析和预测</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <ProfitDashboard />
      </Suspense>
    </div>
  )
}
