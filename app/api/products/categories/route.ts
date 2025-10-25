import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/utils/storage"
import type { ProductCategory } from "@/lib/types"

// 获取商品类型列表
export async function GET() {
  try {
    const categories = await mockDatabase.findAll<ProductCategory>("categories")

    return NextResponse.json({
      success: true,
      data: categories,
      message: "获取商品类型成功",
    })
  } catch (error) {
    console.error("[v0] 获取商品类型失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取商品类型失败",
      },
      { status: 500 },
    )
  }
}

// 创建商品类型
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const category: ProductCategory = {
      id: `cat_${Date.now()}`,
      name: body.name,
      displayOrder: body.displayOrder || 0,
      isDisplay: body.isDisplay !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const created = await mockDatabase.create<ProductCategory>("categories", category)

    return NextResponse.json({
      success: true,
      data: created,
      message: "创建商品类型成功",
    })
  } catch (error) {
    console.error("[v0] 创建商品类型失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "创建商品类型失败",
      },
      { status: 500 },
    )
  }
}
