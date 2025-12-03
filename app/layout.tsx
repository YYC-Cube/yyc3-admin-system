/**
 * @fileoverview 根布局组件 - 应用程序的根布局
 * @description 定义全局布局结构，包括 HTML 框架、主题提供者、全局样式、
 *              分析工具等。作为所有页面的外层包装，提供统一的 UI 和功能
 * @page
 * @module yyc3-admin-system/app/layout
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-19
 * @updated 2025-12-01
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import type React from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { validateEnv } from '@/config/env.validator'
import './globals.css'
import dynamic from 'next/dynamic'

// ✅ 环境变量验证（开发环境仅验证必需项）
if (process.env.NODE_ENV === 'production') {
  validateEnv(['NEXT_PUBLIC_API_BASE_URL', 'JWT_SECRET', 'YYC3_YY_DB_HOST', 'REDIS_URL'])
}

// Note: Google Fonts removed for offline build support
// Using Tailwind's default font-sans stack instead

export const metadata: Metadata = {
  title: '启智商家后台管理系统',
  description: 'KTV商家智能管理平台 - 销售、商品、仓库、报表一体化管理',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '启智商家',
    startupImage: [
      {
        url: '/splash-640x1136.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/splash-750x1334.png',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

// 动态导入客户端组件（移除 ssr: false，Next.js 15+ 不支持在 Server Component 中使用）
const ClientComponents = dynamic(() => import('@/components/layout/ClientComponents'))

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="启智商家" />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {/* 客户端组件 - 只在客户端渲染 */}
        <ClientComponents />
      </body>
    </html>
  )
}
