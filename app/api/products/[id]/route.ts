import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/utils/storage"
import type { Product } from "@/lib/types"

// 获取单个商品
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await mockDatabase.findById<Product>("products", params.id)

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "商品不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: "获取商品成功",
    })
  } catch (error) {
    console.error("[v0] 获取商品失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取商品失败",
      },
      { status: 500 },
    )
  }
}

// 更新商品
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updated = await mockDatabase.update<Product>("products", params.id, {
      ...body,
      updatedAt: new Date().toISOString(),
    })

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "商品不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "更新商品成功",
    })
  } catch (error) {
    console.error("[v0] 更新商品失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "更新商品失败",
      },
      { status: 500 },
    )
  }
}

// 删除商品
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await mockDatabase.delete("products", params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "商品不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "删除商品成功",
    })
  } catch (error) {
    console.error("[v0] 删除商品失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "删除商品失败",
      },
      { status: 500 },
    )
  }
}
