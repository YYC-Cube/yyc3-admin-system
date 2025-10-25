// API客户端封装

import type { ApiResponse, PaginatedResponse } from "@/lib/types"

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
    // 从localStorage获取token
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  // 设置认证token
  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  // 清除token
  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  // 通用请求方法
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "请求失败",
        }
      }

      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      console.error("[v0] API请求错误:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "网络错误",
      }
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
    return this.request<T>(`${endpoint}${queryString}`, {
      method: "GET",
    })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    })
  }

  // 分页请求
  async getPaginated<T>(
    endpoint: string,
    params?: {
      page?: number
      pageSize?: number
      [key: string]: any
    },
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.get<PaginatedResponse<T>>(endpoint, params)
  }
}

// 导出单例实例
export const apiClient = new ApiClient()
