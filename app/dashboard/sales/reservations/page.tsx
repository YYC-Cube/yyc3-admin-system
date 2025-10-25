"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Phone, User, MapPin, Download, Eye } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"

// 在线预定数据
const reservations = [
  {
    id: "YD1812261140619452784",
    roomType: "小包",
    packageName: "实惠团购套餐",
    orderTime: "2018-12-26 11:40",
    arrivalTime: "2018-12-26 12:30",
    customerName: "雪舞纷飞",
    phone: "15960296877",
    amount: 0.01,
    refund: 0.0,
    source: "微信预定",
    status: "未使用",
  },
  {
    id: "YD1812241739994441137",
    roomType: "VIP包",
    packageName: "实惠开房套餐",
    orderTime: "2018-12-24 17:39",
    arrivalTime: "2018-12-25 11:30",
    customerName: "李明",
    phone: "18950177190",
    amount: 7.5,
    refund: 0.0,
    source: "微信预定",
    status: "未使用",
  },
  {
    id: "YD1812181508307118597",
    roomType: "PT包",
    packageName: "七夕特惠",
    orderTime: "2018-12-18 15:08",
    arrivalTime: "2018-12-18 21:30",
    customerName: "贝壳",
    phone: "18876319329",
    amount: 0.0,
    refund: 1.0,
    source: "微信预定",
    status: "已取消",
  },
]

export default function ReservationsPage() {
  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    orderNo: "",
  })

  const columns = [
    { key: "roomType", label: "包厢类型", width: "w-24" },
    { key: "orderNo", label: "预定单号", width: "w-48" },
    { key: "packageName", label: "套餐名称", width: "w-40" },
    { key: "orderTime", label: "下单时间", width: "w-40" },
    { key: "arrivalTime", label: "到店时间", width: "w-40" },
    { key: "customer", label: "预定信息", width: "w-48" },
    { key: "amount", label: "实收金额", width: "w-28" },
    { key: "status", label: "使用状态", width: "w-28" },
    { key: "actions", label: "操作", width: "w-24" },
  ]

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "orderNo":
        return <span className="font-mono text-xs">{item.id}</span>
      case "customer":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{item.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.phone}</span>
            </div>
          </div>
        )
      case "amount":
        return <span className="font-semibold text-primary">¥{item.amount.toFixed(2)}</span>
      case "status":
        return (
          <Badge
            variant={item.status === "未使用" ? "default" : item.status === "已使用" ? "secondary" : "destructive"}
          >
            {item.status}
          </Badge>
        )
      case "actions":
        return (
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
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
        <h1 className="text-3xl font-bold text-foreground">在线预定</h1>
        <p className="mt-2 text-muted-foreground">管理客户在线预定信息，查看预定状态和详情</p>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar>
        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="使用状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="unused">未使用</SelectItem>
            <SelectItem value="used">已使用</SelectItem>
            <SelectItem value="cancelled">已取消</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="订单来源" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部来源</SelectItem>
            <SelectItem value="wechat">微信预定</SelectItem>
            <SelectItem value="alipay">支付宝预定</SelectItem>
            <SelectItem value="app">APP预定</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="请输入预定单号"
          value={filters.orderNo}
          onChange={(e) => setFilters({ ...filters, orderNo: e.target.value })}
          className="w-64"
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
              <CardTitle className="text-sm font-medium text-muted-foreground">总预定数</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">本月预定总数</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">未使用</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">45</div>
              <p className="text-xs text-muted-foreground">待到店使用</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">已使用</CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">98</div>
              <p className="text-xs text-muted-foreground">已到店消费</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">预定金额</CardTitle>
              <Phone className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">¥8,550</div>
              <p className="text-xs text-muted-foreground">本月预定总额</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <DataTable columns={columns} data={reservations} renderCell={renderCell} />
      </motion.div>
    </div>
  )
}
