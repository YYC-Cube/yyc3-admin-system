import { Suspense } from "react"
import { UserBehaviorDashboard } from "@/components/bigdata/user-behavior-dashboard"

export default function UserBehaviorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">用户行为分析</h1>
        <p className="text-muted-foreground mt-2">深度分析用户行为，优化产品和运营</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <UserBehaviorDashboard />
      </Suspense>
    </div>
  )
}
