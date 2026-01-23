"use client"

import { motion } from "framer-motion"
// 移除未使用的导入
import { Receipt, Printer, Download, ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

/**
 * @file 账单查看页面
 * @description 查看账单详细信息，支持打印和下载操作
 * @module dashboard/billing/view
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-15
 */

export default function BillingViewPage() {
  const router = useRouter()
  
  // 模拟账单数据 - 实际应该从API或props获取
  const billDetails = {
    id: "ZD1901041651326204612",
    store: "启智",
    room: "星际穿越",
    type: "计时开房",
    amount: 12460.0,
    paid: 12460.0,
    refund: 0.0,
    reservation: "",
    invoice: "未开",
    invoiceAmount: 0.0,
    guarantor: "",
    time: "2019-01-04 16:51",
    items: [
      {
        id: 1,
        name: "房费",
        quantity: 1,
        price: 12000.0,
        amount: 12000.0
      },
      {
        id: 2,
        name: "服务费",
        quantity: 1,
        price: 460.0,
        amount: 460.0
      }
    ],
    payments: [
      {
        id: 1,
        method: "微信支付",
        amount: 12460.0
      }
    ]
  }

  const handlePrintBill = () => {
    console.log("打印账单:", billDetails.id)
    // 实现打印逻辑
  }

  const handleDownloadBill = () => {
    console.log("下载账单:", billDetails.id)
    // 实现下载逻辑
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和返回 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">账单详情</h1>
          <p className="text-sm text-muted-foreground">查看账单的详细信息</p>
        </div>
      </motion.div>

      {/* 账单基本信息 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              账单信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">账单号</p>
                <p className="font-mono text-sm font-medium mt-1">{billDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">消费门店</p>
                <p className="font-medium mt-1">{billDetails.store}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">消费包厢</p>
                <p className="font-medium mt-1">{billDetails.room}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">开房类型</p>
                <Badge variant="outline" className="mt-1">{billDetails.type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">消费金额</p>
                <p className="text-lg font-semibold mt-1">¥{billDetails.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">实收金额</p>
                <p className="text-lg font-semibold text-green-600 mt-1">¥{billDetails.paid.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">消费时间</p>
                <p className="font-medium mt-1">{billDetails.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">发票状态</p>
                <Badge 
                  variant={billDetails.invoice === "未开" ? "outline" : "secondary"} 
                  className="mt-1"
                >
                  {billDetails.invoice}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 消费明细 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>消费明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium">商品名称</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">数量</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">单价</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">金额</th>
                  </tr>
                </thead>
                <tbody>
                  {billDetails.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4 text-sm">{item.name}</td>
                      <td className="py-3 px-4 text-sm">{item.quantity}</td>
                      <td className="py-3 px-4 text-sm">¥{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm font-medium">¥{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-3 px-4 text-sm font-medium text-right">合计</td>
                    <td className="py-3 px-4 text-sm font-bold">¥{billDetails.amount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 支付记录 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>支付记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium">支付方式</th>
                    <th className="text-left py-3 px-4 text-sm font-medium">支付金额</th>
                  </tr>
                </thead>
                <tbody>
                  {billDetails.payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-3 px-4 text-sm">{payment.method}</td>
                      <td className="py-3 px-4 text-sm font-medium">¥{payment.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-3 px-4 text-sm font-medium text-right">实付金额</td>
                    <td className="py-3 px-4 text-sm font-bold text-green-600">¥{billDetails.paid.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 操作按钮 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4 justify-end"
      >
        <Button variant="outline" onClick={handleDownloadBill}>
          <Download className="mr-2 h-4 w-4" />
          下载账单
        </Button>
        <Button onClick={handlePrintBill}>
          <Printer className="mr-2 h-4 w-4" />
          打印账单
        </Button>
      </motion.div>
    </div>
  )
}
