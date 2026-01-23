"use client"

import { useState, useEffect } from "react"
import { useRoomStore } from "./lib/stores/useRoomStore"
import { useOrderStore } from "./lib/stores/useOrderStore"
import RoomStatusDashboard from "./components/room/room-status-dashboard"
import RoomDetailModal from "./components/room/room-detail-modal"
import POSSystem from "./components/pos/pos-system"

export default function Dashboard() {
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPOS, setShowPOS] = useState(false)
  const [posRoomId, setPosRoomId] = useState<string | undefined>()

  const { fetchRooms, updateRoomStatus, startRoom, checkoutRoom } = useRoomStore()
  const { fetchOrders } = useOrderStore()

  // 初始化数据
  useEffect(() => {
    fetchRooms()
    fetchOrders()
  }, [fetchRooms, fetchOrders])

  const handleRoomClick = (room: any) => {
    setSelectedRoom(room)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRoom(null)
  }

  const handleRoomAction = async (action: string) => {
    if (!selectedRoom) return

    try {
      switch (action) {
        case "start":
          await startRoom(selectedRoom.id)
          break
        case "checkout":
          await checkoutRoom(selectedRoom.id)
          break
        case "clean":
          await updateRoomStatus(selectedRoom.id, "cleaning")
          break
        case "order":
          setPosRoomId(selectedRoom.id)
          setShowPOS(true)
          setIsModalOpen(false)
          break
        case "pause":
          await updateRoomStatus(selectedRoom.id, "maintenance")
          break
        default:
          console.log(`未处理的操作: ${action}`)
      }
    } catch (error) {
      console.error(`操作失败: ${action}`, error)
    }
  }

  const handleQuickAction = async (action: string) => {
    try {
      switch (action) {
        case "refresh":
          await fetchRooms()
          break
        case "cleanAll":
          // 批量清扫逻辑
          break
        case "stopBusiness":
          // 暂停营业逻辑
          break
        case "resumeBusiness":
          // 恢复营业逻辑
          break
        default:
          console.log(`未处理的快速操作: ${action}`)
      }
    } catch (error) {
      console.error(`快速操作失败: ${action}`, error)
    }
  }

  if (showPOS) {
    return (
      <POSSystem
        roomId={posRoomId}
        onClose={() => {
          setShowPOS(false)
          setPosRoomId(undefined)
        }}
      />
    )
  }

  return (
    <div className="h-screen bg-slate-900">
      <RoomStatusDashboard onRoomClick={handleRoomClick} onQuickAction={handleQuickAction} />

      <RoomDetailModal
        room={selectedRoom}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAction={handleRoomAction}
      />
    </div>
  )
}
