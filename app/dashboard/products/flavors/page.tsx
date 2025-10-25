"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
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
import { toast } from "sonner"

// 商品口味管理页面
export default function ProductFlavorsPage() {
  const [flavors, setFlavors] = useState([
    { id: "1", name: "微辣", displayOrder: 1, createdAt: "2025-01-15" },
    { id: "2", name: "中辣", displayOrder: 2, createdAt: "2025-01-15" },
    { id: "3", name: "特辣", displayOrder: 3, createdAt: "2025-01-15" },
    { id: "4", name: "泰国味", displayOrder: 4, createdAt: "2025-01-15" },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFlavor, setEditingFlavor] = useState<any>(null)
  const [formData, setFormData] = useState({ name: "", displayOrder: "" })

  const filteredFlavors = flavors.filter((flavor) => flavor.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAdd = () => {
    setEditingFlavor(null)
    setFormData({ name: "", displayOrder: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (flavor: any) => {
    setEditingFlavor(flavor)
    setFormData({ name: flavor.name, displayOrder: flavor.displayOrder.toString() })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setFlavors(flavors.filter((f) => f.id !== id))
    toast.success("删除成功")
  }

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error("请输入口味名称")
      return
    }

    if (editingFlavor) {
      setFlavors(
        flavors.map((f) =>
          f.id === editingFlavor.id
            ? { ...f, name: formData.name, displayOrder: Number(formData.displayOrder) || 0 }
            : f,
        ),
      )
      toast.success("修改成功")
    } else {
      const newFlavor = {
        id: `flavor_${Date.now()}`,
        name: formData.name,
        displayOrder: Number(formData.displayOrder) || 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setFlavors([...flavors, newFlavor])
      toast.success("添加成功")
    }

    setIsDialogOpen(false)
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
          <h1 className="text-3xl font-bold">商品口味</h1>
          <p className="text-muted-foreground mt-1">管理商品口味选项</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          新增口味
        </Button>
      </motion.div>

      {/* 搜索栏 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索口味名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 口味列表 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>口味列表 ({filteredFlavors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>序号</TableHead>
                  <TableHead>口味名称</TableHead>
                  <TableHead>显示顺序</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlavors.map((flavor, index) => (
                  <TableRow key={flavor.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{flavor.name}</TableCell>
                    <TableCell>{flavor.displayOrder}</TableCell>
                    <TableCell>{flavor.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(flavor)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(flavor.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* 添加/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFlavor ? "编辑口味" : "新增口味"}</DialogTitle>
            <DialogDescription>{editingFlavor ? "修改口味信息" : "添加新的商品口味选项"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">口味名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入口味名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayOrder">显示顺序</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                placeholder="数字越大越靠前"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
