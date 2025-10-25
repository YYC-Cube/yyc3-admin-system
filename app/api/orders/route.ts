import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/utils/storage"
import type { Order } from "@/lib/types"

// 获取订单列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const storeId = searchParams.get("storeId")
    const status = searchParams.get("status")
    const orderNumber = searchParams.get("orderNumber")

    const filters: any = {}
    if (storeId) filters.storeId = storeId
    if (status) filters.status = status
    if (orderNumber) filters.orderNumber = orderNumber

    const result = await mockDatabase.query<Order>("orders", {
      page,
      pageSize,
      filters,
      sort: { field: "createdAt", order: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: "获取订单列表成功",
    })
  } catch (error) {
    console.error("[v0] 获取订单列表失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取订单列表失败",
      },
      { status: 500 },
    )
  }
}

// 创建订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const order: Order = {
      id: `order_${Date.now()}`,
      orderNumber: `ORD${Date.now()}`,
      storeId: body.storeId || "store_1",
      roomNumber: body.roomNumber,
      type: body.type || "product",
      items: body.items || [],
      totalAmount: body.totalAmount || 0,
      discountAmount: body.discountAmount || 0,
      actualAmount: body.actualAmount || 0,
      status: "pending",
      paymentMethod: body.paymentMethod,
      paymentStatus: "unpaid",
      memberId: body.memberId,
      employeeId: body.employeeId,
      remark: body.remark,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const created = await mockDatabase.create<Order>("orders", order)

    return NextResponse.json({
      success: true,
      data: created,
      message: "创建订单成功",
    })
  } catch (error) {
    console.error("[v0] 创建订单失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "创建订单失败",
      },
      { status: 500 },
    )
  }
}
