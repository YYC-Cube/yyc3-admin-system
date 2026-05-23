// 数据分析服务

import type { AnalyticsData, TrendData, CategorySales, Order, Product } from "@/lib/types"
import { mockDB } from "@/lib/utils/storage"

// 获取营业趋势数据
export async function getRevenueTrend(days = 7): Promise<AnalyticsData[]> {
  const orders = mockDB.get<Order>("orders") || []
  const data: AnalyticsData[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const dayOrders = orders.filter((o) => o.createdAt.startsWith(dateStr))

    data.push({
      date: dateStr,
      revenue: dayOrders.reduce((sum, o) => sum + o.paidAmount, 0),
      orders: dayOrders.length,
      members: new Set(dayOrders.filter((o) => o.customerId).map((o) => o.customerId)).size,
      avgOrderValue: dayOrders.length > 0 ? dayOrders.reduce((sum, o) => sum + o.paidAmount, 0) / dayOrders.length : 0,
    })
  }

  return data
}

// 获取分类销售数据
export async function getCategorySales(): Promise<CategorySales[]> {
  const orders = mockDB.get<Order>("orders") || []
  const products = mockDB.get<Product>("products") || []

  const categorySales = new Map<string, number>()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        const category = product.category?.name || "其他"
        categorySales.set(category, (categorySales.get(category) || 0) + item.totalAmount)
      }
    })
  })

  const total = Array.from(categorySales.values()).reduce((sum, val) => sum + val, 0)

  return Array.from(categorySales.entries())
    .map(([category, sales]) => ({
      category,
      sales,
      percentage: total > 0 ? (sales / total) * 100 : 0,
    }))
    .sort((a, b) => b.sales - a.sales)
}

// 获取热销商品
export async function getTopProducts(limit = 10): Promise<Array<Product & { sales: number }>> {
  const orders = mockDB.get<Order>("orders") || []
  const products = mockDB.get<Product>("products") || []

  const productSales = new Map<string, number>()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      productSales.set(item.productId, (productSales.get(item.productId) || 0) + item.quantity)
    })
  })

  return Array.from(productSales.entries())
    .map(([productId, sales]) => {
      const product = products.find((p) => p.id === productId)
      return product ? { ...product, sales } : null
    })
    .filter((p): p is Product & { sales: number } => p !== null)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)
}

// 获取会员增长趋势
export async function getMemberGrowth(days = 30): Promise<TrendData[]> {
  const members = mockDB.get("members") || []
  const data: TrendData[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    const newMembers = members.filter((m: any) => m.createdAt.startsWith(dateStr)).length

    data.push({
      label: dateStr,
      value: newMembers,
      change: 0, // 可以计算相对于前一天的变化
    })
  }

  return data
}

// 预测未来营业额
export async function predictRevenue(days = 7): Promise<AnalyticsData[]> {
  // 获取历史数据
  const historicalData = await getRevenueTrend(30)

  // 简单的线性预测（实际应用中可以使用更复杂的算法）
  const avgRevenue = historicalData.reduce((sum, d) => sum + d.revenue, 0) / historicalData.length
  const avgOrders = historicalData.reduce((sum, d) => sum + d.orders, 0) / historicalData.length

  const predictions: AnalyticsData[] = []

  for (let i = 1; i <= days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]

    predictions.push({
      date: dateStr,
      revenue: avgRevenue * (1 + Math.random() * 0.2 - 0.1), // 添加一些随机波动
      orders: Math.round(avgOrders * (1 + Math.random() * 0.2 - 0.1)),
      members: 0,
      avgOrderValue: avgRevenue / avgOrders,
    })
  }

  return predictions
}
