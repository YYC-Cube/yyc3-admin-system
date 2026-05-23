import { Suspense } from "react"
import { VideoRoomDashboard } from "@/components/5g/video-room-dashboard"

export const metadata = {
  title: "实时视频互动 - 启智KTV",
  description: "多人实时视频K歌和远程合唱",
}

export default function VideoRoomPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">实时视频互动</h1>
        <p className="text-muted-foreground mt-2">多人实时视频K歌，远程合唱体验</p>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <VideoRoomDashboard />
      </Suspense>
    </div>
  )
}
