'use client'

import * as React from 'react'
import type { ReactNode } from 'react'

import { useEffect } from 'react'
import { initializeMockData } from '@/lib/utils/storage'

export function DataInitializer({ children }: { children: ReactNode }) {
  useEffect(() => {
    // 在客户端初始化模拟数据
    initializeMockData()
  }, [])

  return <>{children}</>
}
