import { NextRequest, NextResponse } from 'next/server'
import { mockService } from '../../../lib/api/mock-service'

/**
 * @description 包厢管理API路由
 * @project KTV商家管理系统
 */

// 获取包厢列表
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const status = searchParams.get('status')
    
    // 调用模拟服务获取包厢
    const response = await mockService.getRooms()
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || '获取包厢列表失败' },
        { status: 500 }
      )
    }
    
    // 应用状态筛选（如果提供）
    let filteredRooms = response.data || []
    if (status) {
      filteredRooms = filteredRooms.filter(room => room.status === status)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        items: filteredRooms,
        total: filteredRooms.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredRooms.length / pageSize),
      },
    })
  } catch (error) {
    console.error('[v0] 获取包厢列表错误:', error)
    return NextResponse.json(
      { success: false, error: '获取包厢列表失败' },
      { status: 500 }
    )
  }
}

// 创建包厢
export async function POST(request: NextRequest) {
  try {
    const roomData = await request.json()
    
    // 验证必填字段
    if (!roomData.room_number || !roomData.room_type) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段: room_number 或 room_type' },
        { status: 400 }
      )
    }
    
    // 模拟创建包厢逻辑
    const newRoom = {
      id: Date.now().toString(),
      ...roomData,
      status: 'available' // 默认状态
    }
    
    return NextResponse.json(
      { success: true, data: newRoom },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] 创建包厢错误:', error)
    return NextResponse.json(
      { success: false, error: '创建包厢失败' },
      { status: 500 }
    )
  }
}

// 更新包厢
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '包厢ID不能为空' },
        { status: 400 }
      )
    }
    
    // 模拟更新包厢逻辑
    // 从模拟服务获取当前包厢
    const roomResponse = await mockService.getRoom(id)
    
    if (!roomResponse.success) {
      return NextResponse.json(
        { success: false, error: '包厢不存在' },
        { status: 404 }
      )
    }
    
    const updatedRoom = {
      ...roomResponse.data,
      ...updateData
    }
    
    return NextResponse.json({
      success: true,
      data: updatedRoom,
    })
  } catch (error) {
    console.error('[v0] 更新包厢错误:', error)
    return NextResponse.json(
      { success: false, error: '更新包厢失败' },
      { status: 500 }
    )
  }
}

// 删除包厢
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '包厢ID不能为空' },
        { status: 400 }
      )
    }
    
    // 简单实现：返回成功
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] 删除包厢错误:', error)
    return NextResponse.json(
      { success: false, error: '删除包厢失败' },
      { status: 500 }
    )
  }
}