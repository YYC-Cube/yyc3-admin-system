import { Suspense } from "react"
import { PredictiveDashboard } from "@/components/bigdata/predictive-dashboard"

export default function PredictivePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">预测分析引擎</h1>
        <p className="text-muted-foreground mt-2">基于历史数据预测未来趋势，优化业务决策</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <PredictiveDashboard />
      </Suspense>
    </div>
  )
}
