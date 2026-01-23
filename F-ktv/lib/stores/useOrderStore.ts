/** 
 * @file useOrderStore.ts
 * @description 订单状态管理 - 处理订单的创建、更新、删除和查询等操作
 * @module stores
 * @author YYC³ 
 * @version 1.0.0 
 * @created 2025-09-15 
 * @updated 2025-09-15
 */
import { create } from "zustand"

// 🛡️ 统一错误处理辅助函数
const handleError = (error: unknown, context: string): string => {
  const errorMessage = error instanceof Error ? error.message : `操作失败: ${context}`
  console.error(`🚨 [${context}] 错误:`, error)
  return errorMessage
}

// 本地定义类型以避免导入冲突
interface Order {
  id: string;
  [key: string]: any;
}

interface OrderItem {
  id: string;
  totalAmount?: number;
  discountAmount?: number;
  price?: number;
  isGift?: boolean;
  productId?: string;
  quantity?: number;
  [key: string]: any;
}

import { apiClient } from "../api/client"

/**
 * @description 订单状态接口定义
 * @property {Order[]} orders - 订单列表
 * @property {Order | null} currentOrder - 当前选中的订单
 * @property {boolean} loading - 加载状态
 * @property {string | null} error - 错误信息
 */
interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null

  // Actions
  fetchOrders: (params?: any) => Promise<void>
  createOrder: (orderData: Partial<Order>) => Promise<void>
  updateOrder: (orderId: string, orderData: Partial<Order>) => Promise<void>
  addOrderItem: (orderId: string, item: Omit<OrderItem, "id">) => Promise<void>
  removeOrderItem: (orderId: string, itemId: string) => Promise<void>
  updateOrderItem: (orderId: string, itemId: string, updates: Partial<OrderItem>) => Promise<void>
  setCurrentOrder: (order: Order | null) => void
  clearError: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  /**
   * @description 获取订单列表
   * @param {any} params - 查询参数
   * @returns {Promise<void>}
   */
  fetchOrders: async (params?: any) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.getOrders(params)
      if (response.success && response.data) {
        set({ orders: response.data.orders || [], loading: false })
      } else {
        set({ error: response.message || '获取订单失败', loading: false })
      }
    } catch (error) {
      const errorMessage = handleError(error, "获取订单列表")
      set({ error: errorMessage, loading: false })
    }
  },

  /**
   * @description 创建新订单
   * @param {Partial<Order>} orderData - 订单数据
   * @returns {Promise<void>}
   */
  createOrder: async (orderData: Partial<Order>) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.createOrder(orderData)
      if (response.success && response.data) {
        // 确保类型安全
        const newOrder = response.data as Order;
        set((state) => ({
          orders: [...state.orders, newOrder],
          currentOrder: newOrder,
          loading: false,
        }))
      } else {
        set({ error: response.message || '创建订单失败', loading: false })
      }
    } catch (error) {
      const errorMessage = handleError(error, "创建订单")
      set({ error: errorMessage, loading: false })
    }
  },

  /**
   * @description 更新订单信息
   * @param {string} orderId - 订单ID
   * @param {Partial<Order>} orderData - 订单更新数据
   * @returns {Promise<void>}
   */
  updateOrder: async (orderId: string, orderData: Partial<Order>) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.updateOrder(orderId, orderData)
      if (response.success) {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? { ...order, ...response.data } : order)),
          currentOrder:
            state.currentOrder?.id === orderId ? { ...state.currentOrder, ...response.data } : state.currentOrder,
          loading: false,
        }))
      } else {
        set({ error: response.message, loading: false })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "更新订单失败",
        loading: false,
      })
    }
  },

  /**
   * @description 添加订单项
   * @param {string} orderId - 订单ID
   * @param {Omit<OrderItem, "id">} item - 订单项数据
   * @returns {Promise<void>}
   */
  addOrderItem: async (orderId: string, item: Omit<OrderItem, "id">) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.addOrderItem(orderId, item as any)
      if (response.success) {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, items: [...order.items, response.data] } : order,
          ),
          loading: false,
        }))
      } else {
        set({ error: response.message, loading: false })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "添加订单项失败",
        loading: false,
      })
    }
  },

  /**
   * @description 移除订单项
   * @param {string} orderId - 订单ID
   * @param {string} itemId - 订单项ID
   * @returns {Promise<void>}
   */
  removeOrderItem: async (orderId: string, itemId: string) => {
      set((state) => ({
        orders: state.orders.map((order) => 
          order.id === orderId ? { ...order, items: order.items.filter(
(item: OrderItem) => item.id !== itemId) } : order
        ),
      }))
    },

  /**
   * @description 更新订单项
   * @param {string} orderId - 订单ID
   * @param {string} itemId - 订单项ID
   * @param {Partial<OrderItem>} updates - 更新数据
   * @returns {Promise<void>}
   */
  updateOrderItem: async (orderId: string, itemId: string, updates: Partial<OrderItem>) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item: OrderItem) => (item.id === itemId ? 
{ ...item, ...updates } : item)),
            }
          : order,
      ),
    }))
  },

  /**
   * @description 设置当前订单
   * @param {Order | null} order - 订单对象
   */
  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order })
  },

  /**
   * @description 清除错误信息
   */
  clearError: () => set({ error: null }),
}))
