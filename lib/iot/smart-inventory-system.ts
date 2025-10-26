import mqtt from "mqtt"

// RFID标签类型
export enum RFIDTagType {
  UHF = "uhf", // 超高频RFID
  NFC = "nfc", // 近场通信
  HF = "hf", // 高频RFID
}

// 库存状态
export enum InventoryStatus {
  IN_STOCK = "in_stock",
  LOW_STOCK = "low_stock",
  OUT_OF_STOCK = "out_of_stock",
  RESERVED = "reserved",
  IN_TRANSIT = "in_transit",
}

// 告警级别
export enum AlertLevel {
  INFO = "info",
  WARNING = "warning",
  CRITICAL = "critical",
  EMERGENCY = "emergency",
}

// RFID标签信息
export interface RFIDTag {
  tagId: string
  epc: string // 电子产品代码
  type: RFIDTagType
  productId: string
  productName: string
  category: string
  location: string
  lastSeen: number
  rssi: number // 信号强度
  readCount: number
}

// 库存项
export interface InventoryItem {
  productId: string
  productName: string
  category: string
  quantity: number
  unit: string
  location: string
  status: InventoryStatus
  minThreshold: number
  maxThreshold: number
  tags: RFIDTag[]
  lastUpdated: number
}

// 盘点报告
export interface InventoryReport {
  reportId: string
  timestamp: number
  totalItems: number
  totalQuantity: number
  byCategory: Record<string, number>
  byLocation: Record<string, number>
  byStatus: Record<InventoryStatus, number>
  discrepancies: InventoryDiscrepancy[]
  duration: number
}

// 库存差异
export interface InventoryDiscrepancy {
  productId: string
  productName: string
  expected: number
  actual: number
  difference: number
  location: string
}

// 告警通知
export interface AlertNotification {
  alertId: string
  level: AlertLevel
  type: "low_stock" | "out_of_stock" | "theft" | "anomaly"
  productId: string
  productName: string
  message: string
  timestamp: number
  acknowledged: boolean
}

// 安全告警
export interface SecurityAlert {
  alertId: string
  type: "unauthorized_removal" | "tag_tampering" | "zone_breach"
  tagId: string
  productId: string
  location: string
  timestamp: number
  severity: AlertLevel
  details: string
}

// RFID读写器
export interface RFIDReader {
  readerId: string
  type: "fixed" | "handheld"
  location: string
  status: "online" | "offline" | "error"
  lastHeartbeat: number
  tagsRead: number
}

/**
 * 智能库存管理系统
 * 基于RFID/NFC标签实现库存自动盘点和实时监控
 */
export class SmartInventorySystem {
  private mqttClient: mqtt.MqttClient | null = null
  private inventory: Map<string, InventoryItem> = new Map()
  private readers: Map<string, RFIDReader> = new Map()
  private alerts: AlertNotification[] = []
  private securityAlerts: SecurityAlert[] = []
  private eventHandlers: Map<string, Function[]> = new Map()

  constructor(
    private brokerUrl: string = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883",
    private username?: string,
    private password?: string,
  ) {
    if (typeof window !== "undefined" || process.env.NODE_ENV === "production") {
      this.connect()
      this.startMonitoring()
    }
  }

  /**
   * 连接到MQTT代理
   */
  private connect(): void {
    try {
      this.mqttClient = mqtt.connect(this.brokerUrl, {
        username: this.username,
        password: this.password,
        clientId: `smart-inventory-${Date.now()}`,
        clean: true,
        reconnectPeriod: 5000,
      })

      this.mqttClient.on("connect", () => {
        console.log("[SmartInventory] Connected to MQTT broker")
        // 订阅RFID读写器主题
        this.mqttClient?.subscribe("rfid/+/tags")
        this.mqttClient?.subscribe("rfid/+/status")
        this.mqttClient?.subscribe("inventory/+/update")
      })

      this.mqttClient.on("message", (topic, message) => {
        this.handleMessage(topic, message)
      })

      this.mqttClient.on("error", (error) => {
        console.error("[SmartInventory] MQTT error:", error)
      })
    } catch (error) {
      console.error("[SmartInventory] Failed to connect:", error)
    }
  }

  /**
   * 处理MQTT消息
   */
  private handleMessage(topic: string, message: Buffer): void {
    try {
      const data = JSON.parse(message.toString())
      const topicParts = topic.split("/")

      if (topic.includes("/tags")) {
        // RFID标签读取
        this.handleTagRead(topicParts[1], data)
      } else if (topic.includes("/status")) {
        // 读写器状态更新
        this.updateReaderStatus(topicParts[1], data)
      } else if (topic.includes("/update")) {
        // 库存更新
        this.updateInventory(data)
      }

      // 触发事件处理器
      const handlers = this.eventHandlers.get(topic) || []
      handlers.forEach((handler) => handler(data))
    } catch (error) {
      console.error("[SmartInventory] Failed to handle message:", error)
    }
  }

