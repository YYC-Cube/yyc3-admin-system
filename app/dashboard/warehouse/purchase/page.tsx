"use client"

import { motion } from "framer-motion"
import { ShoppingCart, FileText, Package } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// 模拟采购数据
const mockPurchases = [
  {
    id: "CG2019060512345",
    date: "2019-06-05 14:30",
    store: "巨嗨KTV",
    warehouse: "总仓",
    supplier: "青岛啤酒供应商",
    quantity: 480,
    amount: 2400.0,
    type: "采购",
    operator: "林小软",
    status: "已入库",
  },
  {
    id: "CG2019060512346",
    date: "2019-06-05 15:20",
    store: "巨嗨KTV",
    warehouse: "超市仓",
    supplier: "饮料批发商",
    quantity: 200,
    amount: 1500.0,
    type: "采购",
    operator: "林小软",
    status: "已入库",
  },
]

export default function PurchasePage() {
  const columns = [
    { key: "id", label: "进货单号" },
    { key: "date", label: "进货日期" },
    { key: "store", label: "门店" },
    { key: "warehouse", label: "仓库" },
    { key: "supplier", label: "供应商" },
    {
      key: "quantity",
      label: "进货数量",
      render: (value: number) => <span className="font-medium">{value}</span>,
    },
    {
      key: "amount",
      label: "进货总额",
      render: (value: number) => <span className="font-semibold text-primary">¥{value.toFixed(2)}</span>,
    },
    {
      key: "status",
      label: "状态",
      render: (value: string) => <Badge variant={value === "已入库" ? "default" : "secondary"}>{value}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">采购进货</h1>
          <p className="text-sm text-muted-foreground">管理商品采购和入库记录</p>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="本月采购总额"
          value="¥12.8万"
          icon={ShoppingCart}
          trend={{ value: 8.5, isPositive: false }}
          description="较上月"
          delay={0}
        />
        <StatCard
          title="采购订单数"
          value="156"
          icon={FileText}
          trend={{ value: 12.3, isPositive: true }}
          description="本月订单"
          delay={0.1}
        />
        <StatCard
          title="入库商品数"
          value="8,542"
          icon={Package}
          trend={{ value: 5.7, isPositive: true }}
          description="本月入库"
          delay={0.2}
        />
      </div>

      {/* 筛选栏 */}
      <FilterBar
        searchPlaceholder="搜索进货单号、供应商..."
        showDateRange
        onAdd={() => console.log("新增采购单")}
        onExport={() => console.log("导出采购记录")}
        filters={[
          {
            label: "门店",
            options: [
              { label: "全部门店", value: "all" },
              { label: "巨嗨KTV", value: "juhai" },
            ],
            onChange: (value) => console.log("门店筛选:", value),
          },
          {
            label: "仓库",
            options: [
              { label: "全部仓库", value: "all" },
              { label: "总仓", value: "main" },
              { label: "超市仓", value: "market" },
            ],
            onChange: (value) => console.log("仓库筛选:", value),
          },
        ]}
      />

      {/* 数据表格 */}
      <DataTable
        columns={columns}
        data={mockPurchases}
        onRowClick={(purchase) => console.log("查看采购单:", purchase)}
        actions={(purchase) => (
          <Button variant="ghost" size="sm">
            详情
          </Button>
        )}
      />
    </div>
  )
}
