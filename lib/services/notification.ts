// 通知服务

import { type Notification, NotificationType } from "@/lib/types"
import { mockDB } from "@/lib/utils/storage"

// 创建通知
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  content: string,
  data?: any,
): Promise<Notification> {
  const notification: Notification = {
    id: `NOTIF${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    content,
    data,
    isRead: false,
    createdAt: new Date().toISOString(),
  }

  // 保存到数据库
  const notifications = mockDB.get<Notification>("notifications") || []
  notifications.unshift(notification)
  mockDB.set("notifications", notifications)

  // 触发实时推送（WebSocket）
  broadcastNotification(notification)

  return notification
}

// 获取用户通知列表
export async function getUserNotifications(userId: string, unreadOnly = false): Promise<Notification[]> {
  const notifications = mockDB.get<Notification>("notifications") || []

  return notifications.filter((n) => {
    if (n.userId !== userId) return false
    if (unreadOnly && n.isRead) return false
    return true
  })
}

// 标记通知为已读
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const notifications = mockDB.get<Notification>("notifications") || []
  const notification = notifications.find((n) => n.id === notificationId)

  if (notification) {
    notification.isRead = true
    mockDB.set("notifications", notifications)
    return true
  }

  return false
}

// 标记所有通知为已读
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const notifications = mockDB.get<Notification>("notifications") || []

  notifications.forEach((n) => {
    if (n.userId === userId) {
      n.isRead = true
    }
  })

  mockDB.set("notifications", notifications)
  return true
}

// 删除通知
export async function deleteNotification(notificationId: string): Promise<boolean> {
  const notifications = mockDB.get<Notification>("notifications") || []
  const index = notifications.findIndex((n) => n.id === notificationId)

  if (index !== -1) {
    notifications.splice(index, 1)
    mockDB.set("notifications", notifications)
    return true
  }

  return false
}

// 广播通知（WebSocket模拟）
function broadcastNotification(notification: Notification) {
  // 模拟WebSocket推送
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("notification", {
        detail: notification,
      }),
    )
  }
}

// 创建订单通知
export async function notifyOrderCreated(userId: string, orderId: string, amount: number) {
  return createNotification(
    userId,
    NotificationType.ORDER,
    "新订单创建",
    `订单 ${orderId} 已创建，金额 ¥${amount.toFixed(2)}`,
    { orderId, amount },
  )
}

// 创建支付通知
export async function notifyPaymentSuccess(userId: string, orderId: string, amount: number) {
  return createNotification(
    userId,
    NotificationType.PAYMENT,
    "支付成功",
    `订单 ${orderId} 支付成功，金额 ¥${amount.toFixed(2)}`,
    { orderId, amount },
  )
}

// 创建库存预警通知
export async function notifyLowStock(userId: string, productName: string, stock: number) {
  return createNotification(
    userId,
    NotificationType.INVENTORY,
    "库存预警",
    `商品 ${productName} 库存不足，当前库存 ${stock}`,
    { productName, stock },
  )
}
