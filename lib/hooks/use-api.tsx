"use client"

/**
 * 统一API调用Hook - 提供加载状态和错误处理
 */

import { useState, useCallback } from "react"
import type { ApiResponse } from "@/lib/api/unified-client"

export interface UseApiOptions {
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
  showError?: boolean
  showSuccess?: boolean
  successMessage?: string
}

export function useApi<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>, options: UseApiOptions = {}): Promise<ApiResponse<T>> => {
      setLoading(true)
      setError(null)

      const response = await apiCall()

      setLoading(false)

      if (response.success && response.data) {
        setData(response.data)
        options.onSuccess?.(response.data)
      } else if (response.error) {
        setError(response.error)
        options.onError?.(response.error)
      }

      return response
    },
    [],
  )

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset,
  }
}
// </CHANGE>
