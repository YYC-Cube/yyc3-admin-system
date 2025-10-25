export default function Loading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-96 animate-pulse rounded-lg bg-muted" />
        <div className="h-5 w-[600px] animate-pulse rounded-lg bg-muted" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
