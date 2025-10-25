import { Suspense } from "react"
import { SmartRoomDashboard } from "@/components/iot/smart-room-dashboard"

export const metadata = {
  title: "智能包厢控制 - 物联网管理",
  description: "通过IoT设备控制包厢灯光、空调、音响等",
}

export default function SmartRoomsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">智能包厢控制</h1>
          <p className="text-muted-foreground mt-2">通过IoT设备控制包厢灯光、空调、音响等设备</p>
        </div>
      </div>

      <Suspense fallback={<div>加载中...</div>}>
        <SmartRoomDashboard />
      </Suspense>
    </div>
  )
}
