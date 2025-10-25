"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Wine, Package, Clock, User, Phone, Download } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// 寄存管理数据
const storageItems = [
  {
    id: "JC1906051400347646617",
    code: "000009",
    store: "巨嗨测试1",
    storageTime: "2019-06-05 14:00",
    expiryTime: "2019-07-15 14:00",
    customerName: "郭亮",
    wechatName: "戴guo",
    phone: "13123364670",
    status: "有效",
  },
  {
    id: "JC1906051359869649288",
    code: "000008",
    store: "巨嗨测试1",
    storageTime: "2019-06-05 13:59",
    expiryTime: "2019-06-16 13:59",
    customerName: "郭亮",
    wechatName: "戴guo",
    phone: "13123364670",
    status: "有效",
  },
  {
    id: "JC1906051355651920738",
    code: "000007",
    store: "巨嗨测试1",
    storageTime: "2019-06-05 13:55",
    expiryTime: "2019-07-16 13:46",
    customerName: "郭亮",
    wechatName: "戴guo",
    phone: "13123364670",
    status: "配送中",
  },
]

export default function StoragePage() {
  const [filters, setFilters] = useState({
    store: "all",
    phone: "",
  })

  const columns = [
    { key: "code", label: "存酒码", width: "w-24" },
    { key: "id", label: "存酒单号", width: "w-48" },
    { key: "store", label: "门店", width: "w-32" },
    { key: "time", label: "寄存时间", width: "w-40" },
    { key: "expiry", label: "到期时间", width: "w-40" },
    { key: "customer", label: "客户信息", width: "w-48" },
    { key: "status", label: "状态", width: "w-24" },
    { key: "actions", label: "操作", width: "w-24" },
  ]

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "code":
        return (
          <Badge variant="outline" className="font-mono">
            {item.code}
          </Badge>
        )
      case "id":
        return <span className="font-mono text-xs">{item.id}</span>
      case "time":
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{item.storageTime}</span>
          </div>
        )
      case "expiry":
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-orange-500" />
            <span className="text-sm">{item.expiryTime}</span>
          </div>
        )
      case "customer":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{item.customerName}</span>
              <span className="text-xs text-muted-foreground">({item.wechatName})</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.phone}</span>
            </div>
          </div>
        )
      case "status":
        return (
          <Badge variant={item.status === "有效" ? "default" : item.status === "配送中" ? "secondary" : "destructive"}>
            {item.status}
          </Badge>
        )
      case "actions":
        return (
          <Button variant="ghost" size="sm">
            详情
          </Button>
        )
      default:
        return item[key]
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">寄存管理</h1>
        <p className="mt-2 text-muted-foreground">管理客户酒水寄存信息，查看寄存状态和到期时间</p>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar>
        <DateRangePicker />
        <Select value={filters.store} onValueChange={(value) => setFilters({ ...filters, store: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="选择门店" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部门店</SelectItem>
            <SelectItem value="store1">巨嗨测试1</SelectItem>
            <SelectItem value="store2">KTV旗舰店</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="请输入手机号"
          value={filters.phone}
          onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
          className="w-48"
        />
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
              <CardTitle className="text-sm font-medium text-muted-foreground">寄存总数</CardTitle>
              <Wine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">当前寄存商品数</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">有效寄存</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">198</div>
              <p className="text-xs text-muted-foreground">未到期寄存</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">即将到期</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">32</div>
              <p className="text-xs text-muted-foreground">7天内到期</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">已取出</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">15</div>
              <p className="text-xs text-muted-foreground">本月取出数量</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <DataTable columns={columns} data={storageItems} renderCell={renderCell} />
      </motion.div>
    </div>
  )
}
