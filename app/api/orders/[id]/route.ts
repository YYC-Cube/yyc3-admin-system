import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/utils/storage"
import type { Order } from "@/lib/types"

// 获取单个订单
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await mockDatabase.findById<Order>("orders", params.id)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "订单不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: "获取订单成功",
    })
  } catch (error) {
    console.error("[v0] 获取订单失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取订单失败",
      },
      { status: 500 },
    )
  }
}

// 更新订单
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updated = await mockDatabase.update<Order>("orders", params.id, {
      ...body,
      updatedAt: new Date().toISOString(),
    })

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "订单不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "更新订单成功",
    })
  } catch (error) {
    console.error("[v0] 更新订单失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "更新订单失败",
      },
      { status: 500 },
    )
  }
}

// 取消订单
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await mockDatabase.findById<Order>("orders", params.id)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "订单不存在",
        },
        { status: 404 },
      )
    }

    // 更新订单状态为已取消
    const updated = await mockDatabase.update<Order>("orders", params.id, {
      status: "cancelled",
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: "取消订单成功",
    })
  } catch (error) {
    console.error("[v0] 取消订单失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "取消订单失败",
      },
      { status: 500 },
    )
  }
}
