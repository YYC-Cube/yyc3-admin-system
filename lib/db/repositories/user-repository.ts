/**
 * @file user-repository.ts
 * @description 用户数据仓库层 - 支持数据库认证 + 开发环境 Mock 降级
 * @module db/repositories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-05-23
 * @updated 2026-05-23
 */

import { query } from "@/lib/db"
import type { User } from "@/lib/types"
import { Permission, UserRole } from "@/lib/types"
import bcrypt from "bcryptjs"

export interface AuthUser {
  id: string
  name: string
  phone: string
  password_hash: string
  store_id: string
  role: string
  status: "active" | "inactive" | "suspended"
  permissions: string
  created_at: string
  updated_at: string
}

export class UserRepository {
  async findByPhone(phone: string): Promise<AuthUser | null> {
    const sql = "SELECT * FROM users WHERE phone = ? AND status = 'active' LIMIT 1"
    const rows = await query<AuthUser[]>(sql, [phone])
    return rows[0] || null
  }

  async findById(id: string): Promise<AuthUser | null> {
    const sql = "SELECT * FROM users WHERE id = ? AND status = 'active' LIMIT 1"
    const rows = await query<AuthUser[]>(sql, [id])
    return rows[0] || null
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  toUser(authUser: AuthUser): User {
    let parsedPermissions: string[] = []
    try {
      parsedPermissions = JSON.parse(authUser.permissions)
    } catch {
      parsedPermissions = authUser.permissions.split(",").filter(Boolean)
    }

    return {
      id: String(authUser.id),
      name: authUser.name,
      phone: authUser.phone,
      storeId: authUser.store_id,
      role: authUser.role as UserRole,
      permissions: parsedPermissions as Permission[],
      createdAt: authUser.created_at,
      updatedAt: authUser.updated_at,
    }
  }
}

const DEV_MOCK_USERS: Array<{ phone: string; password: string; user: User }> = [
  {
    phone: "13103790379",
    password: "123456",
    user: {
      id: "1",
      name: "管理员",
      phone: "13103790379",
      storeId: "store_1",
      role: UserRole.ADMIN,
      permissions: [
        Permission.VIEW_SETTINGS, Permission.MANAGE_SETTINGS,
        Permission.VIEW_PRODUCTS, Permission.VIEW_ORDERS,
        Permission.MANAGE_MEMBERS, Permission.VIEW_REPORTS,
        Permission.EXPORT_REPORTS, Permission.VIEW_WAREHOUSE,
        Permission.MANAGE_WAREHOUSE,
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    phone: "13800138000",
    password: "123456",
    user: {
      id: "2",
      name: "操作员",
      phone: "13800138000",
      storeId: "store_1",
      role: UserRole.MANAGER,
      permissions: [Permission.VIEW_SETTINGS, Permission.VIEW_ORDERS, Permission.VIEW_MEMBERS],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
]

export class AuthService {
  private repo = new UserRepository()

  async authenticate(phone: string, password: string): Promise<User | null> {
    const isDev = process.env.NODE_ENV !== "production"

    try {
      const authUser = await this.repo.findByPhone(phone)
      if (authUser) {
        const valid = await this.repo.verifyPassword(password, authUser.password_hash)
        if (valid) {
          return this.repo.toUser(authUser)
        }
        return null
      }
    } catch (error) {
      if (!isDev) return null
      console.warn("[Auth] 数据库不可用，降级到开发模式:", error instanceof Error ? error.message : String(error))
    }

    if (isDev) {
      const mockUser = DEV_MOCK_USERS.find(u => u.phone === phone && u.password === password)
      if (mockUser) {
        console.warn("[Auth] ⚠️ 使用 Mock 用户认证（仅限开发环境）")
        return mockUser.user
      }
    }

    return null
  }

  async getUserById(userId: string): Promise<User | null> {
    const isDev = process.env.NODE_ENV !== "production"

    try {
      const authUser = await this.repo.findById(userId)
      if (authUser) {
        return this.repo.toUser(authUser)
      }
    } catch {
      if (!isDev) return null
      console.warn("[Auth] 数据库不可用，降级到开发模式")
    }

    if (isDev) {
      const mockUser = DEV_MOCK_USERS.find(u => u.user.id === userId)
      if (mockUser) return mockUser.user
    }

    return null
  }
}
