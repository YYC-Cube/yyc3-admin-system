'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, Bell, Network, Send, Plus } from 'lucide-react'

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
      await new Promise(resolve => setTimeout(resolve, 1000))

      setStats({
        totalMessages: 1247,
        unreadMessages: 23,
        totalGroups: 15,
        totalNotifications: 89,
        unreadNotifications: 12,
      })
    } catch (error) {
      console.error('[v0] Error loading stats:', error)
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
                <div className="flex gap-2 mb-4">
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    发送消息
                  </Button>
                </div>
                <div className="space-y-3">
                  {[
                    { from: '张三', content: '今天会议几点开始?', time: '5分钟前', unread: true },
                    { from: '李四', content: '文档已经更新完成了', time: '1小时前', unread: true },
                    { from: '王五', content: '收到,马上处理', time: '3小时前', unread: false },
                  ].map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg ${msg.unread ? 'bg-accent/50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{msg.from}</span>
                            {msg.unread && <Badge className="h-5 px-1.5">新</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="flex gap-2 mb-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    创建群组
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { name: '技术部门', members: 12, unread: 3, lastMsg: '讨论新需求...' },
                    { name: '运营团队', members: 8, unread: 0, lastMsg: '数据报表已提交' },
                    { name: '项目A组', members: 15, unread: 5, lastMsg: '明天例会通知' },
                    { name: '管理层', members: 6, unread: 1, lastMsg: '季度总结会议' },
                  ].map((group, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{group.name}</CardTitle>
                          {group.unread > 0 && <Badge variant="destructive">{group.unread}</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-2">{group.members} 位成员</p>
                        <p className="text-sm text-muted-foreground truncate">{group.lastMsg}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
              <div className="space-y-3">
                {[
                  {
                    type: '系统通知',
                    title: '系统维护通知',
                    content: '本周六凌晨2点进行系统维护',
                    time: '2小时前',
                    priority: 'high',
                  },
                  {
                    type: '任务提醒',
                    title: '任务即将到期',
                    content: '项目A的交付截止日期为明天',
                    time: '5小时前',
                    priority: 'medium',
                  },
                  {
                    type: '审批通知',
                    title: '请假申请已批准',
                    content: '您的请假申请已通过',
                    time: '1天前',
                    priority: 'low',
                  },
                ].map((notif, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-lg ${notif.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : notif.priority === 'medium' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="text-xs font-medium text-muted-foreground">
                            {notif.type}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold">{notif.title}</h4>
                        <p className="text-sm text-muted-foreground">{notif.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                <div className="p-4 border-2 border-primary rounded-lg text-center">
                  <p className="font-semibold">CEO - 张总</p>
                  <p className="text-xs text-muted-foreground">首席执行官</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { dept: '技术部', head: '李经理', count: 25 },
                    { dept: '运营部', head: '王经理', count: 18 },
                    { dept: '市场部', head: '赵经理', count: 15 },
                  ].map((dept, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Network className="h-4 w-4 text-primary" />
                        <p className="font-semibold">{dept.dept}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">负责人: {dept.head}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {dept.count} 人
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
