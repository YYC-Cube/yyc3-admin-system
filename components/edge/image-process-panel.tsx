"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Loader2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImageProcessPanel() {
  const [imageUrl, setImageUrl] = useState("")
  const [width, setWidth] = useState("800")
  const [height, setHeight] = useState("600")
  const [format, setFormat] = useState("webp")
  const [quality, setQuality] = useState("85")
  const [processing, setProcessing] = useState(false)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const { toast } = useToast()

  const handleProcess = async () => {
    if (!imageUrl) {
      toast({
        title: "错误",
        description: "请输入图片URL",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const response = await fetch("/api/edge/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          transformations: [
            {
              type: "resize",
              params: {
                width: Number.parseInt(width),
                height: Number.parseInt(height),
                fit: "cover",
              },
            },
            {
              type: "format",
              params: {
                format,
                quality: Number.parseInt(quality),
              },
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("图片处理失败")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setProcessedImage(url)

      toast({
        title: "处理成功",
        description: "图片已在边缘节点处理完成",
      })
    } catch (error) {
      toast({
        title: "处理失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>图片处理配置</CardTitle>
          <CardDescription>在边缘节点处理图片，减少带宽消耗</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">图片URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">宽度</Label>
              <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">高度</Label>
              <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">格式</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quality">质量</Label>
              <Input
                id="quality"
                type="number"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleProcess} disabled={processing} className="w-full">
            {processing ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                开始处理
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>处理结果</CardTitle>
          <CardDescription>边缘节点处理后的图片预览</CardDescription>
        </CardHeader>
        <CardContent>
          {processedImage ? (
            <div className="space-y-4">
              <img src={processedImage || "/placeholder.svg"} alt="处理后的图片" className="w-full rounded-lg border" />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.open(processedImage)} className="flex-1">
                  查看原图
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement("a")
                    a.href = processedImage
                    a.download = `processed-${Date.now()}.${format}`
                    a.click()
                  }}
                  className="flex-1"
                >
                  下载图片
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">处理后的图片将显示在这里</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
