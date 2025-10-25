import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/utils/storage"
import type { Product } from "@/lib/types"

// 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const categoryId = searchParams.get("categoryId")
    const keyword = searchParams.get("keyword")
    const isSale = searchParams.get("isSale")

    // 构建查询条件
    const filters: any = {}
    if (categoryId) filters.categoryId = categoryId
    if (keyword) filters.name = keyword
    if (isSale !== null) filters.isSale = isSale === "true"

    const result = await mockDatabase.query<Product>("products", {
      page,
      pageSize,
      filters,
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: "获取商品列表成功",
    })
  } catch (error) {
    console.error("[v0] 获取商品列表失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取商品列表失败",
      },
      { status: 500 },
    )
  }
}

// 创建商品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证必填字段
    if (!body.name || !body.categoryId || !body.price) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "缺少必填字段",
        },
        { status: 400 },
      )
    }

    // 创建商品数据
    const product: Product = {
      id: `prod_${Date.now()}`,
      storeId: body.storeId || "store_1",
      name: body.name,
      alias: body.alias || body.name,
      barcode: body.barcode || [],
      categoryId: body.categoryId,
      unit: body.unit || "个",
      originalPrice: body.originalPrice || body.price,
      price: body.price,
      memberPrice: body.memberPrice || body.price,
      stock: body.stock || 0,
      minStock: body.minStock || 0,
      costPrice: body.costPrice || 0,
      isGift: body.isGift || false,
      allowDiscount: body.allowDiscount !== false,
      isSale: body.isSale !== false,
      isRecommend: body.isRecommend || false,
      isLowConsumption: body.isLowConsumption || false,
      displayOrder: body.displayOrder || 0,
      image: body.image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const created = await mockDatabase.create<Product>("products", product)

    return NextResponse.json({
      success: true,
      data: created,
      message: "创建商品成功",
    })
  } catch (error) {
    console.error("[v0] 创建商品失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "创建商品失败",
      },
      { status: 500 },
    )
  }
}
