import { Suspense } from "react"
import { SmartEnergyDashboard } from "@/components/iot/smart-energy-dashboard"

export default function EnergyManagementPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">智能能源管理</h1>
          <p className="text-muted-foreground mt-2">实时监控能耗，优化能源使用，降低运营成本</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <SmartEnergyDashboard />
      </Suspense>
    </div>
  )
}
