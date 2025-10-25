"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, Volume2, Users, Settings } from "lucide-react"

interface VRControlPanelProps {
  roomId: string
}

export function VRControlPanel({ roomId }: VRControlPanelProps) {
  const [lighting, setLighting] = useState({
    ambient: 30,
    spotlight: 80,
    colorMode: true,
  })

  const [audio, setAudio] = useState({
    volume: 70,
    spatialAudio: true,
    reverb: 50,
  })

  const [users, setUsers] = useState({
    maxUsers: 8,
    voiceChat: true,
    handTracking: true,
  })

  return (
    <Tabs defaultValue="lighting" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="lighting">
          <Lightbulb className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="audio">
          <Volume2 className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="users">
          <Users className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="lighting" className="space-y-4">
        <div className="space-y-2">
          <Label>环境光亮度</Label>
          <Slider
            value={[lighting.ambient]}
            onValueChange={([value]) => setLighting({ ...lighting, ambient: value })}
            max={100}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{lighting.ambient}%</p>
        </div>

        <div className="space-y-2">
          <Label>聚光灯强度</Label>
          <Slider
            value={[lighting.spotlight]}
            onValueChange={([value]) => setLighting({ ...lighting, spotlight: value })}
            max={100}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{lighting.spotlight}%</p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="color-mode">彩色灯光</Label>
          <Switch
            id="color-mode"
            checked={lighting.colorMode}
            onCheckedChange={(checked) => setLighting({ ...lighting, colorMode: checked })}
          />
        </div>

        <Button className="w-full" size="sm">
          应用灯光设置
        </Button>
      </TabsContent>

      <TabsContent value="audio" className="space-y-4">
        <div className="space-y-2">
          <Label>音量</Label>
          <Slider
            value={[audio.volume]}
            onValueChange={([value]) => setAudio({ ...audio, volume: value })}
            max={100}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{audio.volume}%</p>
        </div>

        <div className="space-y-2">
          <Label>混响效果</Label>
          <Slider
            value={[audio.reverb]}
            onValueChange={([value]) => setAudio({ ...audio, reverb: value })}
            max={100}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{audio.reverb}%</p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="spatial-audio">空间音频</Label>
          <Switch
            id="spatial-audio"
            checked={audio.spatialAudio}
            onCheckedChange={(checked) => setAudio({ ...audio, spatialAudio: checked })}
          />
        </div>

        <Button className="w-full" size="sm">
          应用音频设置
        </Button>
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        <div className="space-y-2">
          <Label>最大用户数</Label>
          <Slider
            value={[users.maxUsers]}
            onValueChange={([value]) => setUsers({ ...users, maxUsers: value })}
            min={2}
            max={20}
            step={1}
          />
          <p className="text-sm text-muted-foreground">{users.maxUsers}人</p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="voice-chat">语音聊天</Label>
          <Switch
            id="voice-chat"
            checked={users.voiceChat}
            onCheckedChange={(checked) => setUsers({ ...users, voiceChat: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="hand-tracking">手部追踪</Label>
          <Switch
            id="hand-tracking"
            checked={users.handTracking}
            onCheckedChange={(checked) => setUsers({ ...users, handTracking: checked })}
          />
        </div>

        <Button className="w-full" size="sm">
          应用用户设置
        </Button>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <div className="space-y-2">
          <Label>渲染质量</Label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high" selected>
              高
            </option>
            <option value="ultra">超高</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>抗锯齿</Label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="none">关闭</option>
            <option value="fxaa">FXAA</option>
            <option value="msaa" selected>
              MSAA 4x
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>帧率限制</Label>
          <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="60">60 FPS</option>
            <option value="90" selected>
              90 FPS
            </option>
            <option value="120">120 FPS</option>
          </select>
        </div>

        <Button className="w-full" size="sm">
          应用系统设置
        </Button>
      </TabsContent>
    </Tabs>
  )
}
