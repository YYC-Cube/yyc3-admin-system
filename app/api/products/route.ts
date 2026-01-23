import { NextRequest, NextResponse } from 'next/server'
import { mockService } from '../../../lib/api/mock-service'

/**
 * @description 商品管理API路由
 * @project KTV商家管理系统
 */

// 获取商品列表
export async function GET(request: NextRequest) {
  try {
    // 解析查询参数
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const category_id = searchParams.get('category_id') || searchParams.get('categoryId')
    const keyword = searchParams.get('keyword')
    
    // 调用模拟服务获取商品
    const response = await mockService.getProducts({ page, pageSize })
    
    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || '获取商品列表失败' },
        { status: 500 }
      )
    }
    
    // 应用筛选条件
    let filteredProducts = response.data?.data || []
    if (category_id) {
      filteredProducts = filteredProducts.filter(product => product.category_id === category_id)
    }
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(lowerKeyword)
      )
    }
    
    // 重新计算分页信息
    const filteredTotal = filteredProducts.length
    const filteredTotalPages = Math.ceil(filteredTotal / pageSize)
    
    return NextResponse.json({
      success: true,
      data: {
        data: filteredProducts,
        pagination: {
          page,
          pageSize,
          total: filteredTotal,
          totalPages: filteredTotalPages
        }
      },
    })
  } catch (error) {
    console.error('[v0] 获取商品列表错误:', error)
    return NextResponse.json(
      { success: false, error: '获取商品列表失败' },
      { status: 500 }
    )
  }
}

// 创建商品
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    
    // 验证必填字段
    if (!productData.name || !productData.price || (!productData.category_id && !productData.categoryId)) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段: name, price 或 category_id' },
        { status: 400 }
      )
    }
    
    // 简单实现：返回创建的商品
    const newProduct = {
      id: `product_${Date.now()}`,
      name: productData.name,
      price: productData.price,
      original_price: productData.original_price || productData.originalPrice || productData.price,
      category_id: productData.category_id || productData.categoryId,
      description: productData.description || '',
      image: productData.image || productData.images?.[0] || '',
      status: productData.isSale !== false ? 'active' : 'inactive',
      created_at: new Date().toISOString()
    }
    
    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] 创建商品错误:', error)
    return NextResponse.json(
      { success: false, error: '创建商品失败' },
      { status: 500 }
    )
  }
}
