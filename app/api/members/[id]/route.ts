import { type NextRequest, NextResponse } from "next/server"
import { mockDatabase } from "@/lib/utils/storage"
import type { Member } from "@/lib/types"

// 获取单个会员
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const member = await mockDatabase.findById<Member>("members", params.id)

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "会员不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: member,
      message: "获取会员成功",
    })
  } catch (error) {
    console.error("[v0] 获取会员失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "获取会员失败",
      },
      { status: 500 },
    )
  }
}

// 更新会员
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updated = await mockDatabase.update<Member>("members", params.id, {
      ...body,
      updatedAt: new Date().toISOString(),
    })

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "会员不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "更新会员成功",
    })
  } catch (error) {
    console.error("[v0] 更新会员失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "更新会员失败",
      },
      { status: 500 },
    )
  }
}

// 删除会员
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await mockDatabase.delete("members", params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "会员不存在",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "删除会员成功",
    })
  } catch (error) {
    console.error("[v0] 删除会员失败:", error)
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "删除会员失败",
      },
      { status: 500 },
    )
  }
}
