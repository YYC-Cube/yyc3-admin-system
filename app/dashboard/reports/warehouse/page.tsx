"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { useState } from "react"

// 库存变化明细数据
const stockChanges = [
  {
    id: "D110086192017717",
    time: "2019-01-10 16:23",
    type: "订单销售",
    change: "出库",
    store: "启智",
    warehouse: "超市仓",
    category: "休闲食品",
    product: "JELLYBIRD果冻酒36gx2",
    unit: "个",
    quantity: 1.0,
    price: 1.0,
    total: 1.0,
  },
  {
    id: "PD2019011010590102785",
    time: "2019-01-10 10:59",
    type: "库存盘点",
    change: "入库",
    store: "启智",
    warehouse: "总仓",
    category: "小吃",
    product: "香辣片",
    unit: "份",
    quantity: 22.0,
    price: 1.0,
    total: 22.0,
  },
]

export default function WarehouseReportsPage() {
  // 筛选状态
  const [filters, setFilters] = useState({
    dateRange: undefined,
    store: "all",
    warehouse: "all",
    documentType: "all",
    stockChange: "all",
    productName: ""
  })

  const columns = [
    { key: "time", label: "操作时间", width: "w-40" },
    { 
      key: "id", 
      label: "单据编号", 
      width: "w-48",
      render: (item: any) => <span className="font-mono text-xs">{item.id}</span>
    },
    { 
      key: "type", 
      label: "单据类型", 
      width: "w-28",
      render: (item: any) => <Badge variant="outline">{item.type}</Badge>
    },
    { 
      key: "change", 
      label: "库存变化", 
      width: "w-24",
      render: (item: any) => (
        <Badge variant={item.change === "入库" ? "default" : "secondary"}>
          {item.change === "入库" ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          {item.change}
        </Badge>
      )
    },
    { key: "warehouse", label: "仓库", width: "w-28" },
    { 
      key: "product", 
      label: "商品信息", 
      width: "w-48",
      render: (item: any) => (
        <div className="space-y-1">
          <div className="text-sm font-medium">{item.product}</div>
          <div className="text-xs text-muted-foreground">
            {item.category} · {item.unit}
          </div>
        </div>
      )
    },
    { 
      key: "quantity", 
      label: "数量", 
      width: "w-24",
      render: (item: any) => <span className="font-semibold">{item.quantity}</span>
    },
    { 
      key: "total", 
      label: "进货价合计", 
      width: "w-32",
      render: (total: number) => <span className="font-semibold text-primary">¥{total?.toFixed(2) || '0.00'}</span>
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">仓库报表</h1>
        <p className="mt-2 text-muted-foreground">查看商品入库、出库相关进出库报表数据</p>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar
        filters={[
          {
            label: "选择门店",
            options: [
              { label: "全部门店", value: "all" },
              { label: "启智", value: "store1" },
              { label: "KTV旗舰店", value: "store2" }
            ],
            onChange: (value: string) => setFilters({ ...filters, store: value })
          },
          {
            label: "仓库",
            options: [
              { label: "全部仓库", value: "all" },
              { label: "总仓", value: "warehouse1" },
              { label: "超市仓", value: "warehouse2" }
            ],
            onChange: (value: string) => setFilters({ ...filters, warehouse: value })
          },
          {
            label: "单据类型",
            options: [
              { label: "全部类型", value: "all" },
              { label: "订单销售", value: "sale" },
              { label: "采购进货", value: "purchase" },
              { label: "库存盘点", value: "inventory" },
              { label: "库存调拨", value: "transfer" }
            ],
            onChange: (value: string) => setFilters({ ...filters, documentType: value })
          },
          {
            label: "库存变化",
            options: [
              { label: "全部", value: "all" },
              { label: "入库", value: "in" },
              { label: "出库", value: "out" }
            ],
            onChange: (value: string) => setFilters({ ...filters, stockChange: value })
          },
          {
            label: "商品名称",
            options: [],
            onChange: (value: string) => setFilters({ ...filters, productName: value })
          }
        ]}
        onSearch={() => {
          // 处理搜索逻辑
          console.log("搜索条件:", filters)
        }}
      />

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">入库数量</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">61,513</div>
              <p className="text-xs text-muted-foreground">本期入库总数</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">出库数量</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">67,876</div>
              <p className="text-xs text-muted-foreground">本期出库总数</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">库存结存</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">-6,363</div>
              <p className="text-xs text-muted-foreground">当前库存差额</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">库存周转</CardTitle>
              <ArrowUpDown className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">8.5次</div>
              <p className="text-xs text-muted-foreground">本期周转次数</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <DataTable columns={columns} data={stockChanges} />
      </motion.div>
    </div>
  )
}
