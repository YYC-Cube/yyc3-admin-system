import { NextRequest, NextResponse } from "next/server"
import type { User, ApiResponse } from "@/lib/types"
import { UserRole, Permission } from "@/lib/types"

// 模拟用户数据（实际应该从数据库查询）
const MOCK_USERS: Array<{ phone: string; password: string; user: User }> = [
  {
    phone: "13103790379",
    password: "123456",
    user: {
      id: "1",
      name: "管理员",
      phone: "13103790379",
      storeId: "store_1",
      role: UserRole.ADMIN,
      permissions: [Permission.VIEW_SETTINGS, Permission.MANAGE_SETTINGS, Permission.VIEW_PRODUCTS, Permission.VIEW_ORDERS, Permission.MANAGE_MEMBERS],
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

// 生成JWT Token（简化版，实际应该使用jsonwebtoken库）
const generateToken = (userId: string): string => {
  // 简化的Token生成逻辑
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + 3600, // 1小时过期
    iat: Math.floor(Date.now() / 1000),
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// 配置API路由
export const config = {
  runtime: "edge",
  regions: "auto",
}

// 处理预检请求
function handleOPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin") || "*"
  
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Credentials": "true",
      },
    }
  )
}

export async function OPTIONS(request: NextRequest) {
  return handleOPTIONS(request)
}

export async function POST(request: NextRequest) {
  try {
    // 允许跨域请求
    const origin = request.headers.get("origin") || "*"
    
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "手机号和密码不能为空" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      )
    }

    // 查找用户
    const userData = MOCK_USERS.find(
      (user) => user.phone === phone && user.password === password
    )

    if (!userData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "手机号或密码错误" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
          },
        }
      )
    }

    // 生成Token
    const token = generateToken(userData.user.id)

    return NextResponse.json<ApiResponse<{ user: User; token: string }>>(
      {
        success: true,
        data: {
          user: userData.user,
          token,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Credentials": "true",
        },
      }
    )
  } catch (error) {
    console.error("[API] 登录失败:", error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: "登录失败，请稍后重试" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Credentials": "true",
        },
      }
    )
  }
}
