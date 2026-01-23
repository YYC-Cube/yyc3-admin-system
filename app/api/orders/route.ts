import { NextRequest, NextResponse } from 'next/server'
import { mockService } from '../../../lib/api/mock-service'

/**
 * @description 订单管理API路由
 * @project KTV商家管理系统
 */

// 获取订单列表
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const status = searchParams.get('status')
    
    // 调用模拟服务获取订单
    const response = await mockService.getOrders({ page, pageSize })
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || '获取订单列表失败' },
        { status: 500 }
      )
    }
    
    // 应用状态筛选（如果提供）
    let filteredOrders = response.data?.data || []
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...response.data,
        data: filteredOrders
      },
    })
  } catch (error) {
    console.error('[v0] 获取订单列表错误:', error)
    return NextResponse.json(
      { success: false, error: '获取订单列表失败' },
      { status: 500 }
    )
  }
}

// 创建订单
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // 验证必填字段
    if (!orderData.room_id || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段: room_id 或 items' },
        { status: 400 }
      )
    }
    
    // 调用模拟服务创建订单
    const response = await mockService.createOrder(orderData)
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || '创建订单失败' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: true, data: response.data },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] 创建订单错误:', error)
    return NextResponse.json(
      { success: false, error: '创建订单失败' },
      { status: 500 }
    )
  }
}

// 更新订单 (保留接口但简化实现)
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '订单ID不能为空' },
        { status: 400 }
      )
    }
    
    // 简单实现：直接返回更新的数据
    return NextResponse.json({
      success: true,
      data: { id, ...updateData, updatedAt: new Date().toISOString() }
    })
  } catch (error) {
    console.error('[v0] 更新订单错误:', error)
    return NextResponse.json(
      { success: false, error: '更新订单失败' },
      { status: 500 }
    )
  }
}

// 删除订单 (保留接口)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '订单ID不能为空' },
        { status: 400 }
      )
    }
    
    // 简单实现：返回成功
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] 删除订单错误:', error)
    return NextResponse.json(
      { success: false, error: '删除订单失败' },
      { status: 500 }
    )
  }
}
