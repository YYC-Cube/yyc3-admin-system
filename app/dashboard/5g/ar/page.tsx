import { Suspense } from "react"
import { ARConcertDashboard } from "@/components/5g/ar-concert-dashboard"

export default function ARConcertPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AR虚拟演唱会</h1>
          <p className="text-muted-foreground mt-2">增强现实技术打造沉浸式演唱会体验</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <ARConcertDashboard />
      </Suspense>
    </div>
  )
}
