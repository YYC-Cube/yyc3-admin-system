'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">出错了</h1>
          <p className="mt-2 text-muted-foreground">发生了意外错误</p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            重试
          </button>
        </div>
      </body>
    </html>
  )
}
