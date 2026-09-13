import { AppNav } from "@/components/app-nav";
import { Skeleton, PageHeaderSkeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <AppNav />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <PageHeaderSkeleton />

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-1">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`h${i}`} className="bg-background px-1 py-2">
                <Skeleton className="mx-auto h-3 w-6" />
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="min-h-[64px] bg-background p-1.5 sm:min-h-[88px]">
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
