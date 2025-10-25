import { Suspense } from "react"
import { SmartInventoryDashboard } from "@/components/iot/smart-inventory-dashboard"

export default function SmartInventoryPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">智能库存管理</h1>
          <p className="text-muted-foreground mt-2">基于RFID/NFC标签的自动盘点和实时监控</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <SmartInventoryDashboard />
      </Suspense>
    </div>
  )
}
