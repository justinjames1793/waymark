import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchSaved, splitSaved } from "@/lib/saved";
import { AppNav } from "@/components/app-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/profile-form";
import { formatEventTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const RATING_LABEL: Record<number, string> = {
  3: "Very useful",
  2: "Somewhat useful",
  1: "Not that useful",
};

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, major, year, interests, career_goals, resume, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/onboarding");

  const { answered } = splitSaved(await fetchSaved(supabase, user.id));
  const attended = answered.filter((r) => r.attended);

  return (
    <main className="min-h-screen">
      <AppNav />

      <div className="mx-auto max-w-xl px-5 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Your profile.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Saving recomputes how your feed is ranked. Signed in as {user.email}.
        </p>

        {attended.length > 0 && (
          <section className="mt-8 rounded-xl border border-border p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-sm font-semibold">Experience log</h2>
              <Badge variant="secondary">{attended.length} attended</Badge>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Built from events you went to and rated. These feed your
              recommendations alongside what you wrote below.
            </p>

            <ul className="mt-4 space-y-3">
              {attended.map((row) => (
                <li key={row.opportunity_id} className="border-l-2 border-accent/40 pl-3">
                  <p className="text-sm font-medium leading-snug">
                    {row.opportunities.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {row.opportunities.organization} ·{" "}
                    {formatEventTime(row.opportunities.starts_at, false)}
                    {row.rating ? ` · ${RATING_LABEL[row.rating]}` : ""}
                  </p>
                  {row.reflection && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{row.reflection}&rdquo;
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-8">
          <ProfileForm initial={profile} mode="edit" />
        </div>

        <div className="mt-10 border-t border-border pt-6 sm:hidden">
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline" className="w-full">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
