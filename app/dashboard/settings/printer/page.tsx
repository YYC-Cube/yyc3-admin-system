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
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Printer, Edit, Power, PowerOff } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"

// 打印机数据
const printers = [
  {
    id: 1,
    store: "巨嗨KTV",
    area: "顶楼,6楼,9楼,7楼,5楼,3楼",
    room: "无",
    name: "01",
    status: "禁用",
  },
  {
    id: 2,
    store: "巨嗨KTV",
    area: "3楼,5楼,7楼,9楼,6楼,顶楼",
    room: "无",
    name: "客户测试莆田",
    status: "禁用",
  },
  {
    id: 3,
    store: "巨嗨KTV",
    area: "顶楼,6楼,9楼,7楼,5楼,3楼",
    room: "无",
    name: "55超市",
    status: "启用",
  },
]

export default function PrinterSettingsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const columns = [
    { key: "store", label: "门店", width: "w-32" },
    { key: "area", label: "区域", width: "w-64" },
    { key: "room", label: "包厢号", width: "w-24" },
    { key: "name", label: "打印机名称", width: "w-40" },
    { key: "status", label: "状态", width: "w-24" },
    { key: "actions", label: "操作", width: "w-64" },
  ]

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "status":
        return (
          <Badge variant={item.status === "启用" ? "default" : "secondary"}>
            {item.status === "启用" ? <Power className="mr-1 h-3 w-3" /> : <PowerOff className="mr-1 h-3 w-3" />}
            {item.status}
          </Badge>
        )
      case "actions":
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Edit className="mr-1 h-3 w-3" />
              修改
            </Button>
            <Button variant="ghost" size="sm">
              {item.status === "启用" ? "禁用" : "启用"}
            </Button>
            <Button variant="ghost" size="sm">
              账单二维码
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
            <h1 className="text-3xl font-bold text-foreground">打印机设置</h1>
            <p className="mt-2 text-muted-foreground">配置门店打印机规则和打印内容</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                添加打印机
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>添加打印机</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>门店</Label>
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
                    <Label>收银机名称</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择收银机" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashier1">收银机1</SelectItem>
                        <SelectItem value="cashier2">收银机2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>打印机IP地址</Label>
                  <Input placeholder="请填写打印机IP地址，例如：192.168.1.100" />
                </div>

                <div className="space-y-2">
                  <Label>打印机名称</Label>
                  <Input placeholder="请输入打印机别名，例如：一楼厨房打印机" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>打印机类型</Label>
                    <Select defaultValue="thermal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thermal">热敏打印机(80mm)</SelectItem>
                        <SelectItem value="needle">针式打印机</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>打印份数</Label>
                    <Input type="number" defaultValue={1} min={1} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>打印区域</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择需要打印的区域范围" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部区域</SelectItem>
                      <SelectItem value="floor1">1楼</SelectItem>
                      <SelectItem value="floor2">2楼</SelectItem>
                      <SelectItem value="floor3">3楼</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>商品属性</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择需要打印的商品类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部商品</SelectItem>
                      <SelectItem value="food">食品</SelectItem>
                      <SelectItem value="drink">饮料</SelectItem>
                      <SelectItem value="liquor">酒水</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>打印设置</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="one-dish" className="text-sm font-normal">
                        是否一单一菜
                      </Label>
                      <Switch id="one-dish" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="default-printer" className="text-sm font-normal">
                        默认打印机
                      </Label>
                      <Switch id="default-printer" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>选择打印单据</Label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="order" defaultChecked />
                      <label htmlFor="order" className="text-sm">
                        商品订单
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pickup" />
                      <label htmlFor="pickup" className="text-sm">
                        商品取酒单
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="room-package" />
                      <label htmlFor="room-package" className="text-sm">
                        套餐开房单
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="storage" />
                      <label htmlFor="storage" className="text-sm">
                        商品寄存单
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="room" />
                      <label htmlFor="room" className="text-sm">
                        开房单
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="transfer" />
                      <label htmlFor="transfer" className="text-sm">
                        套餐转房单
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    返回
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
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="选择门店" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部门店</SelectItem>
            <SelectItem value="store1">巨嗨KTV</SelectItem>
            <SelectItem value="store2">KTV旗舰店</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="包厢区域" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部区域</SelectItem>
            <SelectItem value="floor1">1楼</SelectItem>
            <SelectItem value="floor2">2楼</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="状态类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="enabled">启用</SelectItem>
            <SelectItem value="disabled">禁用</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="请输入打印机别名" className="w-64" />
        <Button className="ml-auto">查询</Button>
      </FilterBar>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">打印机总数</CardTitle>
              <Printer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">已配置打印机</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">启用中</CardTitle>
              <Power className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">12</div>
              <p className="text-xs text-muted-foreground">正常运行</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">已禁用</CardTitle>
              <PowerOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">暂停使用</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <DataTable columns={columns} data={printers} renderCell={renderCell} />
      </motion.div>
    </div>
  )
}
