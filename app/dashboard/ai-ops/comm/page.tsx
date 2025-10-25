import { Suspense } from "react"
import { InternalCommDashboard } from "@/components/ai-ops/internal-comm-dashboard"

export default function InternalCommPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">内部沟通体系</h1>
        <p className="text-muted-foreground mt-2">
          支持个人、分组、部门、团队等组织架构的内部沟通，实现任务协同、消息推送、权限控制
        </p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <InternalCommDashboard />
      </Suspense>
    </div>
  )
}
