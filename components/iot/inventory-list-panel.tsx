"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Package, MapPin, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { InventoryStatus } from "@/lib/iot/smart-inventory-system"

interface InventoryItem {
  productId: string
  productName: string
  category: string
  quantity: number
  unit: string
  location: string
  status: InventoryStatus
  minThreshold: number
  lastUpdated: number
}

export function InventoryListPanel() {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      productId: "PROD_001",
      productName: "茅台飞天53度500ml",
      category: "白酒",
      quantity: 45,
      unit: "瓶",
      location: "A区-01货架",
      status: InventoryStatus.IN_STOCK,
      minThreshold: 20,
      lastUpdated: Date.now(),
    },
    {
      productId: "PROD_002",
      productName: "五粮液52度500ml",
      category: "白酒",
      quantity: 15,
      unit: "瓶",
      location: "A区-02货架",
      status: InventoryStatus.LOW_STOCK,
      minThreshold: 20,
      lastUpdated: Date.now(),
    },
    {
      productId: "PROD_003",
      productName: "青岛啤酒330ml",
      category: "啤酒",
      quantity: 0,
      unit: "瓶",
      location: "B区-01货架",
      status: InventoryStatus.OUT_OF_STOCK,
      minThreshold: 50,
      lastUpdated: Date.now(),
    },
    {
      productId: "PROD_004",
      productName: "可口可乐330ml",
      category: "饮料",
      quantity: 120,
      unit: "瓶",
      location: "C区-01货架",
      status: InventoryStatus.IN_STOCK,
      minThreshold: 50,
      lastUpdated: Date.now(),
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: InventoryStatus) => {
    switch (status) {
      case InventoryStatus.IN_STOCK:
        return (
          <Badge variant="default" className="bg-green-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            库存充足
          </Badge>
        )
      case InventoryStatus.LOW_STOCK:
        return (
          <Badge variant="default" className="bg-orange-500">
            <TrendingDown className="h-3 w-3 mr-1" />
            库存不足
          </Badge>
        )
      case InventoryStatus.OUT_OF_STOCK:
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            缺货
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>库存列表</CardTitle>
        <CardDescription>实时库存数据和RFID标签追踪</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索商品名称、编号或类别..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 库存表格 */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品信息</TableHead>
                  <TableHead>类别</TableHead>
                  <TableHead>库存</TableHead>
                  <TableHead>位置</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">{item.productId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {item.quantity} {item.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">最低: {item.minThreshold}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {item.location}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>未找到匹配的商品</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
