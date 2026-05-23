import { Suspense } from "react"
import { OpsTrackerDashboard } from "@/components/ai-ops/ops-tracker-dashboard"

export const metadata = {
  title: "AI智能运维执行跟踪与奖惩系统 - KTV管理系统",
  description: "自动记录和跟踪运营任务执行情况，智能识别异常，提供优化建议，实施奖惩机制",
}

export default function OpsTrackerPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">AI智能运维执行跟踪与奖惩系统</h1>
        <p className="text-muted-foreground">
          自动记录和跟踪运营任务执行情况，智能识别异常，提供优化建议，实施奖惩机制
        </p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <OpsTrackerDashboard />
      </Suspense>
    </div>
  )
}
