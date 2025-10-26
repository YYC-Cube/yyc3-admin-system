import mqtt from "mqtt"

// 能源数据类型
export interface EnergyData {
  deviceId: string
  deviceName: string
  deviceType: "lighting" | "ac" | "audio" | "display" | "other"
  power: number // 功率(W)
  voltage: number // 电压(V)
  current: number // 电流(A)
  energy: number // 累计能耗(kWh)
  powerFactor: number // 功率因数
  timestamp: number
}

// 时间范围
export interface TimeRange {
  startDate: Date
  endDate: Date
  granularity: "hour" | "day" | "week" | "month"
}

// 能耗分析结果
export interface EnergyAnalysis {
  totalEnergy: number // 总能耗(kWh)
  totalCost: number // 总成本(元)
  averagePower: number // 平均功率(W)
  peakPower: number // 峰值功率(W)
  peakTime: number // 峰值时间
  byDeviceType: Record<string, number> // 按设备类型统计
  byTimeSlot: Array<{ time: string; energy: number }> // 按时间段统计
  trend: "increasing" | "decreasing" | "stable" // 趋势
  comparison: {
    previousPeriod: number
    change: number
    changePercent: number
  }
}

// 能源约束
export interface EnergyConstraints {
  maxPower: number // 最大功率限制(W)
  maxCost: number // 最大成本限制(元)
  priorityDevices: string[] // 优先保障设备
  timeSlots: Array<{
    start: string
    end: string
    maxPower: number
  }>
}

// 优化方案
export interface OptimizationPlan {
  planId: string
  timestamp: number
  actions: OptimizationAction[]
  expectedSavings: {
    energy: number // 节省能耗(kWh)
    cost: number // 节省成本(元)
    percent: number // 节省百分比
  }
  priority: "high" | "medium" | "low"
  status: "pending" | "executing" | "completed" | "failed"
}

// 优化动作
export interface OptimizationAction {
  actionId: string
  type: "turn_off" | "reduce_power" | "schedule" | "replace"
  deviceId: string
  deviceName: string
  description: string
  expectedSavings: number
  impact: "high" | "medium" | "low"
}

// 异常告警
export interface AnomalyAlert {
  alertId: string
  type: "high_consumption" | "power_spike" | "device_malfunction" | "cost_overrun"
  deviceId: string
  deviceName: string
  severity: "critical" | "warning" | "info"
  message: string
  currentValue: number
  threshold: number
  timestamp: number
  acknowledged: boolean
}

// 设备能耗统计
export interface DeviceEnergyStats {
  deviceId: string
  deviceName: string
  deviceType: string
  totalEnergy: number
  averagePower: number
  operatingHours: number
  efficiency: number
  cost: number
  trend: "increasing" | "decreasing" | "stable"
}

/**
 * 智能能源管理系统
 * 基于智能电表和传感器优化能源使用
 */
