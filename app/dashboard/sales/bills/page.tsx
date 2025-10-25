"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Receipt, Eye, Printer, Download } from "lucide-react"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// 模拟账单数据
const mockBills = [
  {
    id: "ZD1901041651326204612",
    store: "巨嗨KTV",
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
  },
  {
    id: "ZD1901031147303838854",
    store: "巨嗨KTV",
    room: "星际穿越",
    type: "最低消费套餐",
    amount: 0.01,
    paid: 0.01,
    refund: 0.0,
    reservation: "",
    invoice: "未开",
    invoiceAmount: 0.0,
    guarantor: "",
    time: "2019-01-03 11:47",
  },
  {
    id: "ZD1901022019641134346",
    store: "巨嗨KTV",
    room: "星际穿越",
    type: "包断",
    amount: 0.01,
    paid: 0.01,
    refund: 0.0,
    reservation: "",
    invoice: "未开",
    invoiceAmount: 0.0,
    guarantor: "",
    time: "2019-01-02 20:19",
  },
]

export default function BillsPage() {
  const [selectedBill, setSelectedBill] = useState<any>(null)

  const columns = [
    { key: "id", label: "账单号" },
    { key: "store", label: "消费门店" },
    { key: "room", label: "消费包厢" },
    {
      key: "type",
      label: "开房类型",
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: "amount",
      label: "消费金额",
      render: (value: number) => <span className="font-medium">¥{value.toFixed(2)}</span>,
    },
    {
      key: "paid",
      label: "实收金额",
      render: (value: number) => <span className="font-semibold text-green-600">¥{value.toFixed(2)}</span>,
    },
    { key: "time", label: "时间" },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Receipt className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">账单列表</h1>
          <p className="text-sm text-muted-foreground">查看和管理所有账单记录</p>
        </div>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar
        searchPlaceholder="搜索账单号、包厢号..."
        showDateRange
        onExport={() => console.log("导出账单")}
        filters={[
          {
            label: "消费门店",
            options: [
              { label: "全部门店", value: "all" },
              { label: "巨嗨KTV", value: "juhai" },
              { label: "KTV旗舰店", value: "flagship" },
            ],
            onChange: (value) => console.log("门店筛选:", value),
          },
          {
            label: "开房类型",
            options: [
              { label: "全部类型", value: "all" },
              { label: "计时开房", value: "hourly" },
              { label: "包断", value: "package" },
              { label: "最低消费", value: "minimum" },
            ],
            onChange: (value) => console.log("类型筛选:", value),
          },
        ]}
      />

      {/* 数据表格 */}
      <DataTable
        columns={columns}
        data={mockBills}
        onRowClick={(bill) => setSelectedBill(bill)}
        actions={(bill) => (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setSelectedBill(bill)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log("打印账单:", bill.id)}>
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {/* 账单详情对话框 */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>账单详情</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">账单号</p>
                  <p className="font-mono text-sm font-medium">{selectedBill.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">消费门店</p>
                  <p className="font-medium">{selectedBill.store}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">消费包厢</p>
                  <p className="font-medium">{selectedBill.room}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">开房类型</p>
                  <Badge variant="outline">{selectedBill.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">消费金额</p>
                  <p className="text-lg font-semibold">¥{selectedBill.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">实收金额</p>
                  <p className="text-lg font-semibold text-green-600">¥{selectedBill.paid.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Printer className="mr-2 h-4 w-4" />
                  打印账单
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  下载账单
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
