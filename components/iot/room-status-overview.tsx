"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Home, Users, Wrench, CheckCircle } from "lucide-react"

interface Room {
  id: string
  name: string
  floor: number
  capacity: number
  status: "available" | "occupied" | "maintenance"
}

interface RoomStatusOverviewProps {
  rooms: Room[]
}

export function RoomStatusOverview({ rooms }: RoomStatusOverviewProps) {
  const stats = {
    total: rooms.length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    available: rooms.filter((r) => r.status === "available").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  }

  const occupancyRate = ((stats.occupied / stats.total) * 100).toFixed(1)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">总房间数</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">使用中</p>
              <p className="text-2xl font-bold">{stats.occupied}</p>
              <p className="text-xs text-muted-foreground mt-1">入住率 {occupancyRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">空闲</p>
              <p className="text-2xl font-bold">{stats.available}</p>
              <p className="text-xs text-muted-foreground mt-1">可立即使用</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">维护中</p>
              <p className="text-2xl font-bold">{stats.maintenance}</p>
              <p className="text-xs text-muted-foreground mt-1">暂不可用</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
