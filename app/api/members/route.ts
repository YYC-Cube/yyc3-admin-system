import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/utils/storage"
import type { Member } from "@/lib/types"

// 获取会员列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const keyword = searchParams.get("keyword")
    const level = searchParams.get("level")

    const filters: any = {}
    if (keyword) {
      // 模糊搜索姓名或手机号
      filters.name = keyword
    }
    if (level) filters.level = Number.parseInt(level)

    const result = await mockDatabase.query<Member>("members", {
      page,
      pageSize,
      filters,
      sort: { field: "createdAt", order: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: result,
      message: "获取会员列表成功",
    })
  } catch (error) {
    console.error("[v0] 获取会员列表失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取会员列表失败",
      },
      { status: 500 },
    )
  }
}

// 创建会员
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 生成会员卡号
    const members = await mockDatabase.findAll<Member>("members")
    const cardNumber = String(members.length + 1).padStart(6, "0")

    const member: Member = {
      id: `member_${Date.now()}`,
      storeId: body.storeId || "store_1",
      cardNumber,
      name: body.name,
      phone: body.phone,
      level: body.level || 1,
      balance: body.balance || 0,
      points: body.points || 0,
      totalConsumption: 0,
      visitCount: 0,
      birthday: body.birthday,
      gender: body.gender,
      address: body.address,
      remark: body.remark,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const created = await mockDatabase.create<Member>("members", member)

    return NextResponse.json({
      success: true,
      data: created,
      message: "创建会员成功",
    })
  } catch (error) {
    console.error("[v0] 创建会员失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "创建会员失败",
      },
      { status: 500 },
    )
  }
}
