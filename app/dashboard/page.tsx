'use client'

import { Suspense, useEffect, useState } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    if (!baseUrl) {
      setError('API_BASE_URL 未配置，请设置 NEXT_PUBLIC_API_BASE_URL 环境变量')
      return
    }
    fetch(`${baseUrl}/api/dashboard`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        return res.json()
      })
      .then(setData)
      .catch(err => setError(err.message))
  }, [])

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">仪表盘</h1>
          <p className="mt-2 text-muted-foreground">欢迎回来,这是您的业务概览</p>
        </div>
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
          <p className="text-muted-foreground">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">静态演示模式下，请配置后端 API 以获取实时数据</p>
        </div>
        <QuickActions />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">仪表盘</h1>
          <p className="mt-2 text-muted-foreground">欢迎回来,这是您的业务概览</p>
        </div>
        <StatsLoadingSkeleton />
        <OrdersLoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">仪表盘</h1>
        <p className="mt-2 text-muted-foreground">欢迎回来,这是您的业务概览</p>
      </div>

      <Suspense fallback={<StatsLoadingSkeleton />}>
        <DashboardStats data={data.stats} />
      </Suspense>

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
