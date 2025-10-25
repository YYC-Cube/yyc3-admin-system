"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Package, Edit, Trash2 } from "lucide-react"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// 模拟套餐数据
const mockPackages = [
  {
    id: "1",
    name: "228酒水套餐黄金场",
    type: "酒水套餐",
    duration: 360,
    originalPrice: 416,
    price: 228,
    memberPrice: 200,
    items: ["青岛纯生330ml x12"],
    image: "/jelly.jpg",
  },
  {
    id: "2",
    name: "实惠开房套餐",
    type: "团购套餐",
    duration: 1500,
    originalPrice: 100,
    price: 40,
    memberPrice: 35,
    items: ["薯片 x1", "青苹果 x1"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "最低消费套餐",
    type: "最低消费套餐",
    duration: 1500,
    originalPrice: 800,
    price: 800,
    memberPrice: 750,
    items: [],
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function PackagesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)

  const columns = [
    {
      key: "image",
      label: "图片",
      render: (value: string) => (
        <img src={value || "/placeholder.svg"} alt="套餐" className="h-12 w-12 rounded-lg object-cover" />
      ),
    },
    { key: "name", label: "套餐名称" },
    {
      key: "type",
      label: "套餐类型",
      render: (value: string) => <Badge variant="secondary">{value}</Badge>,
    },
    {
      key: "duration",
      label: "时长",
      render: (value: number) => `${Math.floor(value / 60)}小时${value % 60}分钟`,
    },
    {
      key: "price",
      label: "优惠价",
      render: (value: number) => <span className="font-semibold text-primary">¥{value}</span>,
    },
    {
      key: "memberPrice",
      label: "会员价",
      render: (value: number) => <span className="font-medium text-green-600">¥{value}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">商品套餐</h1>
          <p className="text-sm text-muted-foreground">管理商品套餐和开房套餐</p>
        </div>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar
        searchPlaceholder="搜索套餐名称..."
        onAdd={() => setIsDialogOpen(true)}
        filters={[
          {
            label: "套餐类型",
            options: [
              { label: "全部类型", value: "all" },
              { label: "酒水套餐", value: "drink" },
              { label: "团购套餐", value: "group" },
              { label: "最低消费", value: "minimum" },
            ],
            onChange: (value) => console.log("类型筛选:", value),
          },
        ]}
      />

      {/* 数据表格 */}
      <DataTable
        columns={columns}
        data={mockPackages}
        onRowClick={(pkg) => {
          setSelectedPackage(pkg)
          setIsDialogOpen(true)
        }}
        actions={(pkg) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPackage(pkg)
                setIsDialogOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log("删除套餐:", pkg.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      {/* 套餐编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPackage ? "编辑套餐" : "新增套餐"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">套餐名称</Label>
              <Input id="name" placeholder="请输入套餐名称" defaultValue={selectedPackage?.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">时长(分钟)</Label>
                <Input id="duration" type="number" placeholder="360" defaultValue={selectedPackage?.duration} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">优惠价</Label>
                <Input id="price" type="number" placeholder="228" defaultValue={selectedPackage?.price} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="originalPrice">原价</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="416"
                  defaultValue={selectedPackage?.originalPrice}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="memberPrice">会员价</Label>
                <Input id="memberPrice" type="number" placeholder="200" defaultValue={selectedPackage?.memberPrice} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="items">套餐商品</Label>
              <Textarea
                id="items"
                placeholder="请输入套餐包含的商品"
                defaultValue={selectedPackage?.items.join("\n")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
