// WebSocket实时协作系统
export interface RealtimeEvent {
  type: string
  payload: any
  userId: string
  timestamp: Date
}

export interface CollaborationState {
  activeUsers: Set<string>
  cursors: Map<string, { x: number; y: number }>
  selections: Map<string, any>
  locks: Map<string, string> // resourceId -> userId
}

export class RealtimeCollaboration {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventHandlers = new Map<string, Array<Function>>()
  private state: CollaborationState = {
    activeUsers: new Set(),
    cursors: new Map(),
    selections: new Map(),
    locks: new Map(),
  }

  // 连接WebSocket服务器
  connect(url: string, userId: string) {
    try {
      this.ws = new WebSocket(`${url}?userId=${userId}`)

      this.ws.onopen = () => {
        console.log("[WebSocket] 连接成功")
        this.reconnectAttempts = 0
        this.emit("connected", { userId })
      }

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.handleMessage(data)
      }

      this.ws.onerror = (error) => {
        console.error("[WebSocket] 连接错误:", error)
        this.emit("error", error)
      }

      this.ws.onclose = () => {
        console.log("[WebSocket] 连接关闭")
        this.emit("disconnected", {})
        this.attemptReconnect(url, userId)
      }
    } catch (error) {
      console.error("[WebSocket] 连接失败:", error)
      this.attemptReconnect(url, userId)
    }
  }

  // 重连机制
  private attemptReconnect(url: string, userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

      console.log(`[WebSocket] ${delay}ms后尝试第${this.reconnectAttempts}次重连...`)

      setTimeout(() => {
        this.connect(url, userId)
      }, delay)
    } else {
      console.error("[WebSocket] 达到最大重连次数，停止重连")
      this.emit("reconnect-failed", {})
    }
  }

  // 发送事件
  send(event: RealtimeEvent) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event))
    } else {
      console.warn("[WebSocket] 连接未就绪，无法发送消息")
    }
  }

  // 处理接收到的消息
  private handleMessage(data: RealtimeEvent) {
    switch (data.type) {
      case "user-joined":
        this.state.activeUsers.add(data.payload.userId)
        break

      case "user-left":
        this.state.activeUsers.delete(data.payload.userId)
        this.state.cursors.delete(data.payload.userId)
        break

      case "cursor-move":
        this.state.cursors.set(data.userId, data.payload)
        break

      case "resource-locked":
        this.state.locks.set(data.payload.resourceId, data.userId)
        break

      case "resource-unlocked":
        this.state.locks.delete(data.payload.resourceId)
        break
    }

    this.emit(data.type, data)
  }

  // 注册事件监听器
  on(eventType: string, handler: Function) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)!.push(handler)
  }

  // 移除事件监听器
  off(eventType: string, handler: Function) {
    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // 触发事件
  private emit(eventType: string, data: any) {
    const handlers = this.eventHandlers.get(eventType) || []
    handlers.forEach((handler) => handler(data))
  }

  // 广播光标位置
  broadcastCursor(x: number, y: number) {
    this.send({
      type: "cursor-move",
      payload: { x, y },
      userId: this.getCurrentUserId(),
      timestamp: new Date(),
    })
  }

  // 锁定资源
  lockResource(resourceId: string) {
    this.send({
      type: "resource-lock",
      payload: { resourceId },
      userId: this.getCurrentUserId(),
      timestamp: new Date(),
    })
  }

  // 解锁资源
  unlockResource(resourceId: string) {
    this.send({
      type: "resource-unlock",
      payload: { resourceId },
      userId: this.getCurrentUserId(),
      timestamp: new Date(),
    })
  }

  // 获取当前用户ID
  private getCurrentUserId(): string {
    // 从认证状态获取
    return "current-user-id"
  }

  // 获取协作状态
  getState(): CollaborationState {
    return this.state
  }

  // 断开连接
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// 全局实时协作实例
export const realtimeCollaboration = new RealtimeCollaboration()
