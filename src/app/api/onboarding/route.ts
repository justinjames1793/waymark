import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { refreshProfileEmbedding } from "@/lib/profile-embedding";
import { YEARS, INTERESTS } from "@/lib/constants";

const RESUME_MAX = 5000;

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const major = typeof body.major === "string" ? body.major.trim() : "";
  const year = typeof body.year === "string" ? body.year : "";
  const interests: string[] = Array.isArray(body.interests)
    ? body.interests.filter((i: unknown) => typeof i === "string" && INTERESTS.includes(i as (typeof INTERESTS)[number]))
    : [];
  const careerGoals = typeof body.careerGoals === "string" ? body.careerGoals.trim() : "";
  const resume = typeof body.resume === "string" ? body.resume.trim().slice(0, RESUME_MAX) : "";

  if (
    !fullName ||
    !major ||
    !YEARS.includes(year as (typeof YEARS)[number]) ||
    interests.length === 0 ||
    !careerGoals
  ) {
    return NextResponse.json({ error: "Fill in every field, and pick at least one interest." }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      major,
      year,
      interests,
      career_goals: careerGoals,
      resume: resume || null,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Saved first, embedded second. If Hugging Face is down the student still
  // keeps their answers and simply gets a date-ordered feed until the next
  // edit recomputes the vector — losing the answers would be the worse failure.
  const matchingReady = await refreshProfileEmbedding(supabase, user.id);

  return NextResponse.json({ ok: true, matchingReady });
}
