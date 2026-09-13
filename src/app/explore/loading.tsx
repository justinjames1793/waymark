import { AppNav } from "@/components/app-nav";
import { FeedSkeleton, PageHeaderSkeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <AppNav />
      <div className="mx-auto max-w-3xl px-5 py-10">
        <PageHeaderSkeleton />
        <div className="mt-8">
          <FeedSkeleton />
        </div>
      </div>
    </main>
  );
}
