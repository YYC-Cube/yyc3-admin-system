"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Eye, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// 领用单管理页面
export default function RequisitionPage() {
  const [requisitions, setRequisitions] = useState([
    {
      id: "RQ001",
      storeId: "store_1",
      storeName: "巨嗨KTV",
      warehouseId: "wh_1",
      warehouseName: "总仓",
      operatorId: "emp_1",
      operatorName: "张三",
      recipientId: "emp_2",
      recipientName: "李四",
      totalQuantity: 15,
      status: "approved",
      remark: "前台日常用品",
      createdAt: "2025-01-15 14:30:00",
      items: [
        { productId: "p1", productName: "A4纸", quantity: 10, unit: "包", remark: "办公用" },
        { productId: "p2", productName: "签字笔", quantity: 5, unit: "支", remark: "前台用" },
      ],
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequisition, setSelectedRequisition] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const filteredRequisitions = requisitions.filter(
    (req) =>
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.storeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetail = (requisition: any) => {
    setSelectedRequisition(requisition)
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
          <h1 className="text-3xl font-bold">领用单</h1>
          <p className="text-muted-foreground mt-1">管理员工物品领用记录</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新增领用单
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
            <CardTitle className="text-sm font-medium">总领用单数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requisitions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待审核</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requisitions.filter((r) => r.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已审核</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requisitions.filter((r) => r.status === "approved").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总领用数量</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requisitions.reduce((sum, r) => sum + r.totalQuantity, 0)}</div>
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
                placeholder="搜索领用单号、门店..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 领用单列表 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>领用单列表 ({filteredRequisitions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>领用单号</TableHead>
                  <TableHead>门店</TableHead>
                  <TableHead>仓库</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>领用人</TableHead>
                  <TableHead>领用数量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequisitions.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.id}</TableCell>
                    <TableCell>{req.storeName}</TableCell>
                    <TableCell>{req.warehouseName}</TableCell>
                    <TableCell>{req.operatorName}</TableCell>
                    <TableCell>{req.recipientName}</TableCell>
                    <TableCell>{req.totalQuantity}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>{req.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(req)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {req.status === "pending" && (
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
            <DialogTitle>领用单详情</DialogTitle>
            <DialogDescription>查看领用单的详细信息</DialogDescription>
          </DialogHeader>
          {selectedRequisition && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">领用单号</p>
                  <p className="font-medium">{selectedRequisition.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">门店</p>
                  <p className="font-medium">{selectedRequisition.storeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">仓库</p>
                  <p className="font-medium">{selectedRequisition.warehouseName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">领用人</p>
                  <p className="font-medium">{selectedRequisition.recipientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">备注</p>
                  <p className="font-medium">{selectedRequisition.remark}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">状态</p>
                  <div className="mt-1">{getStatusBadge(selectedRequisition.status)}</div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">领用商品明细</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>商品名称</TableHead>
                      <TableHead>数量</TableHead>
                      <TableHead>单位</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRequisition.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.remark}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 新增领用单对话框 */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增领用单</DialogTitle>
            <DialogDescription>创建新的物品领用单</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>门店 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择门店" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="store_1">巨嗨KTV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>仓库 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择仓库" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wh_1">总仓</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>领用人 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择领用人" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emp_1">张三</SelectItem>
                    <SelectItem value="emp_2">李四</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>备注</Label>
                <Input placeholder="请输入备注" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                toast.success("领用单创建成功")
                setIsAddOpen(false)
              }}
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