  /**
   * 处理RFID标签读取
   */
  private handleTagRead(readerId: string, tags: RFIDTag[]): void {
    tags.forEach((tag) => {
      const item = this.inventory.get(tag.productId)
      if (item) {
        // 更新标签信息
        const existingTag = item.tags.find((t) => t.tagId === tag.tagId)
        if (existingTag) {
          existingTag.lastSeen = tag.lastSeen
          existingTag.rssi = tag.rssi
          existingTag.readCount++
        } else {
          item.tags.push(tag)
        }
        item.lastUpdated = Date.now()
      }
    })

    // 检测异常
    this.detectAnomalies(readerId, tags)
  }

  /**
   * 更新读写器状态
   */
  private updateReaderStatus(readerId: string, status: Partial<RFIDReader>): void {
    const reader = this.readers.get(readerId)
    if (reader) {
      Object.assign(reader, status)
    } else {
      this.readers.set(readerId, status as RFIDReader)
    }
  }

  /**
   * 更新库存
   */
  private updateInventory(data: Partial<InventoryItem>): void {
    if (!data.productId) return

    const item = this.inventory.get(data.productId)
    if (item) {
      Object.assign(item, data)
      item.lastUpdated = Date.now()

      // 检查库存状态
      this.checkInventoryStatus(item)
    } else {
      this.inventory.set(data.productId, data as InventoryItem)
    }
  }

  /**
   * 检查库存状态
   */
  private checkInventoryStatus(item: InventoryItem): void {
    if (item.quantity <= 0) {
      item.status = InventoryStatus.OUT_OF_STOCK
      this.createAlert({
        alertId: `alert-${Date.now()}`,
        level: AlertLevel.CRITICAL,
        type: "out_of_stock",
        productId: item.productId,
        productName: item.productName,
        message: `商品 ${item.productName} 已缺货`,
        timestamp: Date.now(),
        acknowledged: false,
      })
    } else if (item.quantity <= item.minThreshold) {
      item.status = InventoryStatus.LOW_STOCK
      this.createAlert({
        alertId: `alert-${Date.now()}`,
        level: AlertLevel.WARNING,
        type: "low_stock",
        productId: item.productId,
        productName: item.productName,
        message: `商品 ${item.productName} 库存不足，当前: ${item.quantity}，最低: ${item.minThreshold}`,
        timestamp: Date.now(),
        acknowledged: false,
      })
    } else {
      item.status = InventoryStatus.IN_STOCK
    }
  }

  /**
   * 创建告警
   */
  private createAlert(alert: AlertNotification): void {
    this.alerts.push(alert)
    this.publish("inventory/alerts", alert)
    this.triggerEvent("alert", alert)
  }

  /**
   * 检测异常
   */
  private detectAnomalies(readerId: string, tags: RFIDTag[]): void {
    const reader = this.readers.get(readerId)
    if (!reader) return

    // 检测未授权移除
    tags.forEach((tag) => {
      const item = this.inventory.get(tag.productId)
      if (!item) return

      // 如果标签在非授权区域被读取
      if (reader.location !== item.location && reader.type === "fixed") {
        this.createSecurityAlert({
          alertId: `security-${Date.now()}`,
          type: "unauthorized_removal",
          tagId: tag.tagId,
          productId: tag.productId,
          location: reader.location,
          timestamp: Date.now(),
          severity: AlertLevel.CRITICAL,
          details: `商品 ${item.productName} 在未授权区域 ${reader.location} 被检测到`,
        })
      }

      // 检测标签篡改（信号强度异常）
      if (tag.rssi < -80) {
        this.createSecurityAlert({
          alertId: `security-${Date.now()}`,
          type: "tag_tampering",
          tagId: tag.tagId,
          productId: tag.productId,
          location: reader.location,
          timestamp: Date.now(),
          severity: AlertLevel.WARNING,
          details: `标签 ${tag.tagId} 信号异常，可能被篡改`,
        })
      }
    })
  }

  /**
   * 创建安全告警
   */
  private createSecurityAlert(alert: SecurityAlert): void {
    this.securityAlerts.push(alert)
    this.publish("inventory/security/alerts", alert)
    this.triggerEvent("security_alert", alert)
  }

