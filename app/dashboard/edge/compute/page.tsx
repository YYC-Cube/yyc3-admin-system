import { Suspense } from "react"
import { EdgeComputeDashboard } from "@/components/edge/edge-compute-dashboard"

export const metadata = {
  title: "边缘计算 - 启智KTV管理系统",
  description: "边缘计算函数管理和监控",
}

export default function EdgeComputePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">边缘计算</h1>
        <p className="text-muted-foreground mt-2">在边缘节点执行计算逻辑，减少数据传输，提升性能</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <EdgeComputeDashboard />
      </Suspense>
    </div>
  )
}
