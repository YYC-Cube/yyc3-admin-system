"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Eye, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// 报损单管理页面
export default function DamageReportsPage() {
  const [reports, setReports] = useState([
    {
      id: "DR001",
      storeId: "store_1",
      storeName: "巨嗨KTV",
      warehouseId: "wh_1",
      warehouseName: "总仓",
      operatorId: "emp_1",
      operatorName: "张三",
      totalQuantity: 10,
      totalAmount: 500,
      reason: "商品过期",
      status: "approved",
      createdAt: "2025-01-15 10:30:00",
      items: [
        { productId: "p1", productName: "青岛啤酒", quantity: 5, unitPrice: 50, amount: 250 },
        { productId: "p2", productName: "可口可乐", quantity: 5, unitPrice: 50, amount: 250 },
      ],
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const filteredReports = reports.filter(
    (report) =>
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.storeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetail = (report: any) => {
    setSelectedReport(report)
    setIsDetailOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      pending: { label: "待审核", variant: "secondary" },
      approved: { label: "已审核", variant: "default" },
      rejected: { label: "已拒绝", variant: "destructive" },
    }
    const config = statusMap[status] || statusMap.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">报损单</h1>
          <p className="text-muted-foreground mt-1">管理商品报损记录</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新增报损单
        </Button>
      </motion.div>

      {/* 统计卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总报损单数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待审核</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已审核</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter((r) => r.status === "approved").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">报损总额</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{reports.reduce((sum, r) => sum + r.totalAmount, 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 搜索栏 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索报损单号、门店..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 报损单列表 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>报损单列表 ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>报损单号</TableHead>
                  <TableHead>门店</TableHead>
                  <TableHead>仓库</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>报损数量</TableHead>
                  <TableHead>报损金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.storeName}</TableCell>
                    <TableCell>{report.warehouseName}</TableCell>
                    <TableCell>{report.operatorName}</TableCell>
                    <TableCell>{report.totalQuantity}</TableCell>
                    <TableCell>¥{report.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>{report.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(report)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === "pending" && (
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* 详情对话框 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>报损单详情</DialogTitle>
            <DialogDescription>查看报损单的详细信息</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">报损单号</p>
                  <p className="font-medium">{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">门店</p>
                  <p className="font-medium">{selectedReport.storeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">仓库</p>
                  <p className="font-medium">{selectedReport.warehouseName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">操作人</p>
                  <p className="font-medium">{selectedReport.operatorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">报损原因</p>
                  <p className="font-medium">{selectedReport.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">状态</p>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">报损商品明细</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>商品名称</TableHead>
                      <TableHead>数量</TableHead>
                      <TableHead>单价</TableHead>
                      <TableHead>金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReport.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>¥{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>¥{item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
