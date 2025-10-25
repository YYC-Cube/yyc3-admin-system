"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Store, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // 模拟登录延迟
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="border-2 shadow-2xl">
          <CardHeader className="space-y-4 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg"
            >
              <Store className="h-8 w-8 text-primary-foreground" />
            </motion.div>

            {/* 标题 */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold">启智商家后台</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 text-base">
                <Sparkles className="h-4 w-4" />
                智慧管理，高效运营
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* 手机号输入 */}
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  defaultValue="13103790379"
                  className="h-11"
                  required
                />
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  defaultValue="123456"
                  className="h-11"
                  required
                />
              </div>

              {/* 记住密码和忘记密码 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-muted-foreground">记住密码</span>
                </label>
                <Button variant="link" className="h-auto p-0 text-primary">
                  忘记密码？
                </Button>
              </div>

              {/* 登录按钮 */}
              <Button type="submit" className="h-11 w-full text-base" disabled={isLoading}>
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent"
                  />
                ) : (
                  <>
                    登录
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* 底部提示 */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>登录即表示您同意我们的</p>
              <div className="mt-1 flex items-center justify-center gap-2">
                <Button variant="link" className="h-auto p-0 text-xs">
                  服务条款
                </Button>
                <span>和</span>
                <Button variant="link" className="h-auto p-0 text-xs">
                  隐私政策
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 版本信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>启智商家桌面版 v2.0</p>
          <p className="mt-1">© 2025 启智网络科技</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
