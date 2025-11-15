import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Info, Shield, Lightbulb, Wind, Volume2 } from "lucide-react"
import type { ReactElement } from "react"

/**
 * 警告级别类型定义
 */
export type AlertSeverity = "critical" | "high" | "medium" | "low" | "warning" | "info"

/**
 * Badge变体类型
 */
export type BadgeVariant = "default" | "destructive" | "secondary" | "outline"

/**
 * 根据警告严重程度返回对应的Badge变体
 */
export function getAlertBadgeVariant(severity: AlertSeverity): BadgeVariant {
  switch (severity) {
    case "critical":
    case "high":
      return "destructive"
    case "medium":
    case "warning":
      return "default"
    case "low":
    case "info":
      return "secondary"
    default:
      return "outline"
  }
}

/**
 * 根据警告严重程度返回对应的图标
 */
export function getAlertIcon(severity: AlertSeverity, className: string = "h-4 w-4"): ReactElement | null {
  const iconProps = { className }

  switch (severity) {
    case "critical":
    case "high":
      return <XCircle {...iconProps} />
    case "medium":
    case "warning":
      return <AlertTriangle {...iconProps} />
    case "low":
      return <CheckCircle {...iconProps} />
    case "info":
      return <Info {...iconProps} />
    default:
      return null
  }
}

/**
 * IoT设备类型图标映射
 */
export type DeviceType = "lighting" | "ac" | "audio" | "other"

/**
 * 根据设备类型返回对应的图标
 */
export function getDeviceIcon(type: DeviceType, className: string = "h-5 w-5"): ReactElement | null {
  const iconProps = { className }

  switch (type) {
    case "lighting":
      return <Lightbulb {...iconProps} />
    case "ac":
      return <Wind {...iconProps} />
    case "audio":
      return <Volume2 {...iconProps} />
    case "other":
    default:
      return null
  }
}

/**
 * 警告类型图标映射
 */
export type AlertType = "theft" | "out_of_stock" | "low_stock" | "anomaly" | "other"

/**
 * 根据警告类型返回对应的图标和颜色类
 */
export function getAlertTypeIcon(
  type: AlertType,
  className: string = "h-4 w-4"
): ReactElement | null {
  switch (type) {
    case "theft":
      return <Shield className={`${className} text-red-500`} />
    case "out_of_stock":
      return <AlertTriangle className={`${className} text-red-500`} />
    case "low_stock":
      return <AlertTriangle className={`${className} text-orange-500`} />
    case "anomaly":
      return <AlertCircle className={`${className} text-blue-500`} />
    case "other":
    default:
      return <AlertTriangle className={`${className} text-blue-500`} />
  }
}

/**
 * 获取严重程度的中文文本
 */
export function getAlertSeverityText(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
    case "high":
      return "严重"
    case "medium":
    case "warning":
      return "警告"
    case "low":
      return "低"
    case "info":
      return "提示"
    default:
      return severity
  }
}
