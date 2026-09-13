import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/app-nav";
import { Feed } from "@/components/feed";
import type { Opportunity } from "@/types/database";

export const dynamic = "force-dynamic";

/**
 * Everything in the catalog, ordered by what happens next — deliberately not
 * ranked against the student's profile. This is the escape hatch from the
 * recommendation engine: the point of the product is surfacing things you had
 * no reason to look for, and a feed that only ever reflects your stated
 * interests can't do that.
 */
export default async function ExplorePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data } = await supabase
    .from("opportunities")
    .select("*")
    .order("starts_at", { ascending: true, nullsFirst: false });

  const opportunities = (data ?? []) as Opportunity[];

  return (
    <main className="min-h-screen">
      <AppNav />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Explore everything.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every opportunity on campus, soonest first — across all interests, not
          just the ones you picked.
        </p>

        <div className="mt-8">
          <Feed
            opportunities={opportunities}
            emptyMessage="Nothing is loaded into the catalog yet. Run npm run seed to populate it."
          />
        </div>
      </div>
    </main>
  );
}
