"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, Eye, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// 模拟订单数据
const orders = [
  {
    id: "CC02194467450499",
    store: "巨嗨KTV",
    room: "5100",
    amount: "1.00",
    paid: "1.00",
    refund: "0.00",
    time: "2018-12-02 10:57:26",
    type: "开房套餐",
    payType: "会员",
    status: "已付款",
    source: "自助下单",
  },
  {
    id: "CC02189254211014",
    store: "巨嗨KTV",
    room: "5100",
    amount: "0.01",
    paid: "0.01",
    refund: "0.00",
    time: "2018-12-02 10:48:45",
    type: "开房套餐",
    payType: "会员",
    status: "已付款",
    source: "自助下单",
  },
  {
    id: "CB29790273903364",
    store: "巨嗨KTV",
    room: "BBS",
    amount: "0.02",
    paid: "0.01",
    refund: "0.00",
    time: "2018-11-29 16:10:27",
    type: "酒水订单",
    payType: "会员",
    status: "已付款",
    source: "自助下单",
  },
]

// 订单列表页面
export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">订单列表</h1>
        <p className="mt-2 text-muted-foreground">查看和管理所有销售订单</p>
      </motion.div>

      {/* 筛选和搜索区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">时间范围</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">消费门店</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部门店</SelectItem>
                    <SelectItem value="store1">巨嗨KTV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">订单类型</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="room">开房套餐</SelectItem>
                    <SelectItem value="drink">酒水订单</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">支付状态</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="paid">已付款</SelectItem>
                    <SelectItem value="pending">待付款</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索订单编号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  查询
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  导出
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 统计信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">消费金额</div>
            <div className="mt-2 text-2xl font-bold text-foreground">¥3,008.16</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">实收金额</div>
            <div className="mt-2 text-2xl font-bold text-emerald-600">¥2,695.14</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">退款总额</div>
            <div className="mt-2 text-2xl font-bold text-destructive">¥0.00</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 订单表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>订单记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单编号</TableHead>
                    <TableHead>门店</TableHead>
                    <TableHead>包厢</TableHead>
                    <TableHead>消费金额</TableHead>
                    <TableHead>实收金额</TableHead>
                    <TableHead>下单时间</TableHead>
                    <TableHead>订单类型</TableHead>
                    <TableHead>支付状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      className="group"
                    >
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell>{order.store}</TableCell>
                      <TableCell>{order.room}</TableCell>
                      <TableCell>¥{order.amount}</TableCell>
                      <TableCell className="font-medium text-emerald-600">¥{order.paid}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.time}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
