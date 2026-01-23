import { NextRequest, NextResponse } from 'next/server';

/**
 * @description 商品分类 API 路由
 * @project KTV商家管理系统
 */
export async function GET(_request: NextRequest) {
  try {
    // 模拟数据，直接返回成功的响应
    const categories = [
      { id: '1', name: '啤酒', description: '各种品牌啤酒', icon: '🍺', order: 1 },
      { id: '2', name: '洋酒', description: '各类进口洋酒', icon: '🥃', order: 2 },
      { id: '3', name: '软饮', description: '饮料果汁等', icon: '🥤', order: 3 },
      { id: '4', name: '小吃', description: '各类小吃零食', icon: '🍢', order: 4 },
      { id: '5', name: '水果', description: '新鲜水果拼盘', icon: '🍉', order: 5 }
    ];
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('获取商品分类失败:', error);
    return NextResponse.json(
      { success: false, error: '获取商品分类列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: '分类名称不能为空' },
        { status: 400 }
      );
    }
    
    // 创建模拟的新分类
    const newCategory = {
      id: String(Date.now()),
      name: body.name,
      description: body.description || '',
      icon: body.icon || '📦',
      order: body.order || 99,
      created_at: new Date().toISOString()
    };
    
    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建商品分类失败:', error);
    return NextResponse.json(
      { success: false, error: '创建商品分类失败' },
      { status: 500 }
    );
  }
}