import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingForm from "./onboarding-form";

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

  return <OnboardingForm initial={profile ?? null} />;
}
