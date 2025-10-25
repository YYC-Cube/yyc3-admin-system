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
import { Plus, Edit, Trash2, Copy, Clock, DollarSign, Package } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"

// 开房套餐数据
const roomPackages = [
  {
    id: 1,
    store: "巨嗨KTV",
    type: "酒水套餐",
    name: "酒水套餐",
    duration: 1500,
    image: "/refreshing-beer.png",
  },
  {
    id: 2,
    store: "巨嗨KTV",
    type: "团购套餐",
    name: "实惠开房套餐",
    duration: 1500,
    image: "/jelly.jpg",
  },
  {
    id: 3,
    store: "巨嗨KTV",
    type: "最低消费套餐",
    name: "最低消费套餐",
    duration: 1500,
    image: null,
  },
  {
    id: 4,
    store: "巨嗨KTV",
    type: "时间套餐",
    name: "10分钟套餐",
    duration: 1500,
    image: null,
  },
]

export default function RoomPackagesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    store: "all",
    type: "all",
    name: "",
  })

  const columns = [
    { key: "image", label: "图片", width: "w-20" },
    { key: "store", label: "门店", width: "w-32" },
    { key: "type", label: "套餐类型", width: "w-32" },
    { key: "name", label: "套餐名称", width: "w-48" },
    { key: "duration", label: "时长/分钟", width: "w-28" },
    { key: "actions", label: "操作", width: "w-48" },
  ]

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "image":
        return item.image ? (
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        )
      case "type":
        return (
          <Badge
            variant={
              item.type === "酒水套餐"
                ? "default"
                : item.type === "团购套餐"
                  ? "secondary"
                  : item.type === "时间套餐"
                    ? "outline"
                    : "destructive"
            }
          >
            {item.type}
          </Badge>
        )
      case "duration":
        return (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{item.duration}</span>
          </div>
        )
      case "actions":
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Edit className="mr-1 h-3 w-3" />
              修改
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="mr-1 h-3 w-3" />
              删除
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="mr-1 h-3 w-3" />
              复制
            </Button>
          </div>
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
            <h1 className="text-3xl font-bold text-foreground">开房套餐名称</h1>
            <p className="mt-2 text-muted-foreground">设置不同类型的开房套餐，包含时间套餐、酒水套餐等</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加套餐
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>添加开房套餐</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>适用门店</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择门店" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store1">巨嗨KTV</SelectItem>
                        <SelectItem value="store2">KTV旗舰店</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>套餐类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="time">时间套餐</SelectItem>
                        <SelectItem value="liquor">酒水套餐</SelectItem>
                        <SelectItem value="minimum">最低消费套餐</SelectItem>
                        <SelectItem value="group">团购套餐</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>套餐名称</Label>
                  <Input placeholder="请输入套餐名称" />
                </div>
                <div className="space-y-2">
                  <Label>时长（分钟）</Label>
                  <Input type="number" placeholder="请输入时长" />
                </div>
                <div className="space-y-2">
                  <Label>套餐图片</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>尺寸：660×240</p>
                      <p>大小：不超过5M</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>确定</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar>
        <Select value={filters.store} onValueChange={(value) => setFilters({ ...filters, store: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="选择门店" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部门店</SelectItem>
            <SelectItem value="store1">巨嗨KTV</SelectItem>
            <SelectItem value="store2">KTV旗舰店</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="套餐类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="time">时间套餐</SelectItem>
            <SelectItem value="liquor">酒水套餐</SelectItem>
            <SelectItem value="minimum">最低消费套餐</SelectItem>
            <SelectItem value="group">团购套餐</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="请输入套餐名称"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="w-64"
        />

        <Button className="ml-auto">查询</Button>
      </FilterBar>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">套餐总数</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">已配置套餐数量</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">热门套餐</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">酒水套餐</div>
              <p className="text-xs text-muted-foreground">本月销量最高</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">套餐销售额</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">¥45,680</div>
              <p className="text-xs text-muted-foreground">本月套餐总收入</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <DataTable columns={columns} data={roomPackages} renderCell={renderCell} />
      </motion.div>
    </div>
  )
}
