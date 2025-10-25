import { Suspense } from "react"
import { HRTalentDashboard } from "@/components/ai-ops/hr-talent-dashboard"

export default function HRTalentPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">人力资源与绩效管理</h1>
        <p className="text-muted-foreground mt-2">员工画像、能力评估、成长路径、绩效管理、晋升建议、离职预测</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <HRTalentDashboard />
      </Suspense>
    </div>
  )
}
