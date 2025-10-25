"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, TrendingUp, TrendingDown, ArrowUpDown, Download } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// 库存变化明细数据
const stockChanges = [
  {
    id: "D110086192017717",
    time: "2019-01-10 16:23",
    type: "订单销售",
    change: "出库",
    store: "巨嗨KTV",
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
    store: "巨嗨KTV",
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
  const columns = [
    { key: "time", label: "操作时间", width: "w-40" },
    { key: "id", label: "单据编号", width: "w-48" },
    { key: "type", label: "单据类型", width: "w-28" },
    { key: "change", label: "库存变化", width: "w-24" },
    { key: "warehouse", label: "仓库", width: "w-28" },
    { key: "product", label: "商品信息", width: "w-48" },
    { key: "quantity", label: "数量", width: "w-24" },
    { key: "total", label: "进货价合计", width: "w-32" },
  ]

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "id":
        return <span className="font-mono text-xs">{item.id}</span>
      case "type":
        return <Badge variant="outline">{item.type}</Badge>
      case "change":
        return (
          <Badge variant={item.change === "入库" ? "default" : "secondary"}>
            {item.change === "入库" ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {item.change}
          </Badge>
        )
      case "product":
        return (
          <div className="space-y-1">
            <div className="text-sm font-medium">{item.product}</div>
            <div className="text-xs text-muted-foreground">
              {item.category} · {item.unit}
            </div>
          </div>
        )
      case "quantity":
        return <span className="font-semibold">{item.quantity}</span>
      case "total":
        return <span className="font-semibold text-primary">¥{item.total.toFixed(2)}</span>
      default:
        return item[key]
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">仓库报表</h1>
        <p className="mt-2 text-muted-foreground">查看商品入库、出库相关进出库报表数据</p>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar>
        <DateRangePicker />
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="选择门店" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部门店</SelectItem>
            <SelectItem value="store1">巨嗨KTV</SelectItem>
            <SelectItem value="store2">KTV旗舰店</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="仓库" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部仓库</SelectItem>
            <SelectItem value="warehouse1">总仓</SelectItem>
            <SelectItem value="warehouse2">超市仓</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="单据类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="sale">订单销售</SelectItem>
            <SelectItem value="purchase">采购进货</SelectItem>
            <SelectItem value="inventory">库存盘点</SelectItem>
            <SelectItem value="transfer">库存调拨</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="库存变化" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="in">入库</SelectItem>
            <SelectItem value="out">出库</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="请输入商品名称" className="w-48" />
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button>查询</Button>
        </div>
      </FilterBar>

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
        <DataTable columns={columns} data={stockChanges} renderCell={renderCell} />
      </motion.div>
    </div>
  )
}
