import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WaymarkLockup } from "@/components/brand/logo";
import { ProfileForm } from "@/components/profile-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route; this is defence in depth.
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, major, year, interests, career_goals, onboarding_complete")
    .eq("id", user.id)
    .single();

  // Already done this — send them to the feed instead of making them redo it.
  if (profile?.onboarding_complete) redirect("/dashboard");

  return (
    <main className="min-h-screen px-5 py-12">
      <div className="mx-auto max-w-xl">
        <WaymarkLockup />

        <h1 className="mt-8 text-2xl font-bold tracking-tight">Tell us about you.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This is what the recommendation engine matches against — the more
          specific, the better the feed.
        </p>

        <div className="mt-8">
          <ProfileForm initial={profile ?? null} mode="onboarding" />
        </div>
      </div>
    </main>
  );
}
