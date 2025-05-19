import { Skeleton } from "../ui/skeleton"

const CardSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-xl">
      {/* Thumbnail Skeleton */}
      <div className="relative aspect-video overflow-hidden">
        <Skeleton className="h-full w-full bg-sky-950/20" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-20 rounded-full bg-sky-950/30" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-4">
        {/* Title and Description */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4 bg-sky-950/20" />
          <Skeleton className="h-4 w-full bg-sky-950/10" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full bg-sky-950/30" />
              <Skeleton className="h-4 flex-1 bg-sky-950/20" />
            </div>
          ))}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-20 bg-sky-950/30" />
          <Skeleton className="h-9 w-28 rounded-md bg-sky-950/20" />
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-sky-100/10 to-transparent" />
    </div>
  )
}

export default CardSkeleton