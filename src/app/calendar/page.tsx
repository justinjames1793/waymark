import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchSaved } from "@/lib/saved";
import { AppNav } from "@/components/app-nav";
import { CalendarView } from "@/components/calendar-view";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const saved = await fetchSaved(supabase, user.id);
  const events = saved.map((row) => row.opportunities);

  return (
    <main className="min-h-screen">
      <AppNav />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Your calendar.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything you&rsquo;ve saved, laid out by date.
        </p>

        <div className="mt-8">
          {events.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-sm font-medium">Nothing on the calendar yet</p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Save something from{" "}
                <Link href="/dashboard" className="text-foreground underline underline-offset-4">
                  your feed
                </Link>{" "}
                and it shows up here.
              </p>
            </div>
          ) : (
            <CalendarView events={events} />
          )}
        </div>
      </div>
    </main>
  );
}
