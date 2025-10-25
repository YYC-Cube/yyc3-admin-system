// 订单API服务

import { apiClient } from "../client"
import type { Order, ApiResponse, PaginatedResponse } from "@/lib/types"

export const orderService = {
  // 获取订单列表
  async getOrders(params?: {
    page?: number
    pageSize?: number
    storeId?: string
    startDate?: string
    endDate?: string
    orderType?: string
    paymentStatus?: string
    keyword?: string
  }): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return apiClient.getPaginated<Order>("/orders", params)
  },

  // 获取单个订单
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${id}`)
  },

  // 创建订单
  async createOrder(data: Partial<Order>): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>("/orders", data)
  },

  // 更新订单
  async updateOrder(id: string, data: Partial<Order>): Promise<ApiResponse<Order>> {
    return apiClient.put<Order>(`/orders/${id}`, data)
  },

  // 取消订单
  async cancelOrder(id: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/orders/${id}/cancel`, { reason })
  },

  // 退款
  async refundOrder(id: string, amount: number, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`/orders/${id}/refund`, { amount, reason })
  },

  // 导出订单
  async exportOrders(params?: Record<string, any>): Promise<Blob> {
    const response = await fetch("/api/orders/export?" + new URLSearchParams(params))
    return response.blob()
  },
}
