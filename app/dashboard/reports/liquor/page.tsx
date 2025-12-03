"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Removed unused imports
import { Wine, Package, TrendingUp, TrendingDown } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"
// DateRangePicker removed as it's not used

// 酒水存取汇总数据
const liquorSummary = [
  {
    id: 1,
    store: "启智",
    category: "休闲食品",
    product: "JELLYBIRD果冻酒36gx2",
    unit: "个",
    storageQty: 46.0,
    pickupQty: 0.0,
    price: 1.0,
    storageAmount: 46.0,
    pickupAmount: 0.0,
  },
  {
    id: 2,
    store: "启智",
    category: "果盘",
    product: "大果盘",
    unit: "份",
    storageQty: 2.0,
    pickupQty: 0.0,
    price: 1.0,
    storageAmount: 2.0,
    pickupAmount: 0.0,
  },
  {
    id: 3,
    store: "启智",
    category: "啤酒",
    product: "乐堡啤酒330ml",
    unit: "瓶",
    storageQty: 3.5,
    pickupQty: 1.5,
    price: 1.0,
    storageAmount: 3.5,
    pickupAmount: 1.5,
  },
]

export default function LiquorReportsPage() {
  const [filters, setFilters] = useState({
    dateRange: null,
    store: 'all',
    category: 'all',
    name: ''
  })

  const columns = [
    { key: "store", label: "门店", width: "w-32" },
    { key: "category", label: "商品类型", width: "w-28" },
    { key: "product", label: "商品名称", width: "w-48" },
    { key: "unit", label: "单位", width: "w-20" },
    { 
      key: "storageQty", 
      label: "寄存信息", 
      width: "w-40",
      render: (storageQty: number, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-3 w-3 text-green-500" />
            <span className="text-sm font-semibold text-green-500">{storageQty}</span>
          </div>
          <div className="text-xs text-muted-foreground">金额: ¥{(row.storageAmount || 0).toFixed(2)}</div>
        </div>
      )
    },
    { 
      key: "pickupQty", 
      label: "取酒信息", 
      width: "w-40",
      render: (pickupQty: number, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wine className="h-3 w-3 text-orange-500" />
            <span className="text-sm font-semibold text-orange-500">{pickupQty}</span>
          </div>
          <div className="text-xs text-muted-foreground">金额: ¥{(row.pickupAmount || 0).toFixed(2)}</div>
        </div>
      )
    },
    { 
      key: "price", 
      label: "进货单价", 
      width: "w-28",
      render: (price: number) => (
        <span className="font-semibold text-primary">¥{(price || 0).toFixed(2)}</span>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">酒水存取报表</h1>
        <p className="mt-2 text-muted-foreground">查看酒水寄存、取酒、充公等相关数据报表</p>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar
        filters={[
          {
            label: '选择门店',
            options: [
              { label: '全部门店', value: 'all' },
              { label: '启智', value: 'store1' },
              { label: 'KTV旗舰店', value: 'store2' }
            ],
            onChange: (value: string) => setFilters({ ...filters, store: value })
          },
          {
            label: '商品类型',
            options: [
              { label: '全部类型', value: 'all' },
              { label: '洋酒', value: 'liquor' },
              { label: '啤酒', value: 'beer' },
              { label: '红酒', value: 'wine' }
            ],
            onChange: (value: string) => setFilters({ ...filters, category: value })
          },
          {
            label: '商品名称',
            options: [],
            onChange: (value: string) => setFilters({ ...filters, name: value })
          }
        ]}
        onSearch={() => {
          console.log('搜索条件:', filters)
          // 执行搜索逻辑
        }}
      />

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">寄存总量</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">63</div>
              <p className="text-xs text-muted-foreground">本期寄存数量</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">取酒总量</CardTitle>
              <Wine className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">4</div>
              <p className="text-xs text-muted-foreground">本期取酒数量</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">寄存金额</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">¥66.50</div>
              <p className="text-xs text-muted-foreground">寄存商品总价值</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">取酒金额</CardTitle>
              <TrendingDown className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">¥6.50</div>
              <p className="text-xs text-muted-foreground">取酒商品总价值</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <DataTable columns={columns} data={liquorSummary} />
      </motion.div>
    </div>
  )
}
