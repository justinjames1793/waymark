import { AppNav } from "@/components/app-nav";
import { Skeleton, PageHeaderSkeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <AppNav />
      <div className="mx-auto max-w-xl px-5 py-10">
        <PageHeaderSkeleton />

        <div className="mt-8 space-y-6">
          {[1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="mb-1.5 h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}

          <div>
            <Skeleton className="mb-1.5 h-4 w-14" />
            <div className="flex flex-wrap gap-2">
              {["w-20", "w-20", "w-20", "w-20", "w-24", "w-28"].map((w, i) => (
                <Skeleton key={i} className={`h-9 rounded-full ${w}`} />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="mb-1.5 h-4 w-20" />
            <Skeleton className="h-24 w-full" />
          </div>

          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </main>
  );
}
