"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VRRoom {
  id: string
  name: string
  type: "luxury" | "standard" | "party" | "romantic" | "theme"
  users: number
  capacity: number
  duration: number
  status: "active" | "idle"
}

interface VRRoomSelectorProps {
  onRoomSelect: (roomId: string) => void
}

export function VRRoomSelector({ onRoomSelect }: VRRoomSelectorProps) {
  const [rooms, setRooms] = useState<VRRoom[]>([
    {
      id: "vr-1",
      name: "豪华包厢A",
      type: "luxury",
      users: 4,
      capacity: 8,
      duration: 45,
      status: "active",
    },
    {
      id: "vr-2",
      name: "标准包厢B",
      type: "standard",
      users: 2,
      capacity: 6,
      duration: 30,
      status: "active",
    },
    {
      id: "vr-3",
      name: "派对包厢C",
      type: "party",
      users: 0,
      capacity: 12,
      duration: 0,
      status: "idle",
    },
  ])

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRoom, setNewRoom] = useState({
    name: "",
    type: "standard" as VRRoom["type"],
    capacity: 6,
  })

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId)
    onRoomSelect(roomId)
  }

  const handleCreateRoom = () => {
    const room: VRRoom = {
      id: `vr-${Date.now()}`,
      name: newRoom.name,
      type: newRoom.type,
      users: 0,
      capacity: newRoom.capacity,
      duration: 0,
      status: "idle",
    }

    setRooms([...rooms, room])
    setIsCreateDialogOpen(false)
    setNewRoom({ name: "", type: "standard", capacity: 6 })
  }

  const getRoomTypeLabel = (type: VRRoom["type"]) => {
    const labels = {
      luxury: "豪华",
      standard: "标准",
      party: "派对",
      romantic: "浪漫",
      theme: "主题",
    }
    return labels[type]
  }

  const getRoomTypeColor = (type: VRRoom["type"]) => {
    const colors = {
      luxury: "bg-yellow-500",
      standard: "bg-blue-500",
      party: "bg-purple-500",
      romantic: "bg-pink-500",
      theme: "bg-green-500",
    }
    return colors[type]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">VR包厢列表</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              创建包厢
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建VR包厢</DialogTitle>
              <DialogDescription>配置新的虚拟包厢</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="room-name">包厢名称</Label>
                <Input
                  id="room-name"
                  placeholder="输入包厢名称"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-type">包厢类型</Label>
                <Select
                  value={newRoom.type}
                  onValueChange={(value: VRRoom["type"]) => setNewRoom({ ...newRoom, type: value })}
                >
                  <SelectTrigger id="room-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">豪华</SelectItem>
                    <SelectItem value="standard">标准</SelectItem>
                    <SelectItem value="party">派对</SelectItem>
                    <SelectItem value="romantic">浪漫</SelectItem>
                    <SelectItem value="theme">主题</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room-capacity">容纳人数</Label>
                <Input
                  id="room-capacity"
                  type="number"
                  min="2"
                  max="20"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreateRoom} disabled={!newRoom.name}>
                创建
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedRoom === room.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleRoomClick(room.id)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{room.name}</h4>
                  <Badge variant="secondary" className="mt-1">
                    {getRoomTypeLabel(room.type)}
                  </Badge>
                </div>
                <div className={`w-3 h-3 rounded-full ${room.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {room.users}/{room.capacity}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{room.duration}分钟</span>
                </div>
              </div>

              <div className="flex gap-2">
                <div className={`h-1 flex-1 rounded ${getRoomTypeColor(room.type)}`} />
                <div className="h-1 flex-1 rounded bg-muted" />
                <div className="h-1 flex-1 rounded bg-muted" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
