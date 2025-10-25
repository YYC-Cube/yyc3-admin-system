"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { trafficPredictionSystem } from "@/lib/ai/traffic-prediction"

export function AnomalyAlertPanel() {
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    // 模拟实时监控
    const interval = setInterval(() => {
      const realTimeTraffic = Math.floor(Math.random() * 150) + 50
      const expectedTraffic = 100

      const anomaly = trafficPredictionSystem.detectAnomalies(realTimeTraffic, expectedTraffic)

      if (anomaly) {
        setAlerts((prev) => [anomaly, ...prev.slice(0, 9)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>异常检测</CardTitle>
          <CardDescription>实时监控客流异常并提供可能原因分析</CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>当前无异常检测</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Alert>
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                      <div className="flex-1">
                        <AlertTitle className="flex items-center gap-2">
                          客流异常检测
                          <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-2 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">实际客流:</span> {alert.actualTraffic}
                            </div>
                            <div>
                              <span className="text-muted-foreground">预期客流:</span> {alert.expectedTraffic}
                            </div>
                            <div>
                              <span className="text-muted-foreground">偏差:</span> {(alert.deviation * 100).toFixed(1)}%
                            </div>
                            <div>
                              <span className="text-muted-foreground">时间:</span>{" "}
                              {new Date(alert.timestamp).toLocaleTimeString("zh-CN")}
                            </div>
                          </div>
                          {alert.possibleReasons.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-1">可能原因:</p>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {alert.possibleReasons.map((reason: string, i: number) => (
                                  <li key={i}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
