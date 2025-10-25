"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// VOD在线设置页面
export default function VODSettingsPage() {
  const [settings, setSettings] = useState({
    // 大厅公视配置
    hallBroadcast: {
      enabled: true,
      channel1: "230.1.1.10",
      channel2: "",
    },
    // 智能灯光配置
    lighting: {
      enabled: true,
      autoControl: true,
      comPort: "/dev/ttyS2",
      deviceType: "6",
    },
    // 开房播放设置
    roomPlayback: {
      enabled: true,
      videoPath: "/vod/opening/",
      autoPlay: true,
    },
    // 开机播放设置
    bootPlayback: {
      enabled: true,
      videoPath: "/vod/boot/",
      autoPlay: true,
    },
    // 包厢配置
    roomConfig: {
      pacConfig: "",
      roomConfig: "电影模块=开启",
      dajianpanConfig: "",
    },
  })

  const handleSave = () => {
    // 保存设置逻辑
    toast.success("设置保存成功")
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">VOD在线设置</h1>
          <p className="text-muted-foreground mt-1">配置点播系统参数</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </Button>
      </motion.div>

      {/* 设置选项卡 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Tabs defaultValue="broadcast" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="broadcast">
              <Monitor className="mr-2 h-4 w-4" />
              大厅公视
            </TabsTrigger>
            <TabsTrigger value="lighting">智能灯光</TabsTrigger>
            <TabsTrigger value="room-play">开房播放</TabsTrigger>
            <TabsTrigger value="boot-play">开机播放</TabsTrigger>
            <TabsTrigger value="room-config">包厢配置</TabsTrigger>
          </TabsList>

          {/* 大厅公视配置 */}
          <TabsContent value="broadcast">
            <Card>
              <CardHeader>
                <CardTitle>大厅公视配置</CardTitle>
                <CardDescription>配置大厅转播服务器，将其他视频转播至包厢</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="broadcast-enabled">启用大厅公视</Label>
                  <Switch
                    id="broadcast-enabled"
                    checked={settings.hallBroadcast.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        hallBroadcast: { ...settings.hallBroadcast, enabled: checked },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel1">转播地址1</Label>
                  <Input
                    id="channel1"
                    value={settings.hallBroadcast.channel1}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hallBroadcast: { ...settings.hallBroadcast, channel1: e.target.value },
                      })
                    }
                    placeholder="例如: 230.1.1.10"
                  />
                  <p className="text-sm text-muted-foreground">转播盒1的转播地址，默认为230.1.1.10</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel2">转播地址2</Label>
                  <Input
                    id="channel2"
                    value={settings.hallBroadcast.channel2}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hallBroadcast: { ...settings.hallBroadcast, channel2: e.target.value },
                      })
                    }
                    placeholder="例如: 230.1.1.11"
                  />
                  <p className="text-sm text-muted-foreground">转播盒2的转播地址（可选）</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 智能灯光配置 */}
          <TabsContent value="lighting">
            <Card>
              <CardHeader>
                <CardTitle>智能灯光配置</CardTitle>
                <CardDescription>配置包厢智能灯光控制参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lighting-enabled">启用智能灯光</Label>
                  <Switch
                    id="lighting-enabled"
                    checked={settings.lighting.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        lighting: { ...settings.lighting, enabled: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-control">自动控制</Label>
                  <Switch
                    id="auto-control"
                    checked={settings.lighting.autoControl}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        lighting: { ...settings.lighting, autoControl: checked },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="com-port">串口端口</Label>
                  <Input
                    id="com-port"
                    value={settings.lighting.comPort}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lighting: { ...settings.lighting, comPort: e.target.value },
                      })
                    }
                    placeholder="/dev/ttyS2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device-type">设备类型</Label>
                  <Input
                    id="device-type"
                    value={settings.lighting.deviceType}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lighting: { ...settings.lighting, deviceType: e.target.value },
                      })
                    }
                    placeholder="6"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 开房播放设置 */}
          <TabsContent value="room-play">
            <Card>
              <CardHeader>
                <CardTitle>开房播放设置</CardTitle>
                <CardDescription>设置包厢开房后自动播放的视频</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="room-play-enabled">启用开房播放</Label>
                  <Switch
                    id="room-play-enabled"
                    checked={settings.roomPlayback.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        roomPlayback: { ...settings.roomPlayback, enabled: checked },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-video-path">视频路径</Label>
                  <Input
                    id="room-video-path"
                    value={settings.roomPlayback.videoPath}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        roomPlayback: { ...settings.roomPlayback, videoPath: e.target.value },
                      })
                    }
                    placeholder="/vod/opening/"
                  />
                  <p className="text-sm text-muted-foreground">
                    支持格式: mkv/mp4/avi，分辨率不超过1080p，单个文件不超过200MB
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 开机播放设置 */}
          <TabsContent value="boot-play">
            <Card>
              <CardHeader>
                <CardTitle>开机播放设置</CardTitle>
                <CardDescription>设置机顶盒通电启动后自动播放的视频</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="boot-play-enabled">启用开机播放</Label>
                  <Switch
                    id="boot-play-enabled"
                    checked={settings.bootPlayback.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        bootPlayback: { ...settings.bootPlayback, enabled: checked },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boot-video-path">视频路径</Label>
                  <Input
                    id="boot-video-path"
                    value={settings.bootPlayback.videoPath}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bootPlayback: { ...settings.bootPlayback, videoPath: e.target.value },
                      })
                    }
                    placeholder="/vod/boot/"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 包厢配置 */}
          <TabsContent value="room-config">
            <Card>
              <CardHeader>
                <CardTitle>包厢配置</CardTitle>
                <CardDescription>针对单个包厢或全部包厢进行个性化设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pac-config">PAC配置</Label>
                  <Textarea
                    id="pac-config"
                    value={settings.roomConfig.pacConfig}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        roomConfig: { ...settings.roomConfig, pacConfig: e.target.value },
                      })
                    }
                    placeholder="请输入PAC配置内容"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-config">Room配置</Label>
                  <Textarea
                    id="room-config"
                    value={settings.roomConfig.roomConfig}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        roomConfig: { ...settings.roomConfig, roomConfig: e.target.value },
                      })
                    }
                    placeholder="例如: 电影模块=开启"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dajianpan-config">大键盘配置</Label>
                  <Textarea
                    id="dajianpan-config"
                    value={settings.roomConfig.dajianpanConfig}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        roomConfig: { ...settings.roomConfig, dajianpanConfig: e.target.value },
                      })
                    }
                    placeholder="请输入大键盘配置内容"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
