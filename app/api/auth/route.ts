/**
 * @file 认证管理 API 路由
 * @description 用户信息获取与登出 - JWT Token 验证
 * @module api/auth
 * @author YYC³
 * @version 2.0.0
 * @created 2025-01-19
 * @updated 2026-05-23
 */

import { NextRequest, NextResponse } from 'next/server'
import type { User, ApiResponse } from '@/lib/types'
import { verifyToken } from '@/lib/security/jwt'
import { AuthService } from '@/lib/db/repositories/user-repository'

const authService = new AuthService()

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request)

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '未提供认证令牌' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '令牌无效或已过期' },
        { status: 401 }
      )
    }

    const user = await authService.getUserById(payload.userId)

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '用户不存在或已禁用' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('[API] 获取用户信息错误:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '获取用户信息失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest) {
  return NextResponse.json<ApiResponse>({
    success: true,
    message: '登出成功',
  })
}
