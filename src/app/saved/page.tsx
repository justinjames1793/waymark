import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchSaved, splitSaved } from "@/lib/saved";
import { AppNav } from "@/components/app-nav";
import { OpportunityCard } from "@/components/opportunity-card";
import { ReflectionPrompt } from "@/components/reflection-prompt";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { upcoming, pending, answered } = splitSaved(await fetchSaved(supabase, user.id));
  const attended = answered.filter((r) => r.attended);

  return (
    <main className="min-h-screen">
      <AppNav />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Saved.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything you&rsquo;ve bookmarked.{" "}
          <Link href="/calendar" className="text-foreground underline underline-offset-4">
            See it on a calendar
          </Link>
          .
        </p>

        {pending.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold">
              How did these go?
              <Badge variant="accent" className="ml-2">
                {pending.length}
              </Badge>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Telling us is what makes the feed smarter about you.
            </p>
            <div className="mt-4 space-y-3">
              {pending.map((row) => (
                <ReflectionPrompt key={row.opportunity_id} opportunity={row.opportunities} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-sm font-semibold">Coming up</h2>
          {upcoming.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium">Nothing saved yet</p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Tap the bookmark on anything in{" "}
                <Link href="/dashboard" className="text-foreground underline underline-offset-4">
                  your feed
                </Link>{" "}
                to keep it here.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {upcoming.map((row) => (
                <OpportunityCard key={row.opportunity_id} opportunity={row.opportunities} saved />
              ))}
            </div>
          )}
        </section>

        {attended.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold">Been there</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These are feeding your recommendations. The full log lives on{" "}
              <Link href="/profile" className="text-foreground underline underline-offset-4">
                your profile
              </Link>
              .
            </p>
            <div className="mt-3 space-y-3">
              {attended.map((row) => (
                <OpportunityCard key={row.opportunity_id} opportunity={row.opportunities} saved />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
