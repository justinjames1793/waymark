"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WaymarkLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <WaymarkLockup />

      <h1 className="mt-10 text-2xl font-bold tracking-tight">
        That didn&rsquo;t load.
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Something broke on our end, not yours. Trying again usually works — if it
        keeps happening, the database may be paused.
      </p>

      <div className="mt-7 flex flex-col gap-2 sm:flex-row">
        <Button onClick={reset}>Try again</Button>
        <Link href="/dashboard">
          <Button variant="outline" className="w-full sm:w-auto">
            Back to my feed
          </Button>
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 font-mono text-xs text-muted-foreground">
          {error.digest}
        </p>
      )}
    </main>
  );
}
