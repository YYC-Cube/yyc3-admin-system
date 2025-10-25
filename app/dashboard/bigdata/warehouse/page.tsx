import { Suspense } from "react"
import { DataWarehouseDashboard } from "@/components/bigdata/data-warehouse-dashboard"

export default function DataWarehousePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">实时数据仓库</h1>
        <p className="text-muted-foreground mt-2">构建实时数据仓库，支持秒级查询和多维分析</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <DataWarehouseDashboard />
      </Suspense>
    </div>
  )
}
