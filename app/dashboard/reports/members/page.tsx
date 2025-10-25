"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, Gift, CreditCard } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { FilterBar } from "@/components/dashboard/filter-bar"
import { DataTable } from "@/components/dashboard/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// 模拟会员报表数据
const mockMemberStats = [
  {
    id: "1",
    cardNo: "000003",
    name: "张三",
    phone: "18950177190",
    visits: 8,
    totalSpent: 2374.2,
    balance: 1662.14,
    points: 20872,
  },
  {
    id: "2",
    cardNo: "1111",
    name: "李四",
    phone: "13779938000",
    visits: 5,
    totalSpent: 93.0,
    balance: 907.0,
    points: 9300,
  },
]

const chartData = [
  { month: "1月", recharge: 45000, consumption: 38000 },
  { month: "2月", recharge: 52000, consumption: 42000 },
  { month: "3月", recharge: 48000, consumption: 45000 },
  { month: "4月", recharge: 61000, consumption: 51000 },
  { month: "5月", recharge: 55000, consumption: 48000 },
  { month: "6月", recharge: 67000, consumption: 58000 },
]

export default function MemberReportsPage() {
  const columns = [
    { key: "cardNo", label: "会员卡号" },
    { key: "name", label: "会员姓名" },
    { key: "phone", label: "手机号" },
    {
      key: "visits",
      label: "到店次数",
      render: (value: number) => <span className="font-medium">{value}次</span>,
    },
    {
      key: "totalSpent",
      label: "累计消费",
      render: (value: number) => <span className="font-semibold text-green-600">¥{value.toFixed(2)}</span>,
    },
    {
      key: "balance",
      label: "账户余额",
      render: (value: number) => <span className="font-medium text-primary">¥{value.toFixed(2)}</span>,
    },
    {
      key: "points",
      label: "积分余额",
      render: (value: number) => <Badge variant="secondary">{value}</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">会员报表</h1>
          <p className="text-sm text-muted-foreground">查看会员消费和充值统计</p>
        </div>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="会员总数"
          value="1,234"
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          description="较上月增长"
          delay={0}
        />
        <StatCard
          title="本月充值"
          value="¥6.7万"
          icon={CreditCard}
          trend={{ value: 18.2, isPositive: true }}
          description="充值金额"
          delay={0.1}
        />
        <StatCard
          title="本月消费"
          value="¥5.8万"
          icon={TrendingUp}
          trend={{ value: 15.3, isPositive: true }}
          description="消费金额"
          delay={0.2}
        />
        <StatCard
          title="积分发放"
          value="12.8万"
          icon={Gift}
          trend={{ value: 8.7, isPositive: true }}
          description="本月发放"
          delay={0.3}
        />
      </div>

      {/* 充值消费趋势图 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>充值与消费趋势</CardTitle>
            <CardDescription>最近6个月的会员充值和消费数据</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                recharge: {
                  label: "充值金额",
                  color: "hsl(var(--chart-1))",
                },
                consumption: {
                  label: "消费金额",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="recharge" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="consumption" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* 筛选栏 */}
      <FilterBar searchPlaceholder="搜索会员卡号、姓名..." showDateRange onExport={() => console.log("导出会员报表")} />

      {/* 数据表格 */}
      <DataTable
        columns={columns}
        data={mockMemberStats}
        onRowClick={(member) => console.log("查看会员详情:", member)}
      />
    </div>
  )
}