export class SmartEnergyManagement {
  private mqttClient: mqtt.MqttClient | null = null
  private energyData: Map<string, EnergyData[]> = new Map()
  private devices: Map<string, DeviceEnergyStats> = new Map()
  private alerts: AnomalyAlert[] = []
  private optimizationPlans: OptimizationPlan[] = []
  private eventHandlers: Map<string, Function[]> = new Map()
  private electricityPrice = 0.6 // 电价(元/kWh)

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
        clientId: `smart-energy-${Date.now()}`,
        clean: true,
        reconnectPeriod: 5000,
      })

      this.mqttClient.on("connect", () => {
        console.log("[SmartEnergy] Connected to MQTT broker")
        // 订阅能源监控主题
        this.mqttClient?.subscribe("energy/+/data")
        this.mqttClient?.subscribe("energy/+/status")
        this.mqttClient?.subscribe("energy/control/+")
      })

      this.mqttClient.on("message", (topic, message) => {
        this.handleMessage(topic, message)
      })

      this.mqttClient.on("error", (error) => {
        console.error("[SmartEnergy] MQTT error:", error)
      })
    } catch (error) {
      console.error("[SmartEnergy] Failed to connect:", error)
    }
  }

  /**
   * 处理MQTT消息
   */
  private handleMessage(topic: string, message: Buffer): void {
    try {
      const data = JSON.parse(message.toString())
      const topicParts = topic.split("/")

      if (topic.includes("/data")) {
        // 能源数据更新
        this.handleEnergyData(topicParts[1], data)
      } else if (topic.includes("/status")) {
        // 设备状态更新
        this.updateDeviceStatus(topicParts[1], data)
      }

      // 触发事件处理器
      const handlers = this.eventHandlers.get(topic) || []
      handlers.forEach((handler) => handler(data))
    } catch (error) {
      console.error("[SmartEnergy] Failed to handle message:", error)
    }
  }

  /**
   * 处理能源数据
   */
  private handleEnergyData(deviceId: string, data: EnergyData): void {
    // 存储数据
    const deviceData = this.energyData.get(deviceId) || []
    deviceData.push(data)

    // 保留最近24小时的数据
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    const recentData = deviceData.filter((d) => d.timestamp > oneDayAgo)
    this.energyData.set(deviceId, recentData)

    // 更新设备统计
    this.updateDeviceStats(deviceId, data)

    // 检测异常
    this.detectAnomalies(deviceId, data)
  }

  /**
   * 更新设备统计
   */
  private updateDeviceStats(deviceId: string, data: EnergyData): void {
    const stats = this.devices.get(deviceId) || {
      deviceId,
      deviceName: data.deviceName,
      deviceType: data.deviceType,
      totalEnergy: 0,
      averagePower: 0,
      operatingHours: 0,
      efficiency: 0,
      cost: 0,
      trend: "stable" as const,
    }

    // 更新统计数据
    const deviceData = this.energyData.get(deviceId) || []
    if (deviceData.length > 0) {
      stats.totalEnergy = deviceData[deviceData.length - 1].energy
      stats.averagePower = deviceData.reduce((sum, d) => sum + d.power, 0) / deviceData.length
      stats.operatingHours = deviceData.filter((d) => d.power > 10).length / 60 // 假设每分钟一条数据
      stats.cost = stats.totalEnergy * this.electricityPrice

      // 计算效率(简化计算)
      stats.efficiency = stats.powerFactor || data.powerFactor

      // 计算趋势
      if (deviceData.length >= 10) {
        const recent = deviceData.slice(-5).reduce((sum, d) => sum + d.power, 0) / 5
        const previous = deviceData.slice(-10, -5).reduce((sum, d) => sum + d.power, 0) / 5
        const change = ((recent - previous) / previous) * 100

        if (change > 10) {
          stats.trend = "increasing"
        } else if (change < -10) {
          stats.trend = "decreasing"
        } else {
          stats.trend = "stable"
        }
      }
    }

    this.devices.set(deviceId, stats)
  }

  /**
   * 更新设备状态
   */
  private updateDeviceStatus(deviceId: string, status: any): void {
    // 处理设备状态更新
    this.triggerEvent("device_status", { deviceId, status })
  }

  /**
   * 检测异常
   */
  private detectAnomalies(deviceId: string, data: EnergyData): void {
    const deviceData = this.energyData.get(deviceId) || []
    if (deviceData.length < 10) return

    // 计算平均功率和标准差
    const powers = deviceData.map((d) => d.power)
    const avgPower = powers.reduce((sum, p) => sum + p, 0) / powers.length
    const stdDev = Math.sqrt(powers.reduce((sum, p) => sum + Math.pow(p - avgPower, 2), 0) / powers.length)

    // 检测功率突增
    if (data.power > avgPower + 3 * stdDev) {
      this.createAlert({
        alertId: `alert-${Date.now()}`,
        type: "power_spike",
        deviceId,
        deviceName: data.deviceName,
        severity: "warning",
        message: `设备 ${data.deviceName} 功率异常增高: ${data.power.toFixed(2)}W (平均: ${avgPower.toFixed(2)}W)`,
        currentValue: data.power,
        threshold: avgPower + 3 * stdDev,
        timestamp: Date.now(),
        acknowledged: false,
      })
    }

    // 检测高能耗
    const stats = this.devices.get(deviceId)
    if (stats && stats.totalEnergy > 100) {
      // 假设阈值为100kWh
      this.createAlert({
        alertId: `alert-${Date.now()}`,
        type: "high_consumption",
        deviceId,
        deviceName: data.deviceName,
        severity: "info",
        message: `设备 ${data.deviceName} 累计能耗较高: ${stats.totalEnergy.toFixed(2)}kWh`,
        currentValue: stats.totalEnergy,
        threshold: 100,
        timestamp: Date.now(),
        acknowledged: false,
      })
    }

    // 检测设备故障(功率因数异常)
    if (data.powerFactor < 0.7) {
      this.createAlert({
        alertId: `alert-${Date.now()}`,
        type: "device_malfunction",
        deviceId,
        deviceName: data.deviceName,
        severity: "warning",
        message: `设备 ${data.deviceName} 功率因数异常: ${data.powerFactor.toFixed(2)} (正常: >0.85)`,
        currentValue: data.powerFactor,
        threshold: 0.85,
        timestamp: Date.now(),
        acknowledged: false,
      })
    }
  }

  /**
   * 创建告警
   */
  private createAlert(alert: AnomalyAlert): void {
    this.alerts.push(alert)
    this.publish("energy/alerts", alert)
    this.triggerEvent("alert", alert)
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
   * 能耗监控
   */
  monitorEnergyConsumption(deviceId: string): EnergyData | undefined {
    const deviceData = this.energyData.get(deviceId)
    return deviceData?.[deviceData.length - 1]
  }

  /**
   * 能耗分析
   */
  analyzeEnergyUsage(timeRange: TimeRange): EnergyAnalysis {
    const { startDate, endDate } = timeRange
    const startTime = startDate.getTime()
    const endTime = endDate.getTime()

    // 收集时间范围内的所有数据
    const allData: EnergyData[] = []
    this.energyData.forEach((deviceData) => {
      const rangeData = deviceData.filter((d) => d.timestamp >= startTime && d.timestamp <= endTime)
      allData.push(...rangeData)
    })

    if (allData.length === 0) {
      return {
        totalEnergy: 0,
        totalCost: 0,
        averagePower: 0,
        peakPower: 0,
        peakTime: 0,
        byDeviceType: {},
        byTimeSlot: [],
        trend: "stable",
        comparison: {
          previousPeriod: 0,
          change: 0,
          changePercent: 0,
        },
      }
    }

    // 计算总能耗
    const totalEnergy = Array.from(this.devices.values()).reduce((sum, stats) => sum + stats.totalEnergy, 0)

    // 计算总成本
    const totalCost = totalEnergy * this.electricityPrice

    // 计算平均功率
    const averagePower = allData.reduce((sum, d) => sum + d.power, 0) / allData.length

    // 计算峰值功率
    const peakData = allData.reduce((max, d) => (d.power > max.power ? d : max), allData[0])
    const peakPower = peakData.power
    const peakTime = peakData.timestamp

    // 按设备类型统计
    const byDeviceType: Record<string, number> = {}
    allData.forEach((d) => {
      byDeviceType[d.deviceType] = (byDeviceType[d.deviceType] || 0) + d.power / 1000 // 转换为kW
    })

    // 按时间段统计
    const byTimeSlot: Array<{ time: string; energy: number }> = []
    const timeSlots = this.groupByTimeSlot(allData, timeRange.granularity)
    timeSlots.forEach((data, time) => {
      const energy = data.reduce((sum, d) => sum + d.power, 0) / 1000 // 转换为kWh
      byTimeSlot.push({ time, energy })
    })

    // 计算趋势
    let trend: "increasing" | "decreasing" | "stable" = "stable"
    if (byTimeSlot.length >= 2) {
      const recent = byTimeSlot.slice(-Math.floor(byTimeSlot.length / 2)).reduce((sum, s) => sum + s.energy, 0)
      const previous = byTimeSlot.slice(0, Math.floor(byTimeSlot.length / 2)).reduce((sum, s) => sum + s.energy, 0)
      const change = ((recent - previous) / previous) * 100

      if (change > 10) {
        trend = "increasing"
      } else if (change < -10) {
        trend = "decreasing"
      }
    }

    // 对比上一周期
    const periodDuration = endTime - startTime
    const previousStartTime = startTime - periodDuration
    const previousEndTime = startTime

    const previousData: EnergyData[] = []
    this.energyData.forEach((deviceData) => {
      const rangeData = deviceData.filter((d) => d.timestamp >= previousStartTime && d.timestamp < previousEndTime)
      previousData.push(...rangeData)
    })

    const previousEnergy = previousData.reduce((sum, d) => sum + d.power, 0) / 1000
    const change = totalEnergy - previousEnergy
    const changePercent = previousEnergy > 0 ? (change / previousEnergy) * 100 : 0

    return {
      totalEnergy,
      totalCost,
      averagePower,
      peakPower,
      peakTime,
      byDeviceType,
      byTimeSlot,
      trend,
      comparison: {
        previousPeriod: previousEnergy,
        change,
        changePercent,
      },
    }
  }

  /**
   * 按时间段分组
   */
  private groupByTimeSlot(data: EnergyData[], granularity: string): Map<string, EnergyData[]> {
    const groups = new Map<string, EnergyData[]>()

    data.forEach((d) => {
      const date = new Date(d.timestamp)
      let key: string

      switch (granularity) {
        case "hour":
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`
          break
        case "day":
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          break
        case "week":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`
          break
        case "month":
          key = `${date.getFullYear()}-${date.getMonth() + 1}`
          break
        default:
          key = date.toISOString()
      }

      const group = groups.get(key) || []
      group.push(d)
      groups.set(key, group)
    })

    return groups
  }

  /**
   * 节能优化
   */
  optimizeEnergyUsage(constraints: EnergyConstraints): OptimizationPlan {
    const actions: OptimizationAction[] = []
    let totalSavings = 0

    // 分析所有设备
    this.devices.forEach((stats, deviceId) => {
      // 识别高能耗设备
      if (stats.averagePower > 1000 && !constraints.priorityDevices.includes(deviceId)) {
        // 建议降低功率或关闭
        const savings = (stats.averagePower * 0.3 * stats.operatingHours) / 1000 // 假设可节省30%
        totalSavings += savings

        actions.push({
          actionId: `action-${Date.now()}-${deviceId}`,
          type: "reduce_power",
          deviceId,
          deviceName: stats.deviceName,
          description: `降低设备功率30%，预计节省 ${savings.toFixed(2)}kWh`,
          expectedSavings: savings,
          impact: "medium",
        })
      }

      // 识别低效设备
      if (stats.efficiency < 0.7) {
        const savings = (stats.averagePower * 0.2 * stats.operatingHours) / 1000
        totalSavings += savings

        actions.push({
          actionId: `action-${Date.now()}-${deviceId}`,
          type: "replace",
          deviceId,
          deviceName: stats.deviceName,
          description: `更换为高效设备，预计节省 ${savings.toFixed(2)}kWh`,
          expectedSavings: savings,
          impact: "high",
        })
      }

      // 识别闲置设备
      const recentData = this.energyData.get(deviceId)?.slice(-60) || [] // 最近1小时
      const avgRecentPower = recentData.reduce((sum, d) => sum + d.power, 0) / recentData.length

      if (avgRecentPower < 50 && stats.averagePower > 100) {
        const savings = (stats.averagePower * 1) / 1000 // 假设关闭1小时
        totalSavings += savings

        actions.push({
          actionId: `action-${Date.now()}-${deviceId}`,
          type: "turn_off",
          deviceId,
          deviceName: stats.deviceName,
          description: `关闭闲置设备，预计节省 ${savings.toFixed(2)}kWh`,
          expectedSavings: savings,
          impact: "low",
        })
      }
    })

    // 按节省效果排序
    actions.sort((a, b) => b.expectedSavings - a.expectedSavings)

    const plan: OptimizationPlan = {
      planId: `plan-${Date.now()}`,
      timestamp: Date.now(),
      actions: actions.slice(0, 10), // 最多10个建议
      expectedSavings: {
        energy: totalSavings,
        cost: totalSavings * this.electricityPrice,
        percent: (totalSavings / this.getTotalEnergy()) * 100,
      },
      priority: totalSavings > 100 ? "high" : totalSavings > 50 ? "medium" : "low",
      status: "pending",
    }

    this.optimizationPlans.push(plan)
    this.publish("energy/optimization/plan", plan)

    return plan
  }

  /**
   * 获取总能耗
   */
  private getTotalEnergy(): number {
    return Array.from(this.devices.values()).reduce((sum, stats) => sum + stats.totalEnergy, 0)
  }

  /**
   * 异常检测
   */
  detectEnergyAnomaly(): AnomalyAlert[] {
    // 返回最近的未确认告警
    return this.alerts.filter((alert) => !alert.acknowledged && Date.now() - alert.timestamp < 3600000) // 1小时内
  }

  /**
   * 获取所有设备统计
   */
  getAllDeviceStats(): DeviceEnergyStats[] {
    return Array.from(this.devices.values())
  }

  /**
   * 获取所有告警
   */
  getAllAlerts(): AnomalyAlert[] {
    return this.alerts
  }

  /**
   * 获取所有优化方案
   */
  getAllOptimizationPlans(): OptimizationPlan[] {
    return this.optimizationPlans
  }

  /**
   * 确认告警
   */
  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.alertId === alertId)
    if (alert) {
      alert.acknowledged = true
      this.publish("energy/alerts/acknowledged", { alertId })
    }
  }

  /**
   * 执行优化方案
   */
  async executeOptimizationPlan(planId: string): Promise<void> {
    const plan = this.optimizationPlans.find((p) => p.planId === planId)
    if (!plan) {
      throw new Error("Optimization plan not found")
    }

    plan.status = "executing"

    // 执行优化动作
    for (const action of plan.actions) {
      await this.executeOptimizationAction(action)
    }

    plan.status = "completed"
    this.publish("energy/optimization/completed", plan)
  }

  /**
   * 执行优化动作
   */
  private async executeOptimizationAction(action: OptimizationAction): Promise<void> {
    // 发送控制命令到设备
    await this.publish(`energy/control/${action.deviceId}`, {
      action: action.type,
      timestamp: Date.now(),
    })
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
    // 每5分钟生成优化建议
    setInterval(() => {
      const constraints: EnergyConstraints = {
        maxPower: 50000, // 50kW
        maxCost: 1000, // 1000元
        priorityDevices: [],
        timeSlots: [],
      }
      this.optimizeEnergyUsage(constraints)
    }, 300000)

    // 每小时清理旧数据
    setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
      this.energyData.forEach((deviceData, deviceId) => {
        const recentData = deviceData.filter((d) => d.timestamp > oneDayAgo)
        this.energyData.set(deviceId, recentData)
      })

      // 清理旧告警
      this.alerts = this.alerts.filter((alert) => Date.now() - alert.timestamp < 7 * 24 * 60 * 60 * 1000) // 保留7天
    }, 3600000)
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.mqttClient?.end()
    this.mqttClient = null
  }
}

let instance: SmartEnergyManagement | null = null

export function getSmartEnergyManagement(): SmartEnergyManagement {
  if (!instance) {
    instance = new SmartEnergyManagement()
  }
  return instance
}

// 保留向后兼容的导出
export const smartEnergyManagement = new Proxy({} as SmartEnergyManagement, {
  get(target, prop) {
    return getSmartEnergyManagement()[prop as keyof SmartEnergyManagement]
  },
})
