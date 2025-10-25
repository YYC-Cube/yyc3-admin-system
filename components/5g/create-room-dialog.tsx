"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { realtimeVideoSystem, type RoomConfig } from "@/lib/5g/realtime-video-system"
import { toast } from "sonner"

interface CreateRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRoomCreated: () => void
}

export function CreateRoomDialog({ open, onOpenChange, onRoomCreated }: CreateRoomDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RoomConfig>({
    roomId: `room-${Date.now()}`,
    roomName: "",
    maxParticipants: 10,
    videoQuality: "high",
    audioQuality: "high",
    enableRecording: false,
    enableEffects: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.roomName.trim()) {
      toast.error("请输入房间名称")
      return
    }

    setLoading(true)

    try {
      await realtimeVideoSystem.createRoom(formData)
      toast.success("房间创建成功")
      onRoomCreated()
      onOpenChange(false)

      // 重置表单
      setFormData({
        roomId: `room-${Date.now()}`,
        roomName: "",
        maxParticipants: 10,
        videoQuality: "high",
        audioQuality: "high",
        enableRecording: false,
        enableEffects: true,
      })
    } catch (error) {
      console.error("创建房间失败:", error)
      toast.error("创建房间失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>创建视频房间</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomName">房间名称</Label>
            <Input
              id="roomName"
              placeholder="请输入房间名称"
              value={formData.roomName}
              onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">最大人数</Label>
            <Select
              value={formData.maxParticipants.toString()}
              onValueChange={(value) => setFormData({ ...formData, maxParticipants: Number.parseInt(value) })}
            >
              <SelectTrigger id="maxParticipants">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5人</SelectItem>
                <SelectItem value="10">10人</SelectItem>
                <SelectItem value="20">20人</SelectItem>
                <SelectItem value="50">50人</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoQuality">视频质量</Label>
            <Select
              value={formData.videoQuality}
              onValueChange={(value: any) => setFormData({ ...formData, videoQuality: value })}
            >
              <SelectTrigger id="videoQuality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低 (480p)</SelectItem>
                <SelectItem value="medium">中 (720p)</SelectItem>
                <SelectItem value="high">高 (1080p)</SelectItem>
                <SelectItem value="ultra">超高 (4K)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioQuality">音频质量</Label>
            <Select
              value={formData.audioQuality}
              onValueChange={(value: any) => setFormData({ ...formData, audioQuality: value })}
            >
              <SelectTrigger id="audioQuality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低 (64kbps)</SelectItem>
                <SelectItem value="medium">中 (128kbps)</SelectItem>
                <SelectItem value="high">高 (256kbps)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableRecording">启用录制</Label>
            <Switch
              id="enableRecording"
              checked={formData.enableRecording}
              onCheckedChange={(checked) => setFormData({ ...formData, enableRecording: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enableEffects">启用特效</Label>
            <Switch
              id="enableEffects"
              checked={formData.enableEffects}
              onCheckedChange={(checked) => setFormData({ ...formData, enableEffects: checked })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "创建中..." : "创建房间"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
