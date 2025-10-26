import mqtt from "mqtt"

// 灯光模式枚举
export enum LightingMode {
  BRIGHT = "bright",
  DIM = "dim",
  ROMANTIC = "romantic",
  PARTY = "party",
  CUSTOM = "custom",
}

// 空调模式枚举
export enum ACMode {
  COOL = "cool",
  HEAT = "heat",
  FAN = "fan",
  DRY = "dry",
  AUTO = "auto",
}

// 场景模式枚举
export enum SceneMode {
  WELCOME = "welcome",
  KARAOKE = "karaoke",
  MOVIE = "movie",
  PARTY = "party",
  RELAX = "relax",
  GOODBYE = "goodbye",
}

// 均衡器设置接口
export interface EqualizerSettings {
  bass: number // -10 to 10
  mid: number // -10 to 10
  treble: number // -10 to 10
  preset?: "rock" | "pop" | "jazz" | "classical" | "custom"
}

// 设备状态接口
export interface DeviceStatus {
  online: boolean
  lastUpdate: number
  battery?: number
  signal?: number
}

// 房间状态接口
export interface RoomStatus {
  roomId: string
  lighting: {
    mode: LightingMode
    brightness: number
    color?: string
    status: DeviceStatus
  }
  airConditioner: {
    temperature: number
    mode: ACMode
    fanSpeed: number
    status: DeviceStatus
  }
  audio: {
    volume: number
    equalizer: EqualizerSettings
    status: DeviceStatus
  }
  scene: SceneMode
  occupancy: boolean
  lastActivity: number
}

/**
 * 智能包厢控制系统
 * 通过IoT设备控制包厢灯光、空调、音响等
 */
export class SmartRoomControl {
  private mqttClient: mqtt.MqttClient | null = null
  private roomStates: Map<string, RoomStatus> = new Map()
  private eventHandlers: Map<string, Function[]> = new Map()

  constructor(
    private brokerUrl: string = process.env.MQTT_BROKER_URL || "mqtt://localhost:1883",
    private username?: string,
    private password?: string,
  ) {
    if (typeof window !== "undefined" || process.env.NODE_ENV === "production") {
      this.connect()
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
        clientId: `smart-room-control-${Date.now()}`,
        clean: true,
        reconnectPeriod: 5000,
      })

      this.mqttClient.on("connect", () => {
        console.log("[SmartRoomControl] Connected to MQTT broker")
        // 订阅所有房间的状态主题
        this.mqttClient?.subscribe("room/+/status")
        this.mqttClient?.subscribe("room/+/device/+/status")
      })

      this.mqttClient.on("message", (topic, message) => {
        this.handleMessage(topic, message)
      })

