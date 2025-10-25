// 商品API服务

import { apiClient } from "../client"
import type { Product, ProductCategory, ProductFlavor, ApiResponse, PaginatedResponse } from "@/lib/types"

export const productService = {
  // 获取商品列表
  async getProducts(params?: {
    page?: number
    pageSize?: number
    categoryId?: string
    keyword?: string
    isSale?: boolean
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return apiClient.getPaginated<Product>("/products", params)
  },

  // 获取单个商品
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${id}`)
  },

  // 创建商品
  async createProduct(data: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>("/products", data)
  },

  // 更新商品
  async updateProduct(id: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/products/${id}`, data)
  },

  // 删除商品
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/${id}`)
  },

  // 批量导入商品
  async importProducts(file: File): Promise<ApiResponse<{ success: number; failed: number }>> {
    const formData = new FormData()
    formData.append("file", file)

    // 这里需要特殊处理FormData
    const response = await fetch("/api/products/import", {
      method: "POST",
      body: formData,
    })

    return response.json()
  },

  // 商品类型相关
  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    return apiClient.get<ProductCategory[]>("/products/categories")
  },

  async createCategory(data: Partial<ProductCategory>): Promise<ApiResponse<ProductCategory>> {
    return apiClient.post<ProductCategory>("/products/categories", data)
  },

  async updateCategory(id: string, data: Partial<ProductCategory>): Promise<ApiResponse<ProductCategory>> {
    return apiClient.put<ProductCategory>(`/products/categories/${id}`, data)
  },

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/categories/${id}`)
  },

  // 商品口味相关
  async getFlavors(): Promise<ApiResponse<ProductFlavor[]>> {
    return apiClient.get<ProductFlavor[]>("/products/flavors")
  },

  async createFlavor(data: Partial<ProductFlavor>): Promise<ApiResponse<ProductFlavor>> {
    return apiClient.post<ProductFlavor>("/products/flavors", data)
  },

  async updateFlavor(id: string, data: Partial<ProductFlavor>): Promise<ApiResponse<ProductFlavor>> {
    return apiClient.put<ProductFlavor>(`/products/flavors/${id}`, data)
  },

  async deleteFlavor(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/products/flavors/${id}`)
  },
}
