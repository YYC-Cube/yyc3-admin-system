"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { realtimeVideoSystem, type VideoRoom, type RoomConnection } from "@/lib/5g/realtime-video-system"
import { toast } from "sonner"

interface VideoRoomViewProps {
  room: VideoRoom
  onLeave: () => void
}

export function VideoRoomView({ room, onLeave }: VideoRoomViewProps) {
  const [connection, setConnection] = useState<RoomConnection | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map())

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideosRef = useRef<Map<string, HTMLVideoElement>>(new Map())

  useEffect(() => {
    // 加入房间
    joinRoom()

    // 监听远程流
    realtimeVideoSystem.on("remote-stream-added", handleRemoteStreamAdded)

    return () => {
      // 离开房间
      if (connection) {
        realtimeVideoSystem.leaveRoom(room.id, connection.userId)
      }
      realtimeVideoSystem.removeAllListeners()
    }
  }, [])

  useEffect(() => {
    // 渲染本地视频
    if (connection && localVideoRef.current) {
      localVideoRef.current.srcObject = connection.localStream
    }
  }, [connection])

  useEffect(() => {
    // 渲染远程视频
    remoteStreams.forEach((stream, userId) => {
      const videoElement = remoteVideosRef.current.get(userId)
      if (videoElement) {
        videoElement.srcObject = stream
      }
    })
  }, [remoteStreams])

  const joinRoom = async () => {
    try {
      const userId = `user-${Date.now()}`
      const conn = await realtimeVideoSystem.joinRoom(room.id, userId)
      setConnection(conn)
      toast.success("加入房间成功")
    } catch (error) {
      console.error("加入房间失败:", error)
      toast.error("加入房间失败")
      onLeave()
    }
  }

  const handleRemoteStreamAdded = ({ roomId, userId, stream }: any) => {
    if (roomId === room.id) {
      setRemoteStreams((prev) => new Map(prev).set(userId, stream))
    }
  }

  const toggleAudio = () => {
    if (connection) {
      const newState = !audioEnabled
      realtimeVideoSystem.toggleAudio(room.id, connection.userId, newState)
      setAudioEnabled(newState)
      toast.success(newState ? "麦克风已开启" : "麦克风已关闭")
    }
  }

  const toggleVideo = () => {
    if (connection) {
      const newState = !videoEnabled
      realtimeVideoSystem.toggleVideo(room.id, connection.userId, newState)
      setVideoEnabled(newState)
      toast.success(newState ? "摄像头已开启" : "摄像头已关闭")
    }
  }

  const handleLeave = async () => {
    if (connection) {
      await realtimeVideoSystem.leaveRoom(room.id, connection.userId)
      toast.success("已离开房间")
    }
    onLeave()
  }

  return (
    <div className="space-y-4">
      {/* 房间信息 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{room.name}</h2>
          <p className="text-sm text-muted-foreground">房间ID: {room.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {room.participants.length} 人在线
          </Badge>
          <Badge variant="secondary">延迟: 45ms</Badge>
        </div>
      </div>

      {/* 视频网格 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 本地视频 */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="relative aspect-video bg-black overflow-hidden">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <Badge variant="secondary">你</Badge>
              <div className="flex gap-2">
                {!audioEnabled && (
                  <div className="h-8 w-8 rounded-full bg-red-500/80 flex items-center justify-center">
                    <MicOff className="h-4 w-4 text-white" />
                  </div>
                )}
                {!videoEnabled && (
                  <div className="h-8 w-8 rounded-full bg-red-500/80 flex items-center justify-center">
                    <VideoOff className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 远程视频 */}
        {Array.from(remoteStreams.entries()).map(([userId, stream], index) => (
          <motion.div
            key={userId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative aspect-video bg-black overflow-hidden">
              <video
                ref={(el) => {
                  if (el) remoteVideosRef.current.set(userId, el)
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary">用户 {userId.slice(-4)}</Badge>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* 空位占位符 */}
        {Array.from({ length: Math.max(0, 6 - remoteStreams.size - 1) }).map((_, index) => (
          <Card key={`empty-${index}`} className="aspect-video bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">等待加入...</p>
            </div>
          </Card>
        ))}
      </div>

      {/* 控制栏 */}
      <Card className="p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant={audioEnabled ? "default" : "destructive"}
            className="h-14 w-14 rounded-full"
            onClick={toggleAudio}
          >
            {audioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          <Button
            size="lg"
            variant={videoEnabled ? "default" : "destructive"}
            className="h-14 w-14 rounded-full"
            onClick={toggleVideo}
          >
            {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button size="lg" variant="outline" className="h-14 w-14 rounded-full bg-transparent">
            <Settings className="h-6 w-6" />
          </Button>

          <Button size="lg" variant="destructive" className="h-14 w-14 rounded-full" onClick={handleLeave}>
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </Card>

      {/* 参与者列表 */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">参与者 ({room.participants.length})</h3>
        <div className="space-y-2">
          {room.participants.map((participant) => (
            <div key={participant.userId} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{participant.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    加入于 {new Date(participant.joinedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {participant.audioEnabled ? (
                  <Mic className="h-4 w-4 text-green-500" />
                ) : (
                  <MicOff className="h-4 w-4 text-muted-foreground" />
                )}
                {participant.videoEnabled ? (
                  <Video className="h-4 w-4 text-green-500" />
                ) : (
                  <VideoOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
