"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Edit, Trash2, Music } from "lucide-react"
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

// 轮播歌曲设置页面
export default function CarouselSongsPage() {
  const [carousels, setCarousels] = useState([
    {
      id: "1",
      storeId: "store_1",
      storeName: "巨嗨KTV",
      roomIds: ["all"],
      roomNames: "全部包厢",
      type: "custom",
      typeName: "自定义曲目",
      songCount: 40,
      updatedAt: "2025-01-15 10:30:00",
      songs: [
        { id: "s1", name: "告白气球", artist: "周杰伦", version: "原人原唱" },
        { id: "s2", name: "晴天", artist: "周杰伦", version: "原人原唱" },
      ],
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCarousel, setEditingCarousel] = useState<any>(null)

  const filteredCarousels = carousels.filter(
    (carousel) =>
      carousel.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carousel.typeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAdd = () => {
    setEditingCarousel(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (carousel: any) => {
    setEditingCarousel(carousel)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCarousels(carousels.filter((c) => c.id !== id))
    toast.success("删除成功")
  }

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: any }> = {
      hd: { label: "高清歌曲", variant: "default" },
      ranking: { label: "排行歌曲", variant: "secondary" },
      custom: { label: "自定义曲目", variant: "outline" },
    }
    const config = typeMap[type] || typeMap.custom
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
          <h1 className="text-3xl font-bold">轮播歌曲设置</h1>
          <p className="text-muted-foreground mt-1">配置包厢空闲时的轮播歌曲</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          新增轮播设置
        </Button>
      </motion.div>

      {/* 提示信息 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Music className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">轮播设置说明</p>
                <p className="text-sm text-blue-700">
                  轮播歌曲设置成功后，需重启两次机顶盒生效。可选择高清歌曲、排行歌曲或自定义曲目。
                </p>
              </div>
            </div>
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
                placeholder="搜索门店、轮播类型..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 轮播设置列表 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>轮播设置列表 ({filteredCarousels.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>门店</TableHead>
                  <TableHead>包厢</TableHead>
                  <TableHead>轮播类型</TableHead>
                  <TableHead>歌曲数量</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCarousels.map((carousel) => (
                  <TableRow key={carousel.id}>
                    <TableCell className="font-medium">{carousel.storeName}</TableCell>
                    <TableCell>{carousel.roomNames}</TableCell>
                    <TableCell>{getTypeBadge(carousel.type)}</TableCell>
                    <TableCell>{carousel.songCount} 首</TableCell>
                    <TableCell>{carousel.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(carousel)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(carousel.id)}>
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
            <DialogTitle>{editingCarousel ? "编辑轮播设置" : "新增轮播设置"}</DialogTitle>
            <DialogDescription>配置包厢的轮播歌曲设置</DialogDescription>
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
                <Label>包厢 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择包厢" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部包厢</SelectItem>
                    <SelectItem value="room_1">101包厢</SelectItem>
                    <SelectItem value="room_2">102包厢</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>轮播类型 *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择轮播类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hd">高清歌曲</SelectItem>
                    <SelectItem value="ranking">排行歌曲</SelectItem>
                    <SelectItem value="custom">自定义曲目</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label>自定义歌曲列表</Label>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  添加歌曲
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">最多可以选择40首轮播自定义歌曲</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                toast.success(editingCarousel ? "修改成功" : "添加成功")
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
