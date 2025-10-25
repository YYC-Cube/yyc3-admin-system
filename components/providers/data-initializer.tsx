"use client"

import type React from "react"

import { useEffect } from "react"
import { initializeMockData } from "@/lib/utils/storage"

export function DataInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 在客户端初始化模拟数据
    initializeMockData()
  }, [])

  return <>{children}</>
}
