"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  room: string
  amount: string
  status: string
  time: string
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>最近订单</CardTitle>
        <Button variant="ghost" size="sm">
          查看全部
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">订单 {order.id}</p>
                <p className="text-xs text-muted-foreground">
                  包厢 {order.room} · {order.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{order.amount}</p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
