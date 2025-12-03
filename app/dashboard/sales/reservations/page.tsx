"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Phone, User, MapPin, Eye } from "lucide-react"
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
    { 
      key: "id", 
      label: "预定单号", 
      width: "w-48",
      render: (id: string) => <span className="font-mono text-xs">{id}</span>
    },
    { key: "packageName", label: "套餐名称", width: "w-40" },
    { key: "orderTime", label: "下单时间", width: "w-40" },
    { key: "arrivalTime", label: "到店时间", width: "w-40" },
    { 
      key: "customerName", 
      label: "预定信息", 
      width: "w-48",
      render: (customerName: string, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{row.phone}</span>
          </div>
        </div>
      )
    },
    { 
      key: "amount", 
      label: "实收金额", 
      width: "w-28",
      render: (amount: number) => <span className="font-semibold text-primary">¥{amount?.toFixed(2) || '0.00'}</span>
    },
    { 
      key: "status", 
      label: "使用状态", 
      width: "w-28",
      render: (status: string) => (
        <Badge
          variant={
            status === "未使用"
              ? "default"
              : status === "已使用"
              ? "secondary"
              : "destructive"
          }
        >
          {status}
        </Badge>
      )
    },
    { 
      key: "actions", 
      label: "操作", 
      width: "w-24",
      render: () => (
        <button className="p-2 rounded-md hover:bg-muted transition-colors">
          <Eye className="h-4 w-4" />
        </button>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">在线预定</h1>
        <p className="mt-2 text-muted-foreground">管理客户在线预定信息，查看预定状态和详情</p>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar
        filters={[
          {
            label: "使用状态",
            options: [
              { label: "全部状态", value: "all" },
              { label: "未使用", value: "unused" },
              { label: "已使用", value: "used" },
              { label: "已取消", value: "cancelled" }
            ],
            onChange: (value: string) => setFilters({ ...filters, status: value })
          },
          {
            label: "订单来源",
            options: [
              { label: "全部来源", value: "all" },
              { label: "微信预定", value: "wechat" },
              { label: "支付宝预定", value: "alipay" },
              { label: "APP预定", value: "app" }
            ],
            onChange: (value: string) => setFilters({ ...filters, source: value })
          },
          {
            label: "预定单号",
            options: [],
            onChange: (value: string) => setFilters({ ...filters, orderNo: value })
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
        <DataTable columns={columns} data={reservations} />
      </motion.div>
    </div>
  )
}
