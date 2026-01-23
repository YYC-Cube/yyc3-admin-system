import { NextResponse } from "next/server"

// 仪表盘数据 API（服务端）
export async function GET() {
  // 这里先返回静态 mock 数据，后续可以接真实数据库/服务
  const stats = [
    {
      id: "revenue",
      title: "今日营业额",
      value: "¥ 38,420",
      change: "+12.4%",
      trend: "up" as const,
    },
    {
      id: "orders",
      title: "今日订单数",
      value: "126",
      change: "+5.2%",
      trend: "up" as const,
    },
    {
      id: "members",
      title: "新增会员",
      value: "18",
      change: "-3.1%",
      trend: "down" as const,
    },
    {
      id: "usage",
      title: "包厢使用率",
      value: "74%",
      change: "+8.9%",
      trend: "up" as const,
    },
  ]

  const recentOrders = [
    {
      id: "20250101001",
      room: "豪华包厢 A01",
      amount: "¥ 1,280",
      status: "已结账",
      time: "刚刚",
    },
    {
      id: "20250101002",
      room: "主题包厢 B03",
      amount: "¥ 860",
      status: "进行中",
      time: "5 分钟前",
    },
    {
      id: "20250101003",
      room: "标准包厢 C08",
      amount: "¥ 530",
      status: "已结账",
      time: "20 分钟前",
    },
    {
      id: "20250101004",
      room: "大包厢 D02",
      amount: "¥ 2,150",
      status: "进行中",
      time: "35 分钟前",
    },
  ]

  return NextResponse.json({ stats, recentOrders })
}
