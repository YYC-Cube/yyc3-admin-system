/** 
 * @file useRoomStore.ts
 * @description 房间状态管理 - 处理房间的查询、选择、状态更新和结账等操作
 * @author YYC³ 
 * @version 1.0.0 
 * @created 2025-09-15 
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
// 本地定义Room类型以避免导入冲突
interface Room {
  id: string;
  [key: string]: any;
}
import { apiClient } from "../api/client"

/**
 * @description 房间状态接口定义
 * @property {Room[]} rooms - 房间列表
 * @property {Room | null} selectedRoom - 当前选中的房间
 * @property {boolean} loading - 加载状态
 * @property {string | null} error - 错误信息
 */
interface RoomState {
  rooms: Room[]
  selectedRoom: Room | null
  loading: boolean
  error: string | null

  // Actions
  fetchRooms: () => Promise<void>
  selectRoom: (roomId: string) => void
  updateRoomStatus: (roomId: string, status: Room["status"], data?: any) => Promise<void>
  startRoom: (roomId: string, customerId?: string) => Promise<void>
  checkoutRoom: (roomId: string) => Promise<void>
  clearError: () => void
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      rooms: [],
      selectedRoom: null,
      loading: false,
      error: null,

      /**
       * @description 获取房间列表
       * @returns {Promise<void>}
       */
      fetchRooms: async () => {
        set({ loading: true, error: null })
        try {
          const response = await apiClient.getRooms()
          if (response.success) {
            set({ rooms: response.data, loading: false })
          } else {
            set({ error: response.message, loading: false })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "获取包厢列表失败"
          console.error(`🚨 [获取包厢列表] 错误:`, error)
          set({ error: errorMessage, loading: false })
        }
      },

      /**
       * @description 选择房间
       * @param {string} roomId - 房间ID
       */
      selectRoom: (roomId: string) => {
        const room = get().rooms.find((r) => r.id === roomId)
        set({ selectedRoom: room || null })
      },

      /**
       * @description 更新房间状态
       * @param {string} roomId - 房间ID
       * @param {Room["status"]} status - 新状态
       * @param {any} data - 附加数据
       * @returns {Promise<void>}
       */
      updateRoomStatus: async (roomId: string, status: Room["status"], data?: any) => {
        set({ loading: true, error: null })
        try {
          const response = await apiClient.updateRoomStatus(roomId, status, data)
          if (response.success) {
            set((state) => ({
              rooms: state.rooms.map((room) => (room.id === roomId ? { ...room, status, ...data } : room)),
              selectedRoom:
                state.selectedRoom?.id === roomId ? { ...state.selectedRoom, status, ...data } : state.selectedRoom,
              loading: false,
            }))
          } else {
            set({ error: response.message, loading: false })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "更新包厢状态失败"
          console.error(`🚨 [更新包厢状态] 错误:`, error)
          set({ error: errorMessage, loading: false })
        }
      },

      /**
       * @description 开始使用房间（开房）
       * @param {string} roomId - 房间ID
       * @param {string} customerId - 客户ID
       * @returns {Promise<void>}
       */
      startRoom: async (roomId: string, customerId?: string) => {
        set({ loading: true, error: null })
        try {
          const response = await apiClient.startRoom(roomId, customerId)
          if (response.success) {
            await get().updateRoomStatus(roomId, "occupied", {
              startTime: new Date().toISOString(),
              customerId,
              orderId: response.data.id,
            })
          } else {
            set({ error: response.message, loading: false })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "开房失败"
          console.error(`🚨 [开房] 错误:`, error)
          set({ error: errorMessage, loading: false })
        }
      },

      /**
       * @description 房间结账
       * @param {string} roomId - 房间ID
       * @returns {Promise<void>}
       */
      checkoutRoom: async (roomId: string) => {
        set({ loading: true, error: null })
        try {
          const response = await apiClient.checkoutRoom(roomId)
          if (response.success) {
            await get().updateRoomStatus(roomId, "checkout", {
              endTime: new Date().toISOString(),
            })
          } else {
            set({ error: response.message, loading: false })
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "结账失败"
          console.error(`🚨 [结账] 错误:`, error)
          set({ error: errorMessage, loading: false })
        }
      },

      /**
       * @description 清除错误信息
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "room-storage",
      partialize: (state) => ({
        selectedRoom: state.selectedRoom,
      }),
    },
  ),
)
