"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "../ui/card"

import { Store, Users, ShoppingBag, DollarSign } from 'lucide-react'

interface StatsData {
  totalSales: number
  todaySales: number
  orderCount: number
  activeMembers: number
  growthRate: number
  conversionRate: number
}

interface DashboardStatsProps {
  data: StatsData
}

export function DashboardStats({ data }: DashboardStatsProps) {
  // 转换数据以适应组件显示
  const stats = [
    {
      title: '总销售额',
      value: `¥${data.totalSales.toLocaleString()}`,
      change: `${data.growthRate > 0 ? '+' : ''}${data.growthRate}%`,
      trend: data.growthRate > 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: '今日销售额',
      value: `¥${data.todaySales.toLocaleString()}`,
      change: '12%',
      trend: 'up',
      icon: Store,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600/10'
    },
    {
      title: '订单数量',
      value: data.orderCount.toString(),
      change: '+8%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10'
    },
    {
      title: '活跃会员',
      value: data.activeMembers.toString(),
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-600/10'
    }
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                    <span className={stat.trend === "up" ? "text-emerald-600" : "text-destructive"}>{stat.change}</span>
                    <span className="text-muted-foreground">vs 昨日</span>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
