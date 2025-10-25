"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Headset, Users, Zap, TrendingUp } from "lucide-react"
import { VRRoomSelector } from "./vr-room-selector"
import { VRViewer } from "./vr-viewer"
import { VRControlPanel } from "./vr-control-panel"

export function VRKaraokeDashboard() {
  const [stats, setStats] = useState({
    activeRooms: 12,
    totalUsers: 48,
    avgSessionTime: 45,
    satisfactionRate: 96,
  })

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃VR房间</CardTitle>
            <Headset className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRooms}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> 较上小时
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在线用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> 较上小时
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均会话时长</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSessionTime}分钟</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5分钟</span> 较昨日
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">满意度</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.satisfactionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                优秀
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* VR房间选择器 */}
      <Card>
        <CardHeader>
          <CardTitle>VR包厢管理</CardTitle>
          <CardDescription>选择或创建VR包厢</CardDescription>
        </CardHeader>
        <CardContent>
          <VRRoomSelector onRoomSelect={setSelectedRoom} />
        </CardContent>
      </Card>

      {/* VR查看器和控制面板 */}
      {selectedRoom && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>VR场景预览</CardTitle>
                <CardDescription>实时VR包厢场景</CardDescription>
              </CardHeader>
              <CardContent>
                <VRViewer roomId={selectedRoom} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>控制面板</CardTitle>
                <CardDescription>VR环境设置</CardDescription>
              </CardHeader>
              <CardContent>
                <VRControlPanel roomId={selectedRoom} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
