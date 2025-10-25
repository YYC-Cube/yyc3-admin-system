"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Maximize2 } from "lucide-react"
import { arConcertSystem } from "@/lib/5g/ar-concert-system"

export function ARSceneViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sceneLoaded, setSceneLoaded] = useState(false)
  const [currentScene, setCurrentScene] = useState<string>("concert-001")

  useEffect(() => {
    const initializeAR = async () => {
      try {
        // 加载AR场景
        await arConcertSystem.loadARScene(currentScene)

        // 创建虚拟歌手
        const singer = await arConcertSystem.createVirtualSinger("singer-001", "虚拟偶像小美")

        // 渲染虚拟歌手
        await arConcertSystem.renderVirtualSinger(singer, {
          position: { x: 0, y: 0, z: -3 } as any,
          rotation: { x: 0, y: 0, z: 0, w: 1 } as any,
          scale: { x: 1, y: 1, z: 1 } as any,
        })

        // 获取渲染器DOM元素并添加到容器
        const canvas = arConcertSystem.getRendererElement()
        if (canvas && containerRef.current) {
          containerRef.current.appendChild(canvas)
          canvas.style.width = "100%"
          canvas.style.height = "100%"
          canvas.style.borderRadius = "0.5rem"
        }

        setSceneLoaded(true)
      } catch (error) {
        console.error("[v0] AR场景初始化失败:", error)
      }
    }

    initializeAR()

    return () => {
      arConcertSystem.stopRendering()
    }
  }, [currentScene])

  const handlePlayPause = () => {
    if (isPlaying) {
      arConcertSystem.stopRendering()
      setIsPlaying(false)
    } else {
      arConcertSystem.startRendering()
      arConcertSystem.playAnimation("singer-001", "dance")
      setIsPlaying(true)
    }
  }

  const handleReset = () => {
    arConcertSystem.stopRendering()
    setIsPlaying(false)
    // 重新加载场景
    setCurrentScene(`concert-${Date.now()}`)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">AR场景预览</h2>
          <p className="text-sm text-muted-foreground mt-1">实时渲染的AR虚拟演唱会场景</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={sceneLoaded ? "default" : "secondary"}>{sceneLoaded ? "场景已加载" : "加载中..."}</Badge>
          <Badge variant={isPlaying ? "default" : "secondary"}>{isPlaying ? "播放中" : "已暂停"}</Badge>
        </div>
      </div>

      {/* AR场景容器 */}
      <div
        ref={containerRef}
        className="relative w-full h-[500px] bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/20"
      >
        {!sceneLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">正在加载AR场景...</p>
            </div>
          </div>
        )}
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button onClick={handlePlayPause} variant="default" size="lg">
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

        <Button onClick={handleReset} variant="outline" size="lg">
          <RotateCcw className="h-4 w-4 mr-2" />
          重置
        </Button>

        <Button variant="outline" size="lg">
          <Maximize2 className="h-4 w-4 mr-2" />
          全屏
        </Button>
      </div>

      {/* 场景信息 */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">渲染帧率</p>
          <p className="text-2xl font-bold mt-1">60 FPS</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">多边形数</p>
          <p className="text-2xl font-bold mt-1">45K</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">延迟</p>
          <p className="text-2xl font-bold mt-1">42ms</p>
        </div>
      </div>
    </Card>
  )
}
