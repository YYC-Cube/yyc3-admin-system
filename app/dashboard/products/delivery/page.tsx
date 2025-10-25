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
import { Plus, Gift, Package, Edit, Trash2 } from "lucide-react"
import { DataTable } from "@/components/dashboard/data-table"
import { FilterBar } from "@/components/dashboard/filter-bar"

// 商品配送规则数据
const deliveryRules = [
  {
    id: 1,
    store: "巨嗨测试1",
    priority: "0",
    name: "买轩尼诗送2瓶绿茶,3瓶娃哈哈矿泉水",
    product: "轩尼诗",
    minQuantity: 1,
    type: "固定配送",
    gifts: "绿茶,娃哈哈矿泉水",
  },
  {
    id: 2,
    store: "巨嗨测试1",
    priority: "0",
    name: "青岛纯生330ml买一箱送一箱",
    product: "青岛纯生330ml",
    minQuantity: 24,
    type: "固定配送",
    gifts: "青岛纯生330ml",
  },
  {
    id: 3,
    store: "巨嗨测试1",
    priority: "0",
    name: "买一瓶马爹利XO任选5瓶饮料",
    product: "马爹利XO",
    minQuantity: 1,
    type: "手工配送",
    gifts: "娃哈哈矿泉水,红茶,绿茶",
  },
]

export default function DeliveryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const columns = [
    { key: "priority", label: "优先级", width: "w-20" },
    { key: "store", label: "门店", width: "w-32" },
    { key: "name", label: "规则名称", width: "w-64" },
    { key: "product", label: "适用商品", width: "w-40" },
    { key: "minQuantity", label: "起购数", width: "w-24" },
    { key: "type", label: "配送方式", width: "w-28" },
    { key: "gifts", label: "配送商品", width: "w-48" },
    { key: "actions", label: "操作", width: "w-32" },
  ]

  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "priority":
        return <Badge variant="outline">{item.priority}</Badge>
      case "type":
        return <Badge variant={item.type === "固定配送" ? "default" : "secondary"}>{item.type}</Badge>
      case "minQuantity":
        return <span className="font-semibold text-primary">{item.minQuantity}</span>
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
            <h1 className="text-3xl font-bold text-foreground">商品配送</h1>
            <p className="mt-2 text-muted-foreground">设置商品配送规则，支持固定配送和手工配送两种方式</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新增配送规则
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新增配送规则</DialogTitle>
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
                        <SelectItem value="store1">巨嗨测试1</SelectItem>
                        <SelectItem value="store2">KTV旗舰店</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>优先级</Label>
                    <Input placeholder="请输入规则优先级，例如：01、02、03" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>规则名称</Label>
                  <Input placeholder="请输入规则名称，例如：买一送一" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>适用商品</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择商品" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="product1">轩尼诗</SelectItem>
                        <SelectItem value="product2">青岛纯生330ml</SelectItem>
                        <SelectItem value="product3">马爹利XO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>配送起购数</Label>
                    <Input type="number" placeholder="请输入起购数量" defaultValue={1} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>配送方式</Label>
                  <Select defaultValue="fixed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">固定配送</SelectItem>
                      <SelectItem value="manual">手工配送</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    固定配送：购满数量自动配送指定商品；手工配送：购满数量可选配指定商品
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>配送商品</Label>
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
                          <th className="p-3 text-left text-sm font-medium">默认数量</th>
                          <th className="p-3 text-left text-sm font-medium">最大配送数</th>
                          <th className="p-3 text-left text-sm font-medium">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">
                            暂无配送商品，请点击"添加商品"按钮
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>适用包厢</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部包厢</SelectItem>
                        <SelectItem value="vip">VIP包厢</SelectItem>
                        <SelectItem value="normal">普通包厢</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>使用日期</Label>
                    <Select defaultValue="everyday">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyday">每天</SelectItem>
                        <SelectItem value="weekday">工作日</SelectItem>
                        <SelectItem value="weekend">周末</SelectItem>
                      </SelectContent>
                    </Select>
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
            <SelectItem value="store1">巨嗨测试1</SelectItem>
            <SelectItem value="store2">KTV旗舰店</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="配送方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部方式</SelectItem>
            <SelectItem value="fixed">固定配送</SelectItem>
            <SelectItem value="manual">手工配送</SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="请输入规则名称" className="w-64" />
        <Button className="ml-auto">查询</Button>
      </FilterBar>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">配送规则</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">已配置规则数</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">固定配送</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">18</div>
              <p className="text-xs text-muted-foreground">自动配送规则</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">手工配送</CardTitle>
              <Gift className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">10</div>
              <p className="text-xs text-muted-foreground">可选配送规则</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 数据表格 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <DataTable columns={columns} data={deliveryRules} renderCell={renderCell} />
      </motion.div>
    </div>
  )
}
