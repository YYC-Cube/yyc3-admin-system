import { Suspense } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Skeleton } from "@/components/ui/skeleton"

// 服务端组件可以直接获取数据，提升性能和SEO

// 获取仪表盘数据的服务端函数
async function getDashboardData() {
  // 模拟API调用，实际应该从数据库获取
  // 使用Next.js缓存策略
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/dashboard`, {
    next: { revalidate: 60 }, // 缓存60秒
  })

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data")
  }

  return res.json()
}

// 仪表盘主页 - 服务端组件
export default async function DashboardPage() {
  // 在服务端获取数据
  const data = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">仪表盘</h1>
        <p className="mt-2 text-muted-foreground">欢迎回来,这是您的业务概览</p>
      </div>

      {/* 统计卡片 - 使用Suspense实现流式渲染 */}
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <DashboardStats data={data.stats} />
      </Suspense>

      {/* 最近订单和快捷操作 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<OrdersLoadingSkeleton />}>
            <RecentOrders orders={data.recentOrders} />
          </Suspense>
        </div>

        <QuickActions />
      </div>
    </div>
  )
}

// 加载骨架屏组件
function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  )
}

function OrdersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  )
}
