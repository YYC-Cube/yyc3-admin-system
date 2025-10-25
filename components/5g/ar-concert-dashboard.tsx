"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, Zap, TrendingUp } from "lucide-react"
import { ARSceneViewer } from "./ar-scene-viewer"
import { ARControlPanel } from "./ar-control-panel"

export function ARConcertDashboard() {
  const [stats, setStats] = useState({
    activeScenes: 3,
    totalUsers: 156,
    avgLatency: 45,
    engagement: 92,
  })

  return (
    <div className="space-y-6">
      {/* 关键指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">活跃场景</p>
              <p className="text-2xl font-bold mt-1">{stats.activeScenes}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
          <Badge variant="secondary" className="mt-2">
            +2 本周
          </Badge>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">在线用户</p>
              <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
          <Badge variant="secondary" className="mt-2">
            +45% 增长
          </Badge>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">平均延迟</p>
              <p className="text-2xl font-bold mt-1">{stats.avgLatency}ms</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
          <Badge variant="secondary" className="mt-2">
            优秀
          </Badge>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">用户参与度</p>
              <p className="text-2xl font-bold mt-1">{stats.engagement}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
          <Badge variant="secondary" className="mt-2">
            非常高
          </Badge>
        </Card>
      </div>

      {/* AR场景查看器 */}
      <ARSceneViewer />

      {/* AR控制面板 */}
      <ARControlPanel />
    </div>
  )
}
