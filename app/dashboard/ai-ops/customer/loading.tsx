import { Skeleton } from "@/components/ui/skeleton"

export default function CustomerPromotionLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-5 w-[600px] mt-2" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  )
}
