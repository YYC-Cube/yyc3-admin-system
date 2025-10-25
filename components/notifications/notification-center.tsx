"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Check, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Notification, NotificationType } from "@/lib/types"
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/services/notification"
import { cn } from "@/lib/utils"

// 通知中心组件
export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // 加载通知
  useEffect(() => {
    loadNotifications()

    // 监听新通知
    const handleNewNotification = (event: CustomEvent) => {
      setNotifications((prev) => [event.detail, ...prev])
      setUnreadCount((prev) => prev + 1)
    }

    window.addEventListener("notification" as any, handleNewNotification)

    return () => {
      window.removeEventListener("notification" as any, handleNewNotification)
    }
  }, [])

  const loadNotifications = async () => {
    const data = await getUserNotifications("current-user")
    setNotifications(data)
    setUnreadCount(data.filter((n) => !n.isRead).length)
  }

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead("current-user")
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const handleDelete = async (id: string) => {
    await deleteNotification(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: NotificationType) => {
    const icons = {
      [NotificationType.ORDER]: "🛒",
      [NotificationType.PAYMENT]: "💰",
      [NotificationType.INVENTORY]: "📦",
      [NotificationType.MEMBER]: "👤",
      [NotificationType.SYSTEM]: "⚙️",
    }
    return icons[type] || "📢"
  }

  return (
    <div className="relative">
      {/* 通知按钮 */}
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
          </span>
        )}
      </Button>

      {/* 通知面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 通知列表 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 z-50 w-96"
            >
              <Card className="shadow-xl">
                {/* 头部 */}
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div>
                    <h3 className="font-semibold text-foreground">通知中心</h3>
                    <p className="text-xs text-muted-foreground">{unreadCount} 条未读</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                        <Check className="mr-1 h-4 w-4" />
                        全部已读
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 通知列表 */}
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-8 text-center">
                      <div>
                        <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <p className="mt-2 text-sm text-muted-foreground">暂无通知</p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={cn(
                            "group relative p-4 transition-colors hover:bg-accent",
                            !notification.isRead && "bg-blue-50/50",
                          )}
                        >
                          <div className="flex gap-3">
                            <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-foreground">{notification.title}</p>
                                {!notification.isRead && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                              </div>
                              <p className="text-xs text-muted-foreground">{notification.content}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(notification.createdAt).toLocaleString("zh-CN")}
                              </p>
                            </div>
                          </div>

                          {/* 操作按钮 */}
                          <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-destructive"
                              onClick={() => handleDelete(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
