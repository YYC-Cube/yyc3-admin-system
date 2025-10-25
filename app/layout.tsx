import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { validateEnv } from "@/config/env.validator"
import "./globals.css"

// ✅ 环境变量验证（仅在构建时执行，不影响客户端渲染）
validateEnv([
  "NEXT_PUBLIC_API_BASE_URL",
  "JWT_SECRET",
  "YYC3_YY_DB_HOST",
  "EMAIL_HOST",
  "BI_HOST",
  "OLAP_HOST",
  "REDIS_URL",
])

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "启智商家后台管理系统",
  description: "KTV商家智能管理平台 - 销售、商品、仓库、报表一体化管理",
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "启智商家",
  },
  formatDetection: {
    telephone: false,
  },
}

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
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
