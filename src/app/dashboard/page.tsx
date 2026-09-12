import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WaymarkLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

/**
 * Placeholder dashboard. Its only job right now is to prove the session
 * survives a server render and a hard refresh — the exact thing that was broken
 * before. The matched feed lands here in Phase 3.
 */
export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route; this is defence in depth for the
  // case where someone edits the matcher and forgets this page exists.
  if (!user) redirect("/auth");

  return (
    <main className="min-h-screen">
      <header className="flex h-[72px] items-center justify-between border-b border-border px-5">
        <WaymarkLockup />
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-2xl font-bold tracking-tight">
          You&rsquo;re signed in.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as {user.email}.
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-border p-6">
          <p className="text-sm font-medium">Phase 1 complete</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Hard-refresh this page. If you stay signed in, the session is being
            refreshed correctly by middleware and the bug from the previous build
            is fixed. Onboarding and the matched feed come next.
          </p>
        </div>
      </div>
    </main>
  );
}
