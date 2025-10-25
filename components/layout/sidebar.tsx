"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  BarChart3,
  Users,
  Settings,
  Receipt,
  ChevronLeft,
  Store,
  Brain,
  Cpu,
  Wifi,
  Database,
  TrendingUp,
  MessageSquare,
  UserCog,
  Target,
  FileCheck,
  DollarSign,
  Megaphone,
  Phone,
  ClipboardCheck,
} from "lucide-react"
import { AnimatePresence, useState } from "framer-motion" // Import AnimatePresence and useState

// 导航菜单配置
const menuItems = [
  {
    title: "仪表盘",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "销售管理",
    icon: ShoppingCart,
    href: "/dashboard/sales",
    children: [
      { title: "订单列表", href: "/dashboard/sales/orders" },
      { title: "账单列表", href: "/dashboard/sales/bills" },
      { title: "在线预定", href: "/dashboard/sales/reservations" },
    ],
  },
  {
    title: "商品管理",
    icon: Package,
    href: "/dashboard/products",
    children: [
      { title: "商品列表", href: "/dashboard/products/list" },
      { title: "商品套餐", href: "/dashboard/products/packages" },
      { title: "开房套餐", href: "/dashboard/products/room-packages" },
      { title: "计时开房", href: "/dashboard/products/hourly-billing" },
      { title: "商品配送", href: "/dashboard/products/delivery" },
      { title: "价格策略", href: "/dashboard/products/pricing" },
      { title: "商品口味", href: "/dashboard/products/flavors" },
    ],
  },
  {
    title: "仓库管理",
    icon: Warehouse,
    href: "/dashboard/warehouse",
    children: [
      { title: "仓库列表", href: "/dashboard/warehouse/list" },
      { title: "采购进货", href: "/dashboard/warehouse/purchase" },
      { title: "库存调拨", href: "/dashboard/warehouse/transfer" },
      { title: "库存盘点", href: "/dashboard/warehouse/inventory" },
      { title: "实时库存", href: "/dashboard/warehouse/stock" },
      { title: "寄存管理", href: "/dashboard/warehouse/storage" },
      { title: "报损管理", href: "/dashboard/warehouse/damage" },
      { title: "领用管理", href: "/dashboard/warehouse/requisition" },
    ],
  },
  {
    title: "报表中心",
    icon: BarChart3,
    href: "/dashboard/reports",
    children: [
      { title: "营业报表", href: "/dashboard/reports/business" },
      { title: "仓库报表", href: "/dashboard/reports/warehouse" },
      { title: "会员报表", href: "/dashboard/reports/members" },
      { title: "酒水存取", href: "/dashboard/reports/liquor" },
    ],
  },
  {
    title: "会员管理",
    icon: Users,
    href: "/dashboard/members",
  },
  {
    title: "员工管理",
    icon: Users,
    href: "/dashboard/employees",
  },
  {
    title: "账单管理",
    icon: Receipt,
    href: "/dashboard/billing",
    children: [
      { title: "账单制作", href: "/dashboard/billing/create" },
      { title: "账单查看", href: "/dashboard/billing/view" },
      { title: "打印设置", href: "/dashboard/billing/printer" },
    ],
  },
  {
    title: "AI智能运营",
    icon: Brain,
    href: "/dashboard/ai-ops",
    children: [
      { title: "盈亏计算器", href: "/dashboard/ai-ops/profit", icon: DollarSign },
      { title: "客户营销", href: "/dashboard/ai-ops/customer", icon: Megaphone },
      { title: "回访邀约", href: "/dashboard/ai-ops/outreach", icon: Phone },
      { title: "运维跟踪", href: "/dashboard/ai-ops/ops", icon: ClipboardCheck },
      { title: "反馈体系", href: "/dashboard/ai-ops/feedback", icon: MessageSquare },
      { title: "内部沟通", href: "/dashboard/ai-ops/comm", icon: MessageSquare },
      { title: "HR管理", href: "/dashboard/ai-ops/hr", icon: UserCog },
      { title: "战略决策", href: "/dashboard/ai-ops/executive", icon: Target },
      { title: "合规审计", href: "/dashboard/ai-ops/compliance", icon: FileCheck },
    ],
  },
  {
    title: "AI深度集成",
    icon: Brain,
    href: "/dashboard/ai",
    children: [
      { title: "AI营销助手", href: "/dashboard/ai/marketing" },
      { title: "AI定价优化", href: "/dashboard/ai/pricing" },
      { title: "AI客流预测", href: "/dashboard/ai/traffic" },
    ],
  },
  {
    title: "大数据分析",
    icon: Database,
    href: "/dashboard/bigdata",
    children: [
      { title: "实时数据仓库", href: "/dashboard/bigdata/warehouse" },
      { title: "商业智能分析", href: "/dashboard/bigdata/bi" },
      { title: "预测分析引擎", href: "/dashboard/bigdata/predictive" },
      { title: "用户行为分析", href: "/dashboard/bigdata/behavior" },
    ],
  },
  {
    title: "物联网集成",
    icon: Wifi,
    href: "/dashboard/iot",
    children: [
      { title: "智能包厢控制", href: "/dashboard/iot/rooms" },
      { title: "智能库存管理", href: "/dashboard/iot/inventory" },
      { title: "智能能源管理", href: "/dashboard/iot/energy" },
    ],
  },
  {
    title: "边缘计算",
    icon: Cpu,
    href: "/dashboard/edge",
    children: [
      { title: "边缘计算节点", href: "/dashboard/edge/compute" },
      { title: "边缘缓存", href: "/dashboard/edge/cache" },
      { title: "边缘AI推理", href: "/dashboard/edge/ai" },
    ],
  },
  {
    title: "5G应用",
    icon: TrendingUp,
    href: "/dashboard/5g",
    children: [
      { title: "实时视频", href: "/dashboard/5g/video" },
      { title: "AR增强现实", href: "/dashboard/5g/ar" },
      { title: "VR虚拟现实", href: "/dashboard/5g/vr" },
    ],
  },
  {
    title: "数据分析",
    icon: BarChart3,
    href: "/dashboard/analytics",
  },
  {
    title: "系统设置",
    icon: Settings,
    href: "/dashboard/settings",
    children: [
      { title: "门店设置", href: "/dashboard/settings/store" },
      { title: "打印机设置", href: "/dashboard/settings/printer" },
      { title: "VOD设置", href: "/dashboard/settings/vod" },
      { title: "寄存设置", href: "/dashboard/settings/storage" },
      { title: "轮播图设置", href: "/dashboard/settings/carousel" },
      { title: "跑马灯设置", href: "/dashboard/settings/marquee" },
      { title: "抹零设置", href: "/dashboard/settings/rounding" },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* 侧边栏容器 - 带展开/收起动画 */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex flex-col border-r border-border bg-card"
      >
        {/* Logo区域 */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
              scale: isOpen ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-6 w-6" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-bold text-foreground">启智商家</h1>
                <p className="text-xs text-muted-foreground">后台管理系统</p>
              </div>
            )}
          </motion.div>

          {/* 折叠按钮 */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", !isOpen && "rotate-180")} />
          </motion.button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <SidebarItem key={item.href} item={item} isOpen={isOpen} pathname={pathname} />
            ))}
          </ul>
        </nav>

        {/* 底部用户信息 */}
        <div className="border-t border-border p-4">
          <motion.div
            initial={false}
            animate={{
              opacity: isOpen ? 1 : 0,
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">启智网络</p>
                <p className="truncate text-xs text-muted-foreground">13103790379</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.aside>
    </>
  )
}

// 侧边栏菜单项组件
function SidebarItem({
  item,
  isOpen,
  pathname,
}: {
  item: (typeof menuItems)[0]
  isOpen: boolean
  pathname: string
}) {
  const [expanded, setExpanded] = useState(false)
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
  const hasChildren = item.children && item.children.length > 0

  return (
    <li>
      <Link
        href={item.href}
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault()
            setExpanded(!expanded)
          }
        }}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          "hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 truncate"
          >
            {item.title}
          </motion.span>
        )}
      </Link>

      {/* 子菜单 */}
      {hasChildren && isOpen && (
        <AnimatePresence>
          {expanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-8 mt-1 space-y-1 overflow-hidden"
            >
              {item.children?.map((child) => {
                const isChildActive = pathname === child.href
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isChildActive && "bg-accent text-accent-foreground font-medium",
                      )}
                    >
                      {child.title}
                    </Link>
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  )
}
