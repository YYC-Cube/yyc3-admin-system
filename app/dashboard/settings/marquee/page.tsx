"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// 走马灯设置页面
export default function MarqueeSettingsPage() {
  const [marquees, setMarquees] = useState([
    {
      id: "1",
      storeId: "store_1",
      storeName: "巨嗨KTV",
      content: "欢迎使用启智KTV自助点歌系统，我们将为您提供方便快捷的服务",
      playOrder: 1,
      playDate: "每天",
      playTime: "00:00-23:00",
      areaIds: ["all"],
      areaNames: "全部区域",
      roomIds: ["all"],
      roomNames: "全部包厢",
      frequency: 3,
      fontColor: "橙色",
      status: "enabled",
      createdAt: "2025-01-15",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMarquee, setEditingMarquee] = useState<any>(null)
  const [formData, setFormData] = useState({
    content: "",
    playOrder: "",
    playDate: "",
    playTime: "",
    frequency: "",
    fontColor: "",
  })

  const filteredMarquees = marquees.filter(
    (marquee) =>
      marquee.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marquee.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setEditingMarquee(null)
    setFormData({
      content: "",
      playOrder: "",
      playDate: "",
      playTime: "",
      frequency: "",
      fontColor: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (marquee: any) => {
    setEditingMarquee(marquee)
    setFormData({
      content: marquee.content,
      playOrder: marquee.playOrder.toString(),
      playDate: marquee.playDate,
      playTime: marquee.playTime,
      frequency: marquee.frequency.toString(),
      fontColor: marquee.fontColor,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMarquees(marquees.filter((m) => m.id !== id))
    toast.success("删除成功")
  }

  const handleToggleStatus = (id: string) => {
    setMarquees(
      marquees.map((m) => (m.id === id ? { ...m, status: m.status === "enabled" ? "disabled" : "enabled" } : m)),
    )
    toast.success("状态更新成功")
  }

  const getStatusBadge = (status: string) => {
    return status === "enabled" ? <Badge variant="default">启用</Badge> : <Badge variant="secondary">禁用</Badge>
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
          <h1 className="text-3xl font-bold">走马灯设置</h1>
          <p className="text-muted-foreground mt-1">配置包厢电视屏走马灯字幕</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          新增走马灯
        </Button>
      </motion.div>

      {/* 搜索栏 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索门店、播放内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 走马灯列表 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>走马灯列表 ({filteredMarquees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>播放序号</TableHead>
                  <TableHead>门店</TableHead>
                  <TableHead>播放内容</TableHead>
                  <TableHead>播放日期</TableHead>
                  <TableHead>播放时间</TableHead>
                  <TableHead>区域</TableHead>
                  <TableHead>播放频率</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMarquees.map((marquee) => (
                  <TableRow key={marquee.id}>
                    <TableCell className="font-medium">{marquee.playOrder}</TableCell>
                    <TableCell>{marquee.storeName}</TableCell>
                    <TableCell className="max-w-xs truncate">{marquee.content}</TableCell>
                    <TableCell>{marquee.playDate}</TableCell>
                    <TableCell>{marquee.playTime}</TableCell>
                    <TableCell>{marquee.areaNames}</TableCell>
                    <TableCell>{marquee.frequency}分钟/次</TableCell>
                    <TableCell>{getStatusBadge(marquee.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(marquee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(marquee.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(marquee.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMarquee ? "编辑走马灯" : "新增走马灯"}</DialogTitle>
            <DialogDescription>配置包厢电视屏的走马灯字幕</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Label>播放内容 *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="请输入走马灯播放内容"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>播放序号</Label>
                <Input
                  type="number"
                  value={formData.playOrder}
                  onChange={(e) => setFormData({ ...formData, playOrder: e.target.value })}
                  placeholder="例如: 1"
                />
              </div>
              <div className="space-y-2">
                <Label>字体颜色</Label>
                <Select
                  value={formData.fontColor}
                  onValueChange={(value) => setFormData({ ...formData, fontColor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择字体颜色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orange">橙色</SelectItem>
                    <SelectItem value="red">红色</SelectItem>
                    <SelectItem value="blue">蓝色</SelectItem>
                    <SelectItem value="green">绿色</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>播放时间</Label>
                <Input
                  value={formData.playTime}
                  onChange={(e) => setFormData({ ...formData, playTime: e.target.value })}
                  placeholder="例如: 00:00-23:00"
                />
              </div>
              <div className="space-y-2">
                <Label>播放频率(分钟)</Label>
                <Input
                  type="number"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  placeholder="例如: 3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                if (!formData.content) {
                  toast.error("请输入播放内容")
                  return
                }
                toast.success(editingMarquee ? "修改成功" : "添加成功")
                setIsDialogOpen(false)
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
