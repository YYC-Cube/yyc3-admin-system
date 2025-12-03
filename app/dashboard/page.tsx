"use client"
import React, { Suspense, useState, useEffect } from "react"
import { DashboardStats } from "../../components/dashboard/dashboard-stats"
import { RecentOrders } from "../../components/dashboard/recent-orders"
import { QuickActions } from "../../components/dashboard/quick-actions"
import { Skeleton } from "../../components/ui/skeleton"

// 仪表盘主页
export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentOrders: null
  });
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 获取仪表盘数据
    const fetchDashboardData = async () => {
      try {
        // setIsLoading(true);
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        if (data.success) {
          setDashboardData(data.data);
          setError(null);
        } else {
          setError(data.error || '获取数据失败');
        }
      } catch (err) {
        console.error('获取仪表盘数据失败:', err);
        setError('获取数据失败，请稍后重试');
      } finally {
        // setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 提供默认的模拟数据，以防API调用失败
  const defaultData = {
    stats: {
      totalSales: 128500,
      todaySales: 4500,
      orderCount: 286,
      activeMembers: 1240,
      growthRate: 18.5,
      conversionRate: 32.8
    },
    recentOrders: [
      { id: 'ORD-202401', room: 'A01', amount: '¥1,280', status: '已完成', time: '2024-01-15 20:30' },
      { id: 'ORD-202402', room: 'B03', amount: '¥850', status: '处理中', time: '2024-01-15 19:15' },
      { id: 'ORD-202403', room: 'VIP01', amount: '¥2,100', status: '已完成', time: '2024-01-14 21:00' },
      { id: 'ORD-202404', room: 'C02', amount: '¥680', status: '已取消', time: '2024-01-14 18:45' },
      { id: 'ORD-202405', room: 'A02', amount: '¥1,450', status: '已完成', time: '2024-01-13 20:00' }
    ]
  };

  // 使用从API获取的数据或默认数据
  const stats = dashboardData.stats || defaultData.stats;
  const recentOrders = dashboardData.recentOrders || defaultData.recentOrders;

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">仪表盘</h1>
        <p className="mt-2 text-muted-foreground">欢迎回来,这是您的业务概览</p>
        {error && (
          <div className="mt-2 text-red-500 text-sm bg-red-50 px-3 py-1 rounded">
            {error}
          </div>
        )}
      </div>

      {/* 统计卡片 - 使用Suspense实现流式渲染 */}
      <Suspense fallback={<StatsLoadingSkeleton />}>
        <DashboardStats data={stats} />
      </Suspense>

      {/* 最近订单和快捷操作 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<OrdersLoadingSkeleton />}>
            <RecentOrders orders={recentOrders} />
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