      this.mqttClient.on("error", (error) => {
        console.error("[SmartRoomControl] MQTT error:", error)
      })
    } catch (error) {
      console.error("[SmartRoomControl] Failed to connect:", error)
    }
  }

  /**
   * 处理MQTT消息
   */
  private handleMessage(topic: string, message: Buffer): void {
    try {
      const data = JSON.parse(message.toString())
      const topicParts = topic.split("/")
      const roomId = topicParts[1]

      // 更新房间状态
      if (topic.endsWith("/status")) {
        this.updateRoomStatus(roomId, data)
      }

      // 触发事件处理器
      const handlers = this.eventHandlers.get(topic) || []
      handlers.forEach((handler) => handler(data))
    } catch (error) {
      console.error("[SmartRoomControl] Failed to handle message:", error)
    }
  }

  /**
   * 更新房间状态
   */
  private updateRoomStatus(roomId: string, data: Partial<RoomStatus>): void {
    const currentState = this.roomStates.get(roomId) || this.getDefaultRoomStatus(roomId)
    this.roomStates.set(roomId, { ...currentState, ...data })
  }

  /**
   * 获取默认房间状态
   */
  private getDefaultRoomStatus(roomId: string): RoomStatus {
    return {
      roomId,
      lighting: {
        mode: LightingMode.BRIGHT,
        brightness: 80,
        status: { online: false, lastUpdate: Date.now() },
      },
      airConditioner: {
        temperature: 24,
        mode: ACMode.AUTO,
        fanSpeed: 2,
        status: { online: false, lastUpdate: Date.now() },
      },
      audio: {
        volume: 50,
        equalizer: { bass: 0, mid: 0, treble: 0, preset: "custom" },
        status: { online: false, lastUpdate: Date.now() },
      },
      scene: SceneMode.WELCOME,
      occupancy: false,
      lastActivity: Date.now(),
    }
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
   * 灯光控制
   */
  async controlLighting(roomId: string, mode: LightingMode, brightness: number, color?: string): Promise<void> {
    const payload = {
      mode,
      brightness: Math.max(0, Math.min(100, brightness)),
      color,
      timestamp: Date.now(),
    }

    await this.publish(`room/${roomId}/device/lighting/control`, payload)

    // 更新本地状态
    this.updateRoomStatus(roomId, {
      lighting: {
        ...payload,
        status: { online: true, lastUpdate: Date.now() },
      },
    })
  }

  /**
   * 空调控制
   */
  async controlAirConditioner(roomId: string, temperature: number, mode: ACMode, fanSpeed = 2): Promise<void> {
    const payload = {
      temperature: Math.max(16, Math.min(30, temperature)),
      mode,
      fanSpeed: Math.max(1, Math.min(5, fanSpeed)),
      timestamp: Date.now(),
    }

    await this.publish(`room/${roomId}/device/ac/control`, payload)

    // 更新本地状态
    this.updateRoomStatus(roomId, {
      airConditioner: {
        ...payload,
        status: { online: true, lastUpdate: Date.now() },
      },
    })
  }

  /**
   * 音响控制
   */
  async controlAudio(roomId: string, volume: number, equalizer: EqualizerSettings): Promise<void> {
    const payload = {
      volume: Math.max(0, Math.min(100, volume)),
      equalizer: {
        bass: Math.max(-10, Math.min(10, equalizer.bass)),
        mid: Math.max(-10, Math.min(10, equalizer.mid)),
        treble: Math.max(-10, Math.min(10, equalizer.treble)),
        preset: equalizer.preset || "custom",
      },
      timestamp: Date.now(),
    }

    await this.publish(`room/${roomId}/device/audio/control`, payload)

    // 更新本地状态
    this.updateRoomStatus(roomId, {
      audio: {
        ...payload,
        status: { online: true, lastUpdate: Date.now() },
      },
    })
  }

  /**
   * 场景模式设置
   */
  async setSceneMode(roomId: string, scene: SceneMode): Promise<void> {
    // 根据场景模式设置所有设备
    const sceneConfigs = {
      [SceneMode.WELCOME]: {
        lighting: { mode: LightingMode.BRIGHT, brightness: 80 },
        ac: { temperature: 24, mode: ACMode.AUTO },
        audio: { volume: 30, equalizer: { bass: 0, mid: 0, treble: 0 } },
      },
      [SceneMode.KARAOKE]: {
        lighting: { mode: LightingMode.PARTY, brightness: 70 },
        ac: { temperature: 22, mode: ACMode.COOL },
        audio: { volume: 70, equalizer: { bass: 5, mid: 0, treble: 3 } },
      },
      [SceneMode.MOVIE]: {
        lighting: { mode: LightingMode.DIM, brightness: 20 },
        ac: { temperature: 23, mode: ACMode.AUTO },
        audio: { volume: 60, equalizer: { bass: 3, mid: 0, treble: 2 } },
      },
      [SceneMode.PARTY]: {
        lighting: { mode: LightingMode.PARTY, brightness: 90 },
        ac: { temperature: 21, mode: ACMode.COOL },
        audio: { volume: 80, equalizer: { bass: 7, mid: 2, treble: 5 } },
      },
      [SceneMode.RELAX]: {
        lighting: { mode: LightingMode.ROMANTIC, brightness: 40 },
        ac: { temperature: 25, mode: ACMode.AUTO },
        audio: { volume: 40, equalizer: { bass: 2, mid: 0, treble: 1 } },
      },
      [SceneMode.GOODBYE]: {
        lighting: { mode: LightingMode.BRIGHT, brightness: 100 },
        ac: { temperature: 26, mode: ACMode.FAN },
        audio: { volume: 20, equalizer: { bass: 0, mid: 0, treble: 0 } },
      },
    }

    const config = sceneConfigs[scene]

    // 并行设置所有设备
    await Promise.all([
      this.controlLighting(roomId, config.lighting.mode, config.lighting.brightness),
      this.controlAirConditioner(roomId, config.ac.temperature, config.ac.mode),
      this.controlAudio(roomId, config.audio.volume, config.audio.equalizer as EqualizerSettings),
    ])

    // 更新场景状态
    this.updateRoomStatus(roomId, { scene })

    await this.publish(`room/${roomId}/scene`, { scene, timestamp: Date.now() })
  }

  /**
   * 获取房间状态
   */
  getRoomStatus(roomId: string): RoomStatus | undefined {
    return this.roomStates.get(roomId)
  }

  /**
   * 获取所有房间状态
   */
  getAllRoomStatus(): RoomStatus[] {
    return Array.from(this.roomStates.values())
  }

  /**
   * 订阅房间事件
   */
  subscribe(topic: string, handler: Function): void {
    const handlers = this.eventHandlers.get(topic) || []
    handlers.push(handler)
    this.eventHandlers.set(topic, handlers)

    // 订阅MQTT主题
    this.mqttClient?.subscribe(topic)
  }

  /**
   * 取消订阅
   */
  unsubscribe(topic: string, handler?: Function): void {
    if (handler) {
      const handlers = this.eventHandlers.get(topic) || []
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
      this.eventHandlers.set(topic, handlers)
    } else {
      this.eventHandlers.delete(topic)
      this.mqttClient?.unsubscribe(topic)
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.mqttClient?.end()
    this.mqttClient = null
  }
}

let instance: SmartRoomControl | null = null

export function getSmartRoomControl(): SmartRoomControl {
  if (!instance) {
    instance = new SmartRoomControl()
  }
  return instance
}

// 保留向后兼容的导出
export const smartRoomControl = new Proxy({} as SmartRoomControl, {
  get(target, prop) {
    return getSmartRoomControl()[prop as keyof SmartRoomControl]
  },
})
