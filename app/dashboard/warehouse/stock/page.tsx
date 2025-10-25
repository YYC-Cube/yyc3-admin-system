"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, AlertTriangle, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// 模拟库存数据
const stockData = [
  {
    id: "1",
    store: "巨嗨KTV",
    warehouse: "超市仓",
    name: "青岛纯生330ml",
    category: "啤酒",
    unit: "瓶",
    stock: 216,
    costPrice: "15.00",
    totalCost: "3240.00",
    minStock: 100,
    isSale: true,
  },
  {
    id: "2",
    store: "巨嗨KTV",
    warehouse: "超市仓",
    name: "JELLYBIRD果冻酒36gx2",
    category: "休闲食品",
    unit: "个",
    stock: 46,
    costPrice: "8.00",
    totalCost: "368.00",
    minStock: 50,
    isSale: true,
  },
  {
    id: "3",
    store: "巨嗨KTV",
    warehouse: "厨房仓",
    name: "小果盘",
    category: "果盘",
    unit: "份",
    stock: 12,
    costPrice: "20.00",
    totalCost: "240.00",
    minStock: 10,
    isSale: true,
  },
]

export default function StockPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // 计算统计数据
  const totalStock = stockData.reduce((sum, item) => sum + item.stock, 0)
  const totalCost = stockData.reduce((sum, item) => sum + Number.parseFloat(item.totalCost), 0)
  const lowStockCount = stockData.filter((item) => item.stock < item.minStock).length

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">实时库存</h1>
        <p className="mt-2 text-muted-foreground">查看和管理所有仓库的实时库存情况</p>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">库存总量</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{totalStock}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Package className="h-6 w-6 text-blue-600" />
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
                  <p className="mt-2 text-2xl font-bold text-foreground">¥{totalCost.toFixed(2)}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <Package className="h-6 w-6 text-emerald-600" />
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
                  <p className="text-sm text-muted-foreground">库存预警</p>
                  <p className="mt-2 text-2xl font-bold text-destructive">{lowStockCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 筛选和搜索 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="选择门店" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部门店</SelectItem>
                  <SelectItem value="store1">巨嗨KTV</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="选择仓库" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部仓库</SelectItem>
                  <SelectItem value="warehouse1">超市仓</SelectItem>
                  <SelectItem value="warehouse2">厨房仓</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="商品类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="beer">啤酒</SelectItem>
                  <SelectItem value="snack">休闲食品</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索商品名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button>
                <Search className="mr-2 h-4 w-4" />
                查询
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                导出
              </Button>
              <Button variant="outline" className="text-destructive bg-transparent">
                <AlertTriangle className="mr-2 h-4 w-4" />
                缺货查询
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 库存表格 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>库存明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>门店</TableHead>
                    <TableHead>仓库</TableHead>
                    <TableHead>商品名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>单位</TableHead>
                    <TableHead>实时库存</TableHead>
                    <TableHead>成本单价</TableHead>
                    <TableHead>成本总额</TableHead>
                    <TableHead>最小库存</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    >
                      <TableCell>{item.store}</TableCell>
                      <TableCell>{item.warehouse}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Badge variant={item.stock >= item.minStock ? "default" : "destructive"}>{item.stock}</Badge>
                      </TableCell>
                      <TableCell>¥{item.costPrice}</TableCell>
                      <TableCell className="font-medium">¥{item.totalCost}</TableCell>
                      <TableCell className="text-muted-foreground">{item.minStock}</TableCell>
                      <TableCell>
                        {item.stock < item.minStock ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            库存不足
                          </Badge>
                        ) : (
                          <Badge variant="default">正常</Badge>
                        )}
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
