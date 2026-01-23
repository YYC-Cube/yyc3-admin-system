"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Home,
  CreditCard,
  Users,
  ShoppingBag,
  Activity,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
// 替换为正确的相对路径导入
import { useRoomStore } from "../../lib/stores/useRoomStore"
import { useOrderStore } from "../../lib/stores/useOrderStore"

// 容器动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// 卡片动画配置已移除，使用内联样式

export default function DashboardPage() {
  const { rooms, fetchRooms } = useRoomStore()
  const { orders, fetchOrders } = useOrderStore()

  useEffect(() => {
    fetchRooms()
    fetchOrders()
  }, [fetchRooms, fetchOrders])

  // 计算统计数据
  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter((r) => r.status === "available").length,
    occupiedRooms: rooms.filter((r) => r.status === "occupied").length,
    totalOrders: orders.length,
    todayRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingCheckout: rooms.filter((r) => r.status === "checkout").length,
  }

  const statCards = [
    {
      title: "包厢总数",
      value: stats.totalRooms,
      change: "+0%",
      trend: "up",
      icon: Home,
      color: "cyan",
      subtitle: `空闲 ${stats.availableRooms} | 占用 ${stats.occupiedRooms}`,
    },
    {
      title: "今日订单",
      value: stats.totalOrders,
      change: "+12%",
      trend: "up",
      icon: ShoppingBag,
      color: "blue",
      subtitle: "较昨日增长",
    },
    {
      title: "今日营收",
      value: `¥${stats.todayRevenue.toFixed(2)}`,
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "green",
      subtitle: "实时更新",
    },
    {
      title: "待结账",
      value: stats.pendingCheckout,
      change: "-2",
      trend: "down",
      icon: Clock,
      color: "orange",
      subtitle: "需要处理",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      {/* 顶部标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          智慧商家管理系统
        </h1>
        <p className="text-slate-400 text-lg">实时监控业务数据,优化运营决策</p>
      </motion.div>

      {/* 统计卡片网格 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.title} whileHover={{ y: -5 }}>
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between mb-2">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <Badge
                    variant="outline"
                    className={`${
                      stat.trend === "up"
                        ? "bg-green-500/10 text-green-400 border-green-500/50"
                        : "bg-red-500/10 text-red-400 border-red-500/50"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* 快速操作区 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                <CreditCard className="h-8 w-8" />
                <span>点单收银</span>
              </Button>

              <Button className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                <Home className="h-8 w-8" />
                <span>包厢管理</span>
              </Button>

              <Button className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
                <Users className="h-8 w-8" />
                <span>会员管理</span>
              </Button>

              <Button className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500">
                <Activity className="h-8 w-8" />
                <span>数据分析</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 实时动态 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8"
      >
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-cyan-400" />
              实时业务动态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "10:30", event: "608包厢开房", type: "room", color: "cyan" },
                { time: "10:28", event: "777包厢加单 ¥580", type: "order", color: "green" },
                { time: "10:25", event: "会员张三充值 ¥1000", type: "member", color: "purple" },
                { time: "10:20", event: "801包厢结账 ¥1989", type: "checkout", color: "orange" },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                >
                  <Badge
                    className={`bg-${activity.color}-500/20 text-${activity.color}-400 border-${activity.color}-500/50`}
                  >
                    {activity.time}
                  </Badge>
                  <span className="text-slate-200 flex-1">{activity.event}</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.type === "room" && "包厢"}
                    {activity.type === "order" && "订单"}
                    {activity.type === "member" && "会员"}
                    {activity.type === "checkout" && "结账"}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
