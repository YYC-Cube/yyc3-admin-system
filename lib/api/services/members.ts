// 会员API服务

import { apiClient } from "../client"
import type { Member, ApiResponse, PaginatedResponse } from "@/lib/types"

export const memberService = {
  // 获取会员列表
  async getMembers(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    level?: number
  }): Promise<ApiResponse<PaginatedResponse<Member>>> {
    return apiClient.getPaginated<Member>("/members", params)
  },

  // 获取单个会员
  async getMember(id: string): Promise<ApiResponse<Member>> {
    return apiClient.get<Member>(`/members/${id}`)
  },

  // 创建会员
  async createMember(data: Partial<Member>): Promise<ApiResponse<Member>> {
    return apiClient.post<Member>("/members", data)
  },

  // 更新会员
  async updateMember(id: string, data: Partial<Member>): Promise<ApiResponse<Member>> {
    return apiClient.put<Member>(`/members/${id}`, data)
  },

  // 删除会员
  async deleteMember(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/members/${id}`)
  },

  // 会员充值
  async recharge(id: string, amount: number, giftAmount?: number): Promise<ApiResponse<Member>> {
    return apiClient.post<Member>(`/members/${id}/recharge`, {
      amount,
      giftAmount,
    })
  },

  // 会员消费
  async consume(id: string, amount: number, points?: number): Promise<ApiResponse<Member>> {
    return apiClient.post<Member>(`/members/${id}/consume`, {
      amount,
      points,
    })
  },

  // 积分兑换
  async exchangePoints(id: string, points: number, productId: string): Promise<ApiResponse<Member>> {
    return apiClient.post<Member>(`/members/${id}/exchange`, {
      points,
      productId,
    })
  },
}
