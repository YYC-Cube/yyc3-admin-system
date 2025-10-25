"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, Volume2, Sparkles, Users } from "lucide-react"

export function ARControlPanel() {
  const [lighting, setLighting] = useState(80)
  const [volume, setVolume] = useState(70)
  const [effects, setEffects] = useState(true)
  const [multiUser, setMultiUser] = useState(false)
  const [selectedSinger, setSelectedSinger] = useState("singer-001")
  const [selectedAnimation, setSelectedAnimation] = useState("dance")

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">AR控制面板</h2>

      <Tabs defaultValue="scene" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scene">场景</TabsTrigger>
          <TabsTrigger value="singer">歌手</TabsTrigger>
          <TabsTrigger value="effects">特效</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        {/* 场景控制 */}
        <TabsContent value="scene" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                灯光强度
              </Label>
              <span className="text-sm text-muted-foreground">{lighting}%</span>
            </div>
            <Slider value={[lighting]} onValueChange={(v) => setLighting(v[0])} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                音量
              </Label>
              <span className="text-sm text-muted-foreground">{volume}%</span>
            </div>
            <Slider value={[volume]} onValueChange={(v) => setVolume(v[0])} max={100} step={1} />
          </div>

          <div className="space-y-2">
            <Label>场景模式</Label>
            <Select defaultValue="concert">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concert">演唱会</SelectItem>
                <SelectItem value="party">派对</SelectItem>
                <SelectItem value="intimate">私密场</SelectItem>
                <SelectItem value="outdoor">户外</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* 歌手控制 */}
        <TabsContent value="singer" className="space-y-4">
          <div className="space-y-2">
            <Label>选择歌手</Label>
            <Select value={selectedSinger} onValueChange={setSelectedSinger}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="singer-001">虚拟偶像小美</SelectItem>
                <SelectItem value="singer-002">虚拟歌手小明</SelectItem>
                <SelectItem value="singer-003">虚拟乐队</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>动画</Label>
            <Select value={selectedAnimation} onValueChange={setSelectedAnimation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idle">待机</SelectItem>
                <SelectItem value="dance">舞蹈</SelectItem>
                <SelectItem value="wave">挥手</SelectItem>
                <SelectItem value="sing">唱歌</SelectItem>
                <SelectItem value="jump">跳跃</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full bg-transparent">
              更换服装
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              更换发型
            </Button>
          </div>
        </TabsContent>

        {/* 特效控制 */}
        <TabsContent value="effects" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              启用特效
            </Label>
            <Switch checked={effects} onCheckedChange={setEffects} />
          </div>

          <div className="space-y-2">
            <Label>粒子效果</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                烟花
              </Button>
              <Button variant="outline" size="sm">
                星光
              </Button>
              <Button variant="outline" size="sm">
                泡泡
              </Button>
              <Button variant="outline" size="sm">
                彩带
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>滤镜效果</Label>
            <Select defaultValue="none">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无</SelectItem>
                <SelectItem value="vintage">复古</SelectItem>
                <SelectItem value="neon">霓虹</SelectItem>
                <SelectItem value="dreamy">梦幻</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* 设置 */}
        <TabsContent value="settings" className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              多人模式
            </Label>
            <Switch checked={multiUser} onCheckedChange={setMultiUser} />
          </div>

          <div className="space-y-2">
            <Label>画质</Label>
            <Select defaultValue="high">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">低</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="ultra">超高</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>帧率限制</Label>
            <Select defaultValue="60">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 FPS</SelectItem>
                <SelectItem value="60">60 FPS</SelectItem>
                <SelectItem value="120">120 FPS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-transparent" variant="outline">
            重置所有设置
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
