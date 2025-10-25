import { Suspense } from "react"
import { BIDashboard } from "@/components/bigdata/bi-dashboard"

export default function BIPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">商业智能分析</h1>
          <p className="text-muted-foreground mt-2">多维度数据分析，生成商业洞察报告</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <BIDashboard />
      </Suspense>
    </div>
  )
}
