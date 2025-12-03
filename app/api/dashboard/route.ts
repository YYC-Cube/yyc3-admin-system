import { NextRequest, NextResponse } from 'next/server'
import { mockService } from '../../../lib/api/mock-service'

/**
 * @description 仪表盘API路由
 * @project KTV商家管理系统
 */

// 获取仪表盘数据
export async function GET(_request: NextRequest) {
  try {
    // 调用模拟服务获取仪表盘数据
    const response = await mockService.getDashboardData()
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || '获取仪表盘数据失败' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: response.data
    })
  } catch (error) {
    console.error('[v0] 获取仪表盘数据错误:', error)
    return NextResponse.json(
      { success: false, error: '获取仪表盘数据失败' },
      { status: 500 }
    )
  }
}