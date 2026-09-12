import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WaymarkLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route; this is defence in depth for the
  // case where someone edits the matcher and forgets this page exists.
  if (!user) redirect("/auth");

  // Signing in always lands here, so this is the only thing that routes a
  // student who has an account but never finished onboarding. Without it they
  // sit on the dashboard forever with no profile embedding, and the feed has
  // nothing to rank against.
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, major, year, interests, career_goals, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/onboarding");

  const firstName = profile.full_name?.trim().split(/\s+/)[0] ?? "there";

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

      <div className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {firstName}.
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your feed is ranked against the profile below.
        </p>

        <section className="mt-8 rounded-xl border border-border p-5">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold">Your profile</h2>
            <span className="text-xs text-muted-foreground">
              {profile.major}
              {profile.year ? ` · ${profile.year}` : ""}
            </span>
          </div>

          {profile.interests?.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {profile.interests.map((interest: string) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          ) : null}

          {profile.career_goals ? (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {profile.career_goals}
            </p>
          ) : null}
        </section>

        <section className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-medium">No opportunities yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your profile is saved and matching is ready to go — there just
            isn&rsquo;t anything on campus loaded in to rank yet. That lands
            with the seed step.
          </p>
        </section>
      </div>
    </main>
  );
}
