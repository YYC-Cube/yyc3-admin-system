"use client"

/**
 * @file 应用级错误边界
 * @description 捕获并展示运行时错误详情，辅助定位问题
 * @module app-error-boundary
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */
import React, { useEffect } from "react"

/**
 * 应用错误边界组件
 * - 在 Next.js App Router 中，当页面或组件抛错时将进入该组件
 * - 打印详细错误日志，显示关键信息（message、digest、stack）以便排查
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 输出完整错误信息，便于在浏览器控制台与终端中定位
    console.error("🚨 [AppError]", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      digest: (error as any)?.digest,
    })
  }, [error])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-xl font-bold mb-4">应用发生错误</h1>
        <div className="rounded-md border p-4 bg-muted/30">
          <p className="text-sm">错误信息: {String(error?.message || "未知错误")}</p>
          {error?.name && (
            <p className="text-sm mt-2">错误类型: {error.name}</p>
          )}
          {(error as any)?.digest && (
            <p className="text-sm mt-2">Digest: {(error as any).digest}</p>
          )}
          {error?.stack && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm">查看堆栈</summary>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
            </details>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="px-3 py-2 rounded-md border hover:bg-muted"
            onClick={() => reset()}
          >
            重试
          </button>
          <button
            className="px-3 py-2 rounded-md border hover:bg-muted"
            onClick={() => window.location.reload()}
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  )
}
