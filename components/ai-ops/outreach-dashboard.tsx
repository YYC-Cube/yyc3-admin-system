"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, MessageSquare, Mail, Users } from "lucide-react"
import { FollowUpPanel } from "@/components/ai-ops/follow-up-panel"
import { SMSPanel } from "@/components/ai-ops/sms-panel"
import { CallPanel } from "@/components/ai-ops/call-panel"
import { ContactHistoryPanel } from "@/components/ai-ops/contact-history-panel"

export function OutreachDashboard() {
  const [stats, setStats] = useState({
    pendingFollowUps: 0,
    smsSentToday: 0,
    callsMadeToday: 0,
    responseRate: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 获取待跟进数量
      const followUpRes = await fetch("/api/ai-ops/outreach/follow-up")
      const followUpData = await followUpRes.json()

      setStats({
        pendingFollowUps: followUpData.total || 0,
        smsSentToday: 156, // 模拟数据
        callsMadeToday: 42, // 模拟数据
        responseRate: 68, // 模拟数据
      })
    } catch (error) {
      console.error("[v0] Failed to fetch stats:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">待跟进客户</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingFollowUps}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">今日短信</p>
              <p className="text-3xl font-bold mt-2">{stats.smsSentToday}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">今日呼叫</p>
              <p className="text-3xl font-bold mt-2">{stats.callsMadeToday}</p>
            </div>
            <Phone className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">响应率</p>
              <p className="text-3xl font-bold mt-2">{stats.responseRate}%</p>
            </div>
            <Mail className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* 功能面板 */}
      <Tabs defaultValue="follow-up" className="space-y-6">
        <TabsList>
          <TabsTrigger value="follow-up">智能回访</TabsTrigger>
          <TabsTrigger value="sms">短信系统</TabsTrigger>
          <TabsTrigger value="call">呼叫系统</TabsTrigger>
          <TabsTrigger value="history">联系历史</TabsTrigger>
        </TabsList>

        <TabsContent value="follow-up">
          <FollowUpPanel />
        </TabsContent>

        <TabsContent value="sms">
          <SMSPanel />
        </TabsContent>

        <TabsContent value="call">
          <CallPanel />
        </TabsContent>

        <TabsContent value="history">
          <ContactHistoryPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
