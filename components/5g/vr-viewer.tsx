"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Maximize2, Activity } from "lucide-react"

interface VRViewerProps {
  roomId: string
}

export function VRViewer({ roomId }: VRViewerProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [metrics, setMetrics] = useState({
    fps: 60,
    latency: 18,
    users: 4,
  })

  useEffect(() => {
    // 初始化VR场景
    console.log("[v0] 初始化VR场景:", roomId)

    // 模拟FPS更新
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        fps: 58 + Math.random() * 4,
        latency: 15 + Math.random() * 10,
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [roomId])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    console.log("[v0] 重置VR场景")
  }

  const handleFullscreen = () => {
    if (canvasRef.current) {
      canvasRef.current.requestFullscreen()
    }
  }

  return (
    <div className="space-y-4">
      {/* VR场景容器 */}
      <div
        ref={canvasRef}
        className="relative aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden"
      >
        {/* 模拟VR场景 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Activity className="h-16 w-16 text-white animate-pulse" />
            </div>
            <div className="text-white">
              <p className="text-lg font-semibold">VR场景预览</p>
              <p className="text-sm text-white/70">房间ID: {roomId}</p>
            </div>
          </div>
        </div>

        {/* 性能指标 */}
        <div className="absolute top-4 left-4 space-y-2">
          <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
            FPS: {metrics.fps.toFixed(0)}
          </Badge>
          <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
            延迟: {metrics.latency.toFixed(0)}ms
          </Badge>
          <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
            用户: {metrics.users}
          </Badge>
        </div>

        {/* 状态指示器 */}
        <div className="absolute top-4 right-4">
          <Badge variant={isPlaying ? "default" : "secondary"} className="bg-black/50 backdrop-blur-sm">
            {isPlaying ? "运行中" : "已暂停"}
          </Badge>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handlePlayPause}>
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                暂停
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                播放
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            重置
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={handleFullscreen}>
          <Maximize2 className="h-4 w-4 mr-2" />
          全屏
        </Button>
      </div>

      {/* 场景信息 */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">渲染模式</p>
          <p className="font-medium">WebXR</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">分辨率</p>
          <p className="font-medium">1920x1080</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground">抗锯齿</p>
          <p className="font-medium">MSAA 4x</p>
        </div>
      </div>
    </div>
  )
}
