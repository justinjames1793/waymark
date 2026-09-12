import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { embed, buildProfileEmbeddingText } from "@/lib/embeddings";
import { YEARS, INTERESTS } from "@/lib/constants";

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

  if (
    !fullName ||
    !major ||
    !YEARS.includes(year as (typeof YEARS)[number]) ||
    interests.length === 0 ||
    !careerGoals
  ) {
    return NextResponse.json({ error: "Fill in every field, and pick at least one interest." }, { status: 400 });
  }

  const update: Record<string, unknown> = {
    full_name: fullName,
    major,
    year,
    interests,
    career_goals: careerGoals,
    onboarding_complete: true,
    updated_at: new Date().toISOString(),
  };

  // If Hugging Face is down, the profile still saves — the student isn't stuck
  // on this page — it just falls back to the plain list until the next edit
  // recomputes the vector. Failing to write here would look identical to a
  // wrong password, the exact class of bug this app was rebuilt to avoid.
  let matchingReady = true;
  try {
    update.embedding = await embed(
      buildProfileEmbeddingText({ major, year, interests, careerGoals })
    );
  } catch (err) {
    console.error("Onboarding embedding failed:", err);
    matchingReady = false;
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, matchingReady });
}
