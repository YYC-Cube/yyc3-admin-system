"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  getRevenueTrend,
  getCategorySales,
  getTopProducts,
  getMemberGrowth,
  predictRevenue,
} from "@/lib/services/analytics"
import type { AnalyticsData, CategorySales, Product } from "@/lib/types"

// 图表颜色
const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"]

// 智能数据分析页面
export default function AnalyticsPage() {
  const [revenueTrend, setRevenueTrend] = useState<AnalyticsData[]>([])
  const [categorySales, setCategorySales] = useState<CategorySales[]>([])
  const [topProducts, setTopProducts] = useState<Array<Product & { sales: number }>>([])
  const [memberGrowth, setMemberGrowth] = useState<any[]>([])
  const [predictions, setPredictions] = useState<AnalyticsData[]>([])

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    const [revenue, category, products, growth, predict] = await Promise.all([
      getRevenueTrend(7),
      getCategorySales(),
      getTopProducts(10),
      getMemberGrowth(7),
      predictRevenue(7),
    ])

    setRevenueTrend(revenue)
    setCategorySales(category)
    setTopProducts(products)
    setMemberGrowth(growth)
    setPredictions(predict)
  }

  // 计算总计
  const totalRevenue = revenueTrend.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = revenueTrend.reduce((sum, d) => sum + d.orders, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">智能数据分析</h1>
        <p className="mt-2 text-muted-foreground">深度洞察业务数据,智能预测未来趋势</p>
      </motion.div>

      {/* 关键指标 */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">近7日营业额</p>
                  <p className="text-2xl font-bold text-foreground">¥{totalRevenue.toFixed(2)}</p>
                  <div className="flex items-center gap-1 text-sm text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">订单总数</p>
                  <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                  <div className="flex items-center gap-1 text-sm text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+8.2%</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">客单价</p>
                  <p className="text-2xl font-bold text-foreground">¥{avgOrderValue.toFixed(2)}</p>
                  <div className="flex items-center gap-1 text-sm text-destructive">
                    <TrendingDown className="h-4 w-4" />
                    <span>-3.1%</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">热销商品</p>
                  <p className="text-2xl font-bold text-foreground">{topProducts.length}</p>
                  <div className="flex items-center gap-1 text-sm text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+5.4%</span>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 图表区域 */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">营业趋势</TabsTrigger>
          <TabsTrigger value="category">分类销售</TabsTrigger>
          <TabsTrigger value="products">热销商品</TabsTrigger>
          <TabsTrigger value="prediction">智能预测</TabsTrigger>
        </TabsList>

        {/* 营业趋势 */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>近7日营业趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="营业额" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#8b5cf6" name="订单数" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 分类销售 */}
        <TabsContent value="category">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>分类销售占比</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categorySales}
                      dataKey="sales"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {categorySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分类销售详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorySales.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">¥{item.sales.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 热销商品 */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>热销商品TOP10</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" name="销量" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 智能预测 */}
        <TabsContent value="prediction">
          <Card>
            <CardHeader>
              <CardTitle>未来7日营业额预测</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={[...revenueTrend, ...predictions]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    name="实际营业额"
                    strokeWidth={2}
                    strokeDasharray="0"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f59e0b"
                    name="预测营业额"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  <strong>AI分析:</strong>{" "}
                  根据历史数据分析,预计未来7日营业额将保持稳定增长趋势,建议适当增加热销商品库存,优化会员营销策略。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
