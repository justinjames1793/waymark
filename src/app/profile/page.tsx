import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/app-nav";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, major, year, interests, career_goals, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/onboarding");

  return (
    <main className="min-h-screen">
      <AppNav />

      <div className="mx-auto max-w-xl px-5 py-10">
        <h1 className="text-2xl font-bold tracking-tight">Your profile.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Saving recomputes how your feed is ranked. Signed in as {user.email}.
        </p>

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
