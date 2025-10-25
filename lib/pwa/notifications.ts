// PWA推送通知服务

export class NotificationService {
  private static instance: NotificationService
  private registration: ServiceWorkerRegistration | null = null

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // 初始化Service Worker
  async initialize(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register("/sw.js")
        console.log("[PWA] Service Worker注册成功")
      } catch (error) {
        console.error("[PWA] Service Worker注册失败:", error)
      }
    }
  }

  // 请求通知权限
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("[PWA] 浏览器不支持通知")
      return "denied"
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  // 发送本地通知
  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    const permission = await this.requestPermission()

    if (permission === "granted" && this.registration) {
      await this.registration.showNotification(title, {
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        ...options,
      })
    }
  }

  // 订阅推送通知
  async subscribePush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize()
    }

    if (!this.registration) {
      return null
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""),
      })
      return subscription
    } catch (error) {
      console.error("[PWA] 订阅推送失败:", error)
      return null
    }
  }

  // 取消订阅
  async unsubscribePush(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    const subscription = await this.registration.pushManager.getSubscription()
    if (subscription) {
      return await subscription.unsubscribe()
    }
    return false
  }

  // 工具函数：转换VAPID密钥
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

// 导出单例
export const notificationService = NotificationService.getInstance()
