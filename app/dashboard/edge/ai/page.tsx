import { Suspense } from "react"
import { EdgeAIDashboard } from "@/components/edge/edge-ai-dashboard"

export default async function EdgeAIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">边缘AI推理</h1>
        <p className="text-muted-foreground mt-2">在边缘节点运行AI模型，降低延迟，保护隐私</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <EdgeAIDashboard />
      </Suspense>
    </div>
  )
}
