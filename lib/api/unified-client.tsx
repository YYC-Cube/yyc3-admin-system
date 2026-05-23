/**
 * 统一API客户端 - 提供一致的API调用接口
 * 包含统一的错误处理、加载状态管理和请求拦截
 */

import { toast } from "@/hooks/use-toast"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface RequestOptions extends RequestInit {
  showError?: boolean
  showSuccess?: boolean
  successMessage?: string
}

class UnifiedApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor(baseURL = "/api") {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { showError = true, showSuccess = false, successMessage, ...fetchOptions } = options

    try {
      const url = `${this.baseURL}${endpoint}`
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...this.defaultHeaders,
          ...fetchOptions.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (showError) {
          toast({
            title: "请求失败",
            description: data.error || `HTTP ${response.status}`,
            variant: "destructive",
          })
        }
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        }
      }

      if (showSuccess && successMessage) {
        toast({
          title: "操作成功",
          description: successMessage,
        })
      }

      return {
        success: true,
        data: data.data || data,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "网络请求失败"
      if (showError) {
        toast({
          title: "网络错误",
          description: errorMessage,
          variant: "destructive",
        })
      }
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new UnifiedApiClient()
// </CHANGE>
