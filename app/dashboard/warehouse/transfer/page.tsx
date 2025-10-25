"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, ArrowRightLeft, Package, Warehouse, TrendingUp } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DateRangePicker } from "@/components/ui/date-range-picker"

// 库存调拨数据
const transfers = [
  {
    id: "DB1906031538082862059",
    date: "2019-06-03 15:37",
    fromStore: "巨嗨测试1",
    fromWarehouse: "总仓",
    toStore: "巨嗨测试1",
    toWarehouse: "超市仓",
    quantity: 50,
    operator: "林小软",
  },
]

export default function TransferPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  const columns = [
    { key: "id", label: "调拨单号", width: "w-48" },
    { key: "date", label: "调拨日期", width: "w-40" },
    { key: "from", label: "调出信息", width: "w-48" },
    { key: "to", label: "调入信息", width: "w-48" },
    { key: "quantity", label: "调拨数量", width: "w-28" },
    { key: "operator", label: "操作人", width: "w-28" },
    { key: "actions", label: "操作", width: "w-24" },
  ]

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "id":
        return <span className="font-mono text-xs">{item.id}</span>
      case "from":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{item.fromStore}</span>
            </div>
            <div className="flex items-center gap-2">
              <Warehouse className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.fromWarehouse}</span>
            </div>
          </div>
        )
      case "to":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{item.toStore}</span>
            </div>
            <div className="flex items-center gap-2">
              <Warehouse className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{item.toWarehouse}</span>
            </div>
          </div>
        )
      case "quantity":
        return <Badge variant="secondary">{item.quantity}</Badge>
      case "actions":
        return (
          <Button variant="ghost" size="sm">
            详情
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">库存调拨</h1>
            <p className="mt-2 text-muted-foreground">管理门店间或仓库间的商品调拨，支持跨门店调拨</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新增调拨单
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>新增库存调拨单</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>调出门店</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择调出门店" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store1">巨嗨测试1</SelectItem>
                        <SelectItem value="store2">KTV旗舰店</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>调出仓库</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择调出仓库" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warehouse1">总仓</SelectItem>
                        <SelectItem value="warehouse2">超市仓</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>调入门店</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择调入门店" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store1">巨嗨测试1</SelectItem>
                        <SelectItem value="store2">KTV旗舰店</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>调入仓库</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择调入仓库" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warehouse1">总仓</SelectItem>
                        <SelectItem value="warehouse2">超市仓</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>调拨商品</Label>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-1 h-3 w-3" />
                      添加商品
                    </Button>
                  </div>
                  <div className="rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-3 text-left text-sm font-medium">商品名称</th>
                          <th className="p-3 text-left text-sm font-medium">单位</th>
                          <th className="p-3 text-left text-sm font-medium">类型</th>
                          <th className="p-3 text-left text-sm font-medium">调拨数量</th>
                          <th className="p-3 text-left text-sm font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                              暂无商品，请点击"添加商品"按钮
                            </td>
                          </tr>
                        ) : (
                          selectedProducts.map((product, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3 text-sm">{product.name}</td>
                              <td className="p-3 text-sm">{product.unit}</td>
                              <td className="p-3 text-sm">{product.type}</td>
                              <td className="p-3">
                                <Input type="number" className="w-20" defaultValue={1} />
                              </td>
                              <td className="p-3">
                                <Button variant="ghost" size="sm">
                                  删除
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    返回
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>保存</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar>
        <DateRangePicker />
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="调出门店" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部门店</SelectItem>
            <SelectItem value="store1">巨嗨测试1</SelectItem>
            <SelectItem value="store2">KTV旗舰店</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="调出仓库" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部仓库</SelectItem>
            <SelectItem value="warehouse1">总仓</SelectItem>
            <SelectItem value="warehouse2">超市仓</SelectItem>
          </SelectContent>
        </Select>
        <Button className="ml-auto">查询</Button>
      </FilterBar>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">本月调拨</CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">调拨单数量</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">调拨商品</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">2,345</div>
              <p className="text-xs text-muted-foreground">商品总数量</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">调拨金额</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">¥67,890</div>
              <p className="text-xs text-muted-foreground">商品总价值</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <DataTable columns={columns} data={transfers} renderCell={renderCell} />
      </motion.div>
    </div>
  )
}
