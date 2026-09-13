import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/app-nav";
import { Feed } from "@/components/feed";
import type { MatchedOpportunity } from "@/types/database";

export const dynamic = "force-dynamic";

const FEED_SIZE = 30;

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
    .select("full_name, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Pure pgvector search against the stored profile embedding. No embedding API
  // call happens on this path.
  const { data: matched } = await supabase.rpc("match_for_me", {
    match_count: FEED_SIZE,
  });

  const opportunities = (matched ?? []) as MatchedOpportunity[];
  const firstName = profile.full_name?.trim().split(/\s+/)[0] ?? "there";

  return (
    <main className="min-h-screen">
      <AppNav />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-bold tracking-tight">
          {opportunities.length ? `Picked for you, ${firstName}.` : `Welcome, ${firstName}.`}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Ranked against your major, interests and goals — not by date.{" "}
          <a href="/explore" className="text-foreground underline underline-offset-4">
            Explore everything
          </a>{" "}
          to look outside them.
        </p>

        <div className="mt-8">
          <Feed
            opportunities={opportunities}
            showMatch
            explain
            emptyMessage="Nothing is loaded into the catalog yet. Run npm run seed to populate it."
          />
        </div>
      </div>
    </main>
  );
}
