import Link from "next/link";
import { WaymarkLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Link href="/">
        <WaymarkLockup />
      </Link>

      <h1 className="mt-10 text-2xl font-bold tracking-tight">
        No trail marker here.
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        This page doesn&rsquo;t exist. The opportunities do.
      </p>

      <div className="mt-7">
        <Link href="/dashboard">
          <Button>Back to my feed</Button>
        </Link>
      </div>
    </main>
  );
}
