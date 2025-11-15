"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAlertIcon, getAlertBadgeVariant, getAlertSeverityText, type AlertSeverity } from "@/lib/utils/alert-helpers"

interface EnergyAlert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: string
}

interface EnergyAlertsPanelProps {
  alerts: EnergyAlert[]
}

export function EnergyAlertsPanel({ alerts }: EnergyAlertsPanelProps) {
  const getIcon = (type: string) => {
    return getAlertIcon(type as AlertSeverity, "h-5 w-5")
  }

  const getBadgeVariant = (type: string) => {
    return getAlertBadgeVariant(type as AlertSeverity)
  }

  const getSeverityText = (type: string) => {
    return getAlertSeverityText(type as AlertSeverity)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>能源告警</CardTitle>
        <CardDescription>异常能耗监控与预警</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
              {getIcon(alert.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{alert.title}</h4>
                  <Badge variant={getBadgeVariant(alert.type)}>
                    {getSeverityText(alert.type)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
