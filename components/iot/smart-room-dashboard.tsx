"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomControlCard } from "./room-control-card"
import { RoomStatusOverview } from "./room-status-overview"

interface Room {
  id: string
  name: string
  floor: number
  capacity: number
  status: "available" | "occupied" | "maintenance"
}

export function SmartRoomDashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载房间数据
    const mockRooms: Room[] = [
      { id: "room-001", name: "豪华包厢A", floor: 1, capacity: 10, status: "occupied" },
      { id: "room-002", name: "豪华包厢B", floor: 1, capacity: 10, status: "available" },
      { id: "room-003", name: "标准包厢A", floor: 2, capacity: 6, status: "occupied" },
      { id: "room-004", name: "标准包厢B", floor: 2, capacity: 6, status: "available" },
      { id: "room-005", name: "VIP包厢", floor: 3, capacity: 15, status: "occupied" },
      { id: "room-006", name: "迷你包厢", floor: 2, capacity: 4, status: "maintenance" },
    ]

    setTimeout(() => {
      setRooms(mockRooms)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="space-y-6">
      <RoomStatusOverview rooms={rooms} />

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">全部房间</TabsTrigger>
          <TabsTrigger value="occupied">使用中</TabsTrigger>
          <TabsTrigger value="available">空闲</TabsTrigger>
          <TabsTrigger value="maintenance">维护中</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomControlCard key={room.id} room={room} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="occupied" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms
              .filter((r) => r.status === "occupied")
              .map((room) => (
                <RoomControlCard key={room.id} room={room} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms
              .filter((r) => r.status === "available")
              .map((room) => (
                <RoomControlCard key={room.id} room={room} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms
              .filter((r) => r.status === "maintenance")
              .map((room) => (
                <RoomControlCard key={room.id} room={room} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
