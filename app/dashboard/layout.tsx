"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DataInitializer } from "@/components/providers/data-initializer"

// 后台系统主布局 - 包含侧边栏和顶部栏
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <DataInitializer>
      <div className="flex h-screen overflow-hidden bg-muted/30">
        {/* 侧边栏 */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* 主内容区域 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* 顶部导航栏 */}
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          {/* 页面内容区 - 带滚动和动画 */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="container mx-auto p-6 md:p-8"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </DataInitializer>
  )
}
