export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-20 bg-muted animate-pulse rounded-lg" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  )
}
