import { Suspense } from "react"
import ComplianceDashboard from "@/components/ai-ops/compliance-dashboard"

export default function CompliancePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">合规与审计自动化</h1>
        <p className="text-muted-foreground mt-2">自动记录关键操作，生成审计报告，支持安全评分与风险等级标记</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <ComplianceDashboard />
      </Suspense>
    </div>
  )
}
