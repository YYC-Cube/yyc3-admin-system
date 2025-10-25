"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Bell, Network, Send, Plus } from "lucide-react"

interface CommStats {
  totalMessages: number
  unreadMessages: number
  totalGroups: number
  totalNotifications: number
  unreadNotifications: number
}

export function InternalCommDashboard() {
  const [stats, setStats] = useState<CommStats>({
    totalMessages: 0,
    unreadMessages: 0,
    totalGroups: 0,
    totalNotifications: 0,
    unreadNotifications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // 模拟数据加载
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats({
        totalMessages: 1247,
        unreadMessages: 23,
        totalGroups: 15,
        totalNotifications: 89,
        unreadNotifications: 12,
      })
    } catch (error) {
      console.error("[v0] Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总消息数</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="destructive" className="mr-1">
                {stats.unreadMessages}
              </Badge>
              条未读
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">群组数量</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">包含部门、团队、项目群组</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">通知数量</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotifications}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="destructive" className="mr-1">
                {stats.unreadNotifications}
              </Badge>
              条未读
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">组织架构</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">部门 | 15 团队</p>
          </CardContent>
        </Card>
      </div>

      {/* 功能标签页 */}
      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">消息</TabsTrigger>
          <TabsTrigger value="groups">群组</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
          <TabsTrigger value="organization">组织架构</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>消息列表</CardTitle>
              <CardDescription>查看和发送消息</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    发送消息
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">消息列表功能开发中...</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>群组管理</CardTitle>
              <CardDescription>创建和管理群组</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    创建群组
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">群组列表功能开发中...</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>通知中心</CardTitle>
              <CardDescription>查看系统通知和任务提醒</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">通知列表功能开发中...</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>组织架构</CardTitle>
              <CardDescription>查看和管理组织架构</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">组织架构图功能开发中...</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
