// 移动端首页

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, User, Home, Package, BarChart3, Settings, Bell, Menu, X } from "lucide-react"

export default function MobilePage() {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 移动端头部 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            启智KTV
          </h1>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* 搜索栏 */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索商品、订单..." className="pl-10" />
          </div>
        </div>
      </header>

      {/* 侧边菜单 */}
      {showMenu && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
              <div>
                <div className="font-semibold">管理员</div>
                <div className="text-sm text-muted-foreground">admin@ktv.com</div>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { icon: Home, label: "首页" },
                { icon: Package, label: "商品管理" },
                { icon: ShoppingCart, label: "订单管理" },
                { icon: User, label: "会员管理" },
                { icon: BarChart3, label: "数据分析" },
                { icon: Settings, label: "系统设置" },
              ].map((item, index) => (
                <Button key={index} variant="ghost" className="w-full justify-start">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </motion.div>
      )}

      {/* 主要内容 */}
      <main className="p-4 pb-20">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: "今日销售", value: "¥12,580", change: "+12.5%" },
            { label: "今日订单", value: "156", change: "+8.3%" },
            { label: "活跃会员", value: "1,234", change: "+5.2%" },
            { label: "库存预警", value: "23", change: "-15.6%" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4">
                <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-green-600">{stat.change}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 快捷操作 */}
        <Card className="p-4 mb-6">
          <h2 className="font-semibold mb-4">快捷操作</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: "📦", label: "新增商品" },
              { icon: "🛒", label: "创建订单" },
              { icon: "👥", label: "会员管理" },
              { icon: "📊", label: "查看报表" },
            ].map((action, index) => (
              <button key={index} className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl">
                  {action.icon}
                </div>
                <span className="text-xs text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* 最近订单 */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">最近订单</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">订单 #12345{index}</div>
                  <div className="text-sm text-muted-foreground">包厢 A101</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">¥580</div>
                  <div className="text-xs text-green-600">已支付</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          {[
            { icon: Home, label: "首页" },
            { icon: Package, label: "商品" },
            { icon: BarChart3, label: "报表" },
            { icon: User, label: "我的" },
          ].map((item, index) => (
            <Button key={index} variant="ghost" className="flex-col h-auto py-2">
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
