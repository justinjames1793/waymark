import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-secondary", className)} />;
}

/**
 * Mirrors the real feed's layout closely enough that nothing jumps when the
 * data lands — a skeleton that reflows on swap is worse than no skeleton.
 */
export function FeedSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div>
      <Skeleton className="h-10 w-full" />

      <div className="mt-4 flex flex-wrap gap-1.5">
        {["w-12", "w-16", "w-24", "w-20", "w-20"].map((w, i) => (
          <Skeleton key={i} className={cn("h-7 rounded-full", w)} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["w-20", "w-18", "w-22", "w-16", "w-20", "w-16"].map((w, i) => (
          <Skeleton key={i} className={cn("h-6 rounded-full", w)} />
        ))}
      </div>

      <Skeleton className="mt-5 h-3 w-28" />

      <div className="mt-4 space-y-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/3" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-1.5 h-4 w-5/6" />
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-80" />
    </>
  );
}
