"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, AlertTriangle, CheckCircle, TrendingDown, RefreshCw, Shield } from "lucide-react"
import { InventoryListPanel } from "./inventory-list-panel"
import { AlertsPanel } from "./alerts-panel"
import { RFIDReadersPanel } from "./rfid-readers-panel"

export function SmartInventoryDashboard() {
  const [stats, setStats] = useState({
    totalItems: 156,
    inStock: 142,
    lowStock: 12,
    outOfStock: 2,
    alerts: 8,
    securityAlerts: 1,
  })

  const [isChecking, setIsChecking] = useState(false)

  const handleInventoryCheck = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/iot/inventory/check", {
        method: "POST",
      })
      const result = await response.json()
      if (result.success) {
        // 更新统计数据
        console.log("Inventory check completed:", result.data)
      }
    } catch (error) {
      console.error("Inventory check failed:", error)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">总商品数</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1">RFID标签追踪</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">库存充足</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
              <p className="text-xs text-muted-foreground mt-1">
                占比 {((stats.inStock / stats.totalItems) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">库存不足</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <p className="text-xs text-muted-foreground mt-1">需要补货</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">告警数量</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.alerts}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {stats.securityAlerts} 安全告警
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 操作按钮 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>库存操作</CardTitle>
            <CardDescription>执行库存盘点和管理操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={handleInventoryCheck} disabled={isChecking}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
                {isChecking ? "盘点中..." : "开始盘点"}
              </Button>
              <Button variant="outline">导出报告</Button>
              <Button variant="outline">配置读写器</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 详细面板 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <InventoryListPanel />
        <AlertsPanel />
      </div>

      {/* RFID读写器状态 */}
      <RFIDReadersPanel />
    </div>
  )
}