  /**
   * 触发事件
   */
  private triggerEvent(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event) || []
    handlers.forEach((handler) => handler(data))
  }

  /**
   * 发布MQTT消息
   */
  private publish(topic: string, payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.mqttClient) {
        reject(new Error("MQTT client not connected"))
        return
      }

      this.mqttClient.publish(topic, JSON.stringify(payload), (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * 自动盘点
   */
  async autoInventoryCheck(): Promise<InventoryReport> {
    const startTime = Date.now()

    // 触发所有读写器进行扫描
    const readers = Array.from(this.readers.values()).filter((r) => r.status === "online")

    await Promise.all(readers.map((reader) => this.publish(`rfid/${reader.readerId}/command`, { action: "scan" })))

    // 等待扫描完成（实际应该监听完成事件）
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // 生成报告
    const items = Array.from(this.inventory.values())
    const report: InventoryReport = {
      reportId: `report-${Date.now()}`,
      timestamp: Date.now(),
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
      byCategory: {},
      byLocation: {},
      byStatus: {
        [InventoryStatus.IN_STOCK]: 0,
        [InventoryStatus.LOW_STOCK]: 0,
        [InventoryStatus.OUT_OF_STOCK]: 0,
        [InventoryStatus.RESERVED]: 0,
        [InventoryStatus.IN_TRANSIT]: 0,
      },
      discrepancies: [],
      duration: Date.now() - startTime,
    }

    // 统计数据
    items.forEach((item) => {
      // 按类别统计
      report.byCategory[item.category] = (report.byCategory[item.category] || 0) + item.quantity

      // 按位置统计
      report.byLocation[item.location] = (report.byLocation[item.location] || 0) + item.quantity

      // 按状态统计
      report.byStatus[item.status]++

      // 检查差异（实际数量 vs 标签数量）
      const actualQuantity = item.tags.length
      if (actualQuantity !== item.quantity) {
        report.discrepancies.push({
          productId: item.productId,
          productName: item.productName,
          expected: item.quantity,
          actual: actualQuantity,
          difference: actualQuantity - item.quantity,
          location: item.location,
        })
      }
    })

    // 发布报告
    await this.publish("inventory/reports", report)

    return report
  }

  /**
   * 实时库存监控
   */
  monitorInventory(productId: string): InventoryItem | undefined {
    return this.inventory.get(productId)
  }

  /**
   * 低库存预警
   */
  lowStockAlert(threshold?: number): AlertNotification[] {
    const items = Array.from(this.inventory.values())
    const lowStockItems = items.filter((item) => {
      const minThreshold = threshold || item.minThreshold
      return item.quantity <= minThreshold && item.quantity > 0
    })

    return lowStockItems.map((item) => ({
      alertId: `alert-${Date.now()}-${item.productId}`,
      level: AlertLevel.WARNING,
      type: "low_stock" as const,
      productId: item.productId,
      productName: item.productName,
      message: `商品 ${item.productName} 库存不足，当前: ${item.quantity}，最低: ${item.minThreshold}`,
      timestamp: Date.now(),
      acknowledged: false,
    }))
  }

  /**
   * 防盗监控
   */
  antiTheftMonitoring(): SecurityAlert[] {
    // 返回最近的安全告警
    const recentAlerts = this.securityAlerts.filter((alert) => Date.now() - alert.timestamp < 3600000) // 1小时内

    return recentAlerts
  }

  /**
   * 获取所有库存
   */
  getAllInventory(): InventoryItem[] {
    return Array.from(this.inventory.values())
  }

  /**
   * 获取所有告警
   */
  getAllAlerts(): AlertNotification[] {
    return this.alerts
  }

  /**
   * 获取所有读写器
   */
  getAllReaders(): RFIDReader[] {
    return Array.from(this.readers.values())
  }

  /**
   * 确认告警
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.alertId === alertId)
    if (alert) {
      alert.acknowledged = true
      this.publish("inventory/alerts/acknowledged", { alertId })
    }
  }

  /**
   * 订阅事件
   */
  on(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event) || []
    handlers.push(handler)
    this.eventHandlers.set(event, handlers)
  }

  /**
   * 取消订阅
   */
  off(event: string, handler?: Function): void {
    if (handler) {
      const handlers = this.eventHandlers.get(event) || []
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
      this.eventHandlers.set(event, handlers)
    } else {
      this.eventHandlers.delete(event)
    }
  }

  /**
   * 开始监控
   */
  private startMonitoring(): void {
    // 每分钟检查库存状态
    setInterval(() => {
      this.inventory.forEach((item) => {
        this.checkInventoryStatus(item)
      })
    }, 60000)

    // 每5分钟检查读写器状态
    setInterval(() => {
      this.readers.forEach((reader) => {
        if (Date.now() - reader.lastHeartbeat > 300000) {
          // 5分钟无心跳
          reader.status = "offline"
        }
      })
    }, 300000)
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.mqttClient?.end()
    this.mqttClient = null
  }
}

let instance: SmartInventorySystem | null = null

export function getSmartInventorySystem(): SmartInventorySystem {
  if (!instance) {
    instance = new SmartInventorySystem()
  }
  return instance
}

// 保留向后兼容的导出
export const smartInventorySystem = new Proxy({} as SmartInventorySystem, {
  get(target, prop) {
    return getSmartInventorySystem()[prop as keyof SmartInventorySystem]
  },
})
