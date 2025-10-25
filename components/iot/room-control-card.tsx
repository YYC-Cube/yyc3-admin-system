"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, Wind, Volume2, Settings, Music, Sun, Moon, Heart, PartyPopper } from "lucide-react"
import { LightingMode, ACMode, SceneMode } from "@/lib/iot/smart-room-control"

interface Room {
  id: string
  name: string
  floor: number
  capacity: number
  status: "available" | "occupied" | "maintenance"
}

interface RoomControlCardProps {
  room: Room
}

export function RoomControlCard({ room }: RoomControlCardProps) {
  const [lighting, setLighting] = useState({
    mode: LightingMode.BRIGHT,
    brightness: 80,
  })
  const [ac, setAc] = useState({
    temperature: 24,
    mode: ACMode.AUTO,
  })
  const [audio, setAudio] = useState({
    volume: 50,
  })
  const [isControlling, setIsControlling] = useState(false)

  const statusColors = {
    available: "bg-green-500",
    occupied: "bg-blue-500",
    maintenance: "bg-yellow-500",
  }

  const statusLabels = {
    available: "空闲",
    occupied: "使用中",
    maintenance: "维护中",
  }

  const handleLightingChange = async (mode: LightingMode, brightness: number) => {
    setIsControlling(true)
    try {
      const response = await fetch(`/api/iot/rooms/${room.id}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lighting",
          mode,
          brightness,
        }),
      })
      if (response.ok) {
        setLighting({ mode, brightness })
      }
    } catch (error) {
      console.error("Failed to control lighting:", error)
    } finally {
      setIsControlling(false)
    }
  }

  const handleAcChange = async (temperature: number, mode: ACMode) => {
    setIsControlling(true)
    try {
      const response = await fetch(`/api/iot/rooms/${room.id}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ac",
          temperature,
          mode,
        }),
      })
      if (response.ok) {
        setAc({ temperature, mode })
      }
    } catch (error) {
      console.error("Failed to control AC:", error)
    } finally {
      setIsControlling(false)
    }
  }

  const handleAudioChange = async (volume: number) => {
    setIsControlling(true)
    try {
      const response = await fetch(`/api/iot/rooms/${room.id}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "audio",
          volume,
          equalizer: { bass: 0, mid: 0, treble: 0 },
        }),
      })
      if (response.ok) {
        setAudio({ volume })
      }
    } catch (error) {
      console.error("Failed to control audio:", error)
    } finally {
      setIsControlling(false)
    }
  }

  const handleSceneChange = async (scene: SceneMode) => {
    setIsControlling(true)
    try {
      const response = await fetch(`/api/iot/rooms/${room.id}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "scene",
          scene,
        }),
      })
      if (response.ok) {
        // 场景模式会自动设置所有设备
      }
    } catch (error) {
      console.error("Failed to set scene:", error)
    } finally {
      setIsControlling(false)
    }
  }

  const sceneIcons = {
    [SceneMode.WELCOME]: Sun,
    [SceneMode.KARAOKE]: Music,
    [SceneMode.MOVIE]: Moon,
    [SceneMode.PARTY]: PartyPopper,
    [SceneMode.RELAX]: Heart,
    [SceneMode.GOODBYE]: Sun,
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <CardDescription>
              {room.floor}楼 · 容纳{room.capacity}人
            </CardDescription>
          </div>
          <Badge className={statusColors[room.status]}>{statusLabels[room.status]}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices">设备控制</TabsTrigger>
            <TabsTrigger value="scenes">场景模式</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4 mt-4">
            {/* 灯光控制 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  灯光
                </Label>
                <span className="text-sm text-muted-foreground">{lighting.brightness}%</span>
              </div>
              <Slider
                value={[lighting.brightness]}
                onValueChange={([value]) => handleLightingChange(lighting.mode, value)}
                max={100}
                step={1}
                disabled={isControlling || room.status === "maintenance"}
              />
              <div className="flex gap-2">
                {[
                  { mode: LightingMode.BRIGHT, label: "明亮" },
                  { mode: LightingMode.DIM, label: "昏暗" },
                  { mode: LightingMode.PARTY, label: "派对" },
                ].map(({ mode, label }) => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={lighting.mode === mode ? "default" : "outline"}
                    onClick={() => handleLightingChange(mode, lighting.brightness)}
                    disabled={isControlling || room.status === "maintenance"}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 空调控制 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Wind className="h-4 w-4" />
                  空调
                </Label>
                <span className="text-sm text-muted-foreground">{ac.temperature}°C</span>
              </div>
              <Slider
                value={[ac.temperature]}
                onValueChange={([value]) => handleAcChange(value, ac.mode)}
                min={16}
                max={30}
                step={1}
                disabled={isControlling || room.status === "maintenance"}
              />
              <Select
                value={ac.mode}
                onValueChange={(value) => handleAcChange(ac.temperature, value as ACMode)}
                disabled={isControlling || room.status === "maintenance"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ACMode.COOL}>制冷</SelectItem>
                  <SelectItem value={ACMode.HEAT}>制热</SelectItem>
                  <SelectItem value={ACMode.FAN}>送风</SelectItem>
                  <SelectItem value={ACMode.AUTO}>自动</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 音响控制 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  音响
                </Label>
                <span className="text-sm text-muted-foreground">{audio.volume}%</span>
              </div>
              <Slider
                value={[audio.volume]}
                onValueChange={([value]) => handleAudioChange(value)}
                max={100}
                step={1}
                disabled={isControlling || room.status === "maintenance"}
              />
            </div>
          </TabsContent>

          <TabsContent value="scenes" className="space-y-2 mt-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { scene: SceneMode.WELCOME, label: "欢迎", desc: "明亮舒适" },
                { scene: SceneMode.KARAOKE, label: "K歌", desc: "动感氛围" },
                { scene: SceneMode.MOVIE, label: "电影", desc: "昏暗安静" },
                { scene: SceneMode.PARTY, label: "派对", desc: "热烈欢快" },
                { scene: SceneMode.RELAX, label: "放松", desc: "温馨浪漫" },
                { scene: SceneMode.GOODBYE, label: "告别", desc: "明亮整洁" },
              ].map(({ scene, label, desc }) => {
                const Icon = sceneIcons[scene]
                return (
                  <Button
                    key={scene}
                    variant="outline"
                    className="h-auto flex-col items-start p-3 bg-transparent"
                    onClick={() => handleSceneChange(scene)}
                    disabled={isControlling || room.status === "maintenance"}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{desc}</span>
                  </Button>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {room.status === "maintenance" && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
            <Settings className="h-4 w-4" />
            <span>房间维护中，设备控制已禁用</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
