"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Save, Printer, Clock, DollarSign, Package } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export default function BillingCreatePage() {
  const [billItems, setBillItems] = useState([
    {
      id: 1,
      name: "团购套餐",
      type: "套餐",
      quantity: 1,
      price: 45.0,
      amount: 45.0,
    },
  ])

  const [paymentRecords, setPaymentRecords] = useState([
    {
      id: 1,
      method: "团购",
      amount: 45.0,
    },
  ])

  const totalAmount = billItems.reduce((sum, item) => sum + item.amount, 0)
  const paidAmount = paymentRecords.reduce((sum, record) => sum + record.amount, 0)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-bold text-foreground">账单制作</h1>
        <p className="mt-2 text-muted-foreground">创建和编辑账单，支持修改消费时间、商品和付款金额</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左侧：账单列表 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>账单列表</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    只保留开房套餐
                  </Button>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    查询
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 筛选条件 */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>时间范围</Label>
                    <DateRangePicker />
                  </div>
                  <div className="space-y-2">
                    <Label>门店</Label>
                    <Select defaultValue="store1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store1">巨嗨测试1</SelectItem>
                        <SelectItem value="store2">KTV旗舰店</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>支付类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择支付类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="wechat">微信</SelectItem>
                        <SelectItem value="alipay">支付宝</SelectItem>
                        <SelectItem value="cash">现金</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* 账单表格 */}
                <div className="rounded-lg border">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">包厢</th>
                        <th className="p-3 text-left text-sm font-medium">账单号</th>
                        <th className="p-3 text-left text-sm font-medium">实收金额</th>
                        <th className="p-3 text-left text-sm font-medium">开房时间</th>
                        <th className="p-3 text-left text-sm font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t bg-primary/5">
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="text-sm font-medium">靠走廊</div>
                            <div className="text-xs text-muted-foreground">05</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-xs">ZD1907091507500936490</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-primary">¥45.00</span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">2019-07-09 15:07</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              修改
                            </Button>
                            <Button variant="ghost" size="sm">
                              删除
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 右侧：账单详情 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* 账单信息 */}
          <Card>
            <CardHeader>
              <CardTitle>账单详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">账单号</span>
                  <span className="font-mono text-xs">ZD1907091507500936490</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">消费门店</span>
                  <span>巨嗨测试1</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">消费包厢</span>
                  <Badge variant="outline">05</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">开房时间</span>
                  <span>2019-07-09 15:07</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">结束时间</span>
                  <span>2019-07-09 17:53</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">消费时长</span>
                  <Badge>2小时46分钟</Badge>
                </div>
              </div>

              <Separator />

              {/* 商品明细 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>商品明细</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-3 w-3" />
                    新增商品
                  </Button>
                </div>
                <div className="space-y-2">
                  {billItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>数量: {item.quantity}</span>
                          <span>单价: ¥{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">¥{item.amount.toFixed(2)}</span>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 付款记录 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>付款记录</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-1 h-3 w-3" />
                    新增付款
                  </Button>
                </div>
                <div className="space-y-2">
                  {paymentRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{record.method}</span>
                      </div>
                      <span className="font-semibold text-green-500">¥{record.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 金额汇总 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">消费金额</span>
                  <span className="font-semibold">¥{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">实收金额</span>
                  <span className="font-semibold text-primary">¥{paidAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-transparent" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  打印
                </Button>
                <Button className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
