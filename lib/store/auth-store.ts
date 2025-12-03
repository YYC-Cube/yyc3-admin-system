/** 
 * @file auth-store.ts
 * @description 认证状态管理 - 处理用户登录、注销、权限验证等功能
 * @module store
 * @author YYC³ 
 * @version 1.0.0 
 * @created 2025-09-15 
 * @updated 2025-09-15
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Permission } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

// 🛡️ 统一错误处理辅助函数
const handleError = (error: unknown, context: string): string => {
  const errorMessage = error instanceof Error ? error.message : `操作失败: ${context}`
  console.error(`🚨 [${context}] 错误:`, error)
  return errorMessage
}

/**
 * @description 认证状态接口定义
 * @property {User | null} user - 用户信息
 * @property {boolean} isAuthenticated - 是否已认证
 * @property {boolean} isLoading - 加载状态
 */
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // 操作方法
  login: (phone: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      /**
       * @description 用户登录
       * @param {string} phone - 手机号码
       * @param {string} password - 密码
       * @returns {Promise<boolean>} 登录是否成功
       */
      login: async (phone: string, password: string) => {
        set({ isLoading: true })

        try {
          const response = await apiClient.post<{ user: User; token: string }>("/auth/login", {
            phone,
            password,
          })

          if (response.success && response.data) {
            const { user, token } = response.data
            apiClient.setToken(token)
            set({ user, isAuthenticated: true })
            return true
          }

          return false
        } catch (error) {
          handleError(error, "登录")
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      /**
       * @description 用户登出
       */
      logout: () => {
        apiClient.clearToken()
        set({ user: null, isAuthenticated: false })
      },

      /**
       * @description 检查认证状态
       * @returns {Promise<void>}
       */
      checkAuth: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

        if (!token) {
          set({ user: null, isAuthenticated: false })
          return
        }

        set({ isLoading: true })

        try {
          const response = await apiClient.get<User>("/auth/me")

          if (response.success && response.data) {
            set({ user: response.data, isAuthenticated: true })
          } else {
            set({ user: null, isAuthenticated: false })
            apiClient.clearToken()
          }
        } catch (error) {
          handleError(error, "验证")
          set({ user: null, isAuthenticated: false })
          apiClient.clearToken()
        } finally {
          set({ isLoading: false })
        }
      },

      /**
       * @description 检查是否拥有指定权限
       * @param {Permission} permission - 权限名称
       * @returns {boolean} 是否拥有权限
       */
      hasPermission: (permission: Permission) => {
        const { user } = get()
        return user?.permissions.includes(permission) ?? false
      },

      /**
       * @description 检查是否拥有任意一个指定权限
       * @param {Permission[]} permissions - 权限列表
       * @returns {boolean} 是否拥有任意权限
       */
      hasAnyPermission: (permissions: Permission[]) => {
        const { user } = get()
        if (!user) return false
        return permissions.some((p) => user.permissions.includes(p))
      },

      /**
       * @description 检查是否拥有所有指定权限
       * @param {Permission[]} permissions - 权限列表
       * @returns {boolean} 是否拥有所有权限
       */
      hasAllPermissions: (permissions: Permission[]) => {
        const { user } = get()
        if (!user) return false
        return permissions.every((p) => user.permissions.includes(p))
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
