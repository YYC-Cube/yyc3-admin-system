import { Suspense } from "react"
import { FeedbackDashboard } from "@/components/ai-ops/feedback-dashboard"

export default function FeedbackPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI智能沟通反馈体系</h1>
        <p className="text-muted-foreground mt-2">客户反馈与内部反馈分离管理，自动分类、情绪识别、满意度评分</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <FeedbackDashboard />
      </Suspense>
    </div>
  )
}
