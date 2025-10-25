import { Suspense } from "react"
import { CustomerPromotionDashboard } from "@/components/ai-ops/customer-promotion-dashboard"

export const metadata = {
  title: "AI智能客户营销与提档系统 - KTV管理系统",
  description: "基于客户行为数据的智能分层、标签化、个性化营销和自动提档机制",
}

export default function CustomerPromotionPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">AI智能客户营销与提档系统</h1>
        <p className="text-muted-foreground mt-2">基于客户行为数据的智能分层、标签化、个性化营销和自动提档机制</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <CustomerPromotionDashboard />
      </Suspense>
    </div>
  )
}
