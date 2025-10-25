import { Suspense } from "react"
import { CacheMetricsDashboard } from "@/components/edge/cache-metrics-dashboard"
import { CacheControlPanel } from "@/components/edge/cache-control-panel"

export default async function EdgeCachePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">边缘缓存系统</h1>
        <p className="text-muted-foreground mt-2">实时监控和管理边缘缓存，提升系统性能</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <CacheMetricsDashboard />
      </Suspense>

      <Suspense fallback={<div>加载中...</div>}>
        <CacheControlPanel />
      </Suspense>
    </div>
  )
}
