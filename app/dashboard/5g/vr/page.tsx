import { Suspense } from "react"
import { VRKaraokeDashboard } from "@/components/5g/vr-karaoke-dashboard"

export const metadata = {
  title: "VR包厢体验 - 5G应用",
  description: "虚拟现实KTV包厢体验管理",
}

export default function VRKaraokePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VR包厢体验</h1>
          <p className="text-muted-foreground mt-2">沉浸式虚拟现实KTV包厢</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <VRKaraokeDashboard />
      </Suspense>
    </div>
  )
}
