"use client"

import { motion } from "framer-motion"
import { Download, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 模拟销售明细数据
const salesData = [
  {
    id: "1",
    time: "2019-01-08 11:19",
    orderNo: "D108175561882149",
    type: "续时",
    payType: "自定义支付类型2",
    store: "巨嗨KTV",
    room: "5314",
    operator: "启智网络",
    category: "酒水套餐",
    product: "酒水套餐",
    unit: "份",
    quantity: 1,
    price: "0.01",
    cost: "6.00",
    total: "0.01",
    costTotal: "6.00",
    profit: "-5.99",
  },
  {
    id: "2",
    time: "2019-01-08 10:36",
    orderNo: "D108149772286496",
    type: "续时",
    payType: "现金",
    store: "巨嗨KTV",
    room: "9527",
    operator: "希尔瓦娜斯",
    category: "酒水套餐",
    product: "9904酒水套餐",
    unit: "份",
    quantity: 1,
    price: "100.00",
    cost: "8.00",
    total: "100.00",
    costTotal: "8.00",
    profit: "92.00",
  },
]

export default function BusinessReportPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">营业报表</h1>
        <p className="mt-2 text-muted-foreground">查看和分析门店营业数据</p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">销售总额</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">¥11,718.86</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">成本总额</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">¥67,890.20</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                  <ShoppingBag className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">利润总额</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">¥-59,123.15</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">销售数量</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">865</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 报表标签页 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales">商品销售明细</TabsTrigger>
            <TabsTrigger value="summary">商品销售汇总</TabsTrigger>
            <TabsTrigger value="profit">销售盈利报表</TabsTrigger>
            <TabsTrigger value="income">营业收入报表</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            {/* 筛选区域 */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">时间范围</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">消费门店</label>
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
                    <label className="text-sm font-medium">商品类型</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部类型</SelectItem>
                        <SelectItem value="package">酒水套餐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button className="flex-1">查询</Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 销售明细表格 */}
            <Card>
              <CardHeader>
                <CardTitle>商品销售明细</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>支付时间</TableHead>
                        <TableHead>订单编号</TableHead>
                        <TableHead>门店</TableHead>
                        <TableHead>包厢</TableHead>
                        <TableHead>商品名称</TableHead>
                        <TableHead>数量</TableHead>
                        <TableHead>单价</TableHead>
                        <TableHead>成本</TableHead>
                        <TableHead>销售额</TableHead>
                        <TableHead>利润</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <TableCell className="text-sm text-muted-foreground">{item.time}</TableCell>
                          <TableCell className="font-mono text-sm">{item.orderNo}</TableCell>
                          <TableCell>{item.store}</TableCell>
                          <TableCell>{item.room}</TableCell>
                          <TableCell className="font-medium">{item.product}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>¥{item.price}</TableCell>
                          <TableCell>¥{item.cost}</TableCell>
                          <TableCell className="font-medium">¥{item.total}</TableCell>
                          <TableCell
                            className={Number.parseFloat(item.profit) >= 0 ? "text-emerald-600" : "text-destructive"}
                          >
                            ¥{item.profit}
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardContent className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">商品销售汇总报表</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profit">
            <Card>
              <CardContent className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">销售盈利报表</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardContent className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">营业收入报表</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
