import { Suspense } from "react"
import ExecutiveDashboard from "@/components/ai-ops/executive-dashboard"

export default function ExecutivePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">战略决策支持系统</h1>
        <p className="text-muted-foreground mt-2">CEO/管理层专属仪表板 - 数据驱动决策</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <ExecutiveDashboard />
      </Suspense>
    </div>
  )
}
