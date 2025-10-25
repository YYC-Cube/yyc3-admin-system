// 认证状态管理

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Permission } from "@/lib/types"
import { apiClient } from "@/lib/api/client"

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
          console.error("[v0] 登录失败:", error)
          return false
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        apiClient.clearToken()
        set({ user: null, isAuthenticated: false })
      },

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
          console.error("[v0] 验证失败:", error)
          set({ user: null, isAuthenticated: false })
          apiClient.clearToken()
        } finally {
          set({ isLoading: false })
        }
      },

      hasPermission: (permission: Permission) => {
        const { user } = get()
        return user?.permissions.includes(permission) ?? false
      },

      hasAnyPermission: (permissions: Permission[]) => {
        const { user } = get()
        if (!user) return false
        return permissions.some((p) => user.permissions.includes(p))
      },

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
