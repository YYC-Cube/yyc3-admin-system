"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Mic, Users, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { realtimeVideoSystem, type VideoRoom } from "@/lib/5g/realtime-video-system"
import { CreateRoomDialog } from "./create-room-dialog"
import { VideoRoomView } from "./video-room-view"

export function VideoRoomDashboard() {
  const [rooms, setRooms] = useState<VideoRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<VideoRoom | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    // 加载房间列表
    loadRooms()

    // 监听房间事件
    realtimeVideoSystem.on("room-created", loadRooms)
    realtimeVideoSystem.on("room-joined", loadRooms)
    realtimeVideoSystem.on("room-left", loadRooms)

    return () => {
      realtimeVideoSystem.removeAllListeners()
    }
  }, [])

  const loadRooms = () => {
    const allRooms = realtimeVideoSystem.getAllRooms()
    setRooms(allRooms)
  }

  if (selectedRoom) {
    return <VideoRoomView room={selectedRoom} onLeave={() => setSelectedRoom(null)} />
  }

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">活跃房间</p>
                <p className="text-3xl font-bold mt-2">{rooms.filter((r) => r.status === "active").length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Video className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">在线用户</p>
                <p className="text-3xl font-bold mt-2">{rooms.reduce((sum, r) => sum + r.participants.length, 0)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均延迟</p>
                <p className="text-3xl font-bold mt-2">45ms</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Mic className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 创建房间按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">视频房间</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          创建房间
        </Button>
      </div>

      {/* 房间列表 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedRoom(room)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <p className="text-sm text-muted-foreground">房间ID: {room.id}</p>
                </div>
                <Badge variant={room.status === "active" ? "default" : "secondary"}>
                  {room.status === "active" ? "活跃" : "空闲"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{room.participants.length} 人在线</span>
                </div>

                <div className="flex items-center text-sm">
                  <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>创建于 {new Date(room.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-transparent" variant="outline">
                加入房间
              </Button>
            </Card>
          </motion.div>
        ))}

        {rooms.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无活跃房间</p>
            <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
              创建第一个房间
            </Button>
          </div>
        )}
      </div>

      {/* 创建房间对话框 */}
      <CreateRoomDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onRoomCreated={loadRooms} />
    </div>
  )
}
