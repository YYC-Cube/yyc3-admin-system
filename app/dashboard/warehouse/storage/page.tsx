"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wine, Package, Clock, User, Phone } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"

// 寄存管理数据
const storageItems = [
  {
    id: "JC1906051400347646617",
    code: "000009",
    store: "启智",
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
    store: "启智",
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
    store: "启智",
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
    { 
      key: "code", 
      label: "存酒码", 
      width: "w-24",
      render: (code: string) => (
        <Badge variant="outline" className="font-mono">
          {code}
        </Badge>
      )
    },
    { 
      key: "id", 
      label: "存酒单号", 
      width: "w-48",
      render: (id: string) => <span className="font-mono text-xs">{id}</span>
    },
    { key: "store", label: "门店", width: "w-32" },
    { 
      key: "storageTime", 
      label: "寄存时间", 
      width: "w-40",
      render: (storageTime: string) => (
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{storageTime}</span>
        </div>
      )
    },
    { 
      key: "expiryTime", 
      label: "到期时间", 
      width: "w-40",
      render: (expiryTime: string) => (
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-orange-500" />
          <span className="text-sm">{expiryTime}</span>
        </div>
      )
    },
    { 
      key: "customerName", 
      label: "客户信息", 
      width: "w-48",
      render: (customerName: string, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{customerName}</span>
            <span className="text-xs text-muted-foreground">({row.wechatName})</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{row.phone}</span>
          </div>
        </div>
      )
    },
    { 
      key: "status", 
      label: "状态", 
      width: "w-24",
      render: (status: string) => (
        <Badge variant={status === "有效" ? "default" : status === "配送中" ? "secondary" : "destructive"}>
          {status}
        </Badge>
      )
    },
    { 
      key: "actions", 
      label: "操作", 
      width: "w-24",
      render: () => (
        <Button variant="ghost" size="sm">
          详情
        </Button>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">寄存管理</h1>
        <p className="mt-2 text-muted-foreground">管理客户酒水寄存信息，查看寄存状态和到期时间</p>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar 
        filters={[
          {
            label: "日期范围",
            options: [],
            onChange: (value: string) => console.log("日期范围变化:", value)
          },
          {
            label: "门店",
            options: [
              { label: "全部门店", value: "all" },
              { label: "启智", value: "store1" },
              { label: "KTV旗舰店", value: "store2" }
            ],
            onChange: (value: string) => setFilters({ ...filters, store: value })
          },
          {
            label: "手机号",
            options: [],
            onChange: (value: string) => setFilters({ ...filters, phone: value })
          }
        ]}
        onSearch={() => console.log("搜索:", filters)}
      />

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
        <DataTable columns={columns} data={storageItems} />
      </motion.div>
    </div>
  )
}
