"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Shield, Clock, X } from "lucide-react"
import { AlertLevel } from "@/lib/iot/smart-inventory-system"

interface Alert {
  alertId: string
  level: AlertLevel
  type: "low_stock" | "out_of_stock" | "theft" | "anomaly"
  productId: string
  productName: string
  message: string
  timestamp: number
  acknowledged: boolean
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      alertId: "alert-001",
      level: AlertLevel.CRITICAL,
      type: "out_of_stock",
      productId: "PROD_003",
      productName: "青岛啤酒330ml",
      message: "商品已缺货，需要立即补货",
      timestamp: Date.now() - 300000,
      acknowledged: false,
    },
    {
      alertId: "alert-002",
      level: AlertLevel.WARNING,
      type: "low_stock",
      productId: "PROD_002",
      productName: "五粮液52度500ml",
      message: "库存不足，当前: 15，最低: 20",
      timestamp: Date.now() - 600000,
      acknowledged: false,
    },
    {
      alertId: "alert-003",
      level: AlertLevel.CRITICAL,
      type: "theft",
      productId: "PROD_001",
      productName: "茅台飞天53度500ml",
      message: "检测到未授权移除，位置: 出口区域",
      timestamp: Date.now() - 900000,
      acknowledged: false,
    },
    {
      alertId: "alert-004",
      level: AlertLevel.WARNING,
      type: "low_stock",
      productId: "PROD_005",
      productName: "雪花啤酒330ml",
      message: "库存不足，当前: 18，最低: 30",
      timestamp: Date.now() - 1200000,
      acknowledged: true,
    },
  ])

  const handleAcknowledge = async (alertId: string) => {
    try {
      const response = await fetch("/api/iot/inventory/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId }),
      })

      if (response.ok) {
        setAlerts((prev) => prev.map((alert) => (alert.alertId === alertId ? { ...alert, acknowledged: true } : alert)))
      }
    } catch (error) {
      console.error("Failed to acknowledge alert:", error)
    }
  }

  const handleDismiss = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.alertId !== alertId))
  }

  const getLevelBadge = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL:
        return <Badge variant="destructive">严重</Badge>
      case AlertLevel.WARNING:
        return (
          <Badge variant="default" className="bg-orange-500">
            警告
          </Badge>
        )
      case AlertLevel.INFO:
        return <Badge variant="secondary">信息</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "theft":
        return <Shield className="h-4 w-4 text-red-500" />
      case "out_of_stock":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "low_stock":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return "刚刚"
  }

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>告警中心</CardTitle>
            <CardDescription>库存告警和安全监控</CardDescription>
          </div>
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive" className="text-sm">
              {unacknowledgedAlerts.length} 条未处理
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.alertId}
                className={`p-4 rounded-lg border ${alert.acknowledged ? "bg-muted/50 opacity-60" : "bg-background"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getTypeIcon(alert.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getLevelBadge(alert.level)}
                        <span className="text-sm font-medium">{alert.productName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.timestamp)}
                        {alert.acknowledged && (
                          <>
                            <span>•</span>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>已处理</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.acknowledged && (
                      <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.alertId)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        确认
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDismiss(alert.alertId)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50 text-green-500" />
            <p>暂无告警</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
