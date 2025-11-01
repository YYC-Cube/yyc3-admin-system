/**
 * @file 全局 404 页面（App Router）
 * @description 处理未匹配的路由，提供返回首页入口
 * @module app/not-found
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

export default function NotFound() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-2xl font-bold">页面未找到</h1>
        <p className="text-sm text-muted-foreground">抱歉，您访问的页面不存在或已被移除。</p>
        <a href="/" className="inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-muted">
          返回首页
        </a>
      </div>
    </div>
  )
}
