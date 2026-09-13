import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { refreshProfileEmbedding } from "@/lib/profile-embedding";

const REFLECTION_MAX = 2000;

/**
 * Answer the "did you go?" prompt for a saved opportunity that has passed.
 *
 * Attending and rating something is the strongest signal the app ever gets
 * about a student, so this recomputes the profile embedding: what they went to
 * and valued starts pulling the feed, not just what they said in onboarding.
 */
export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json();
  const opportunityId = typeof body.opportunityId === "string" ? body.opportunityId : "";
  const attended = Boolean(body.attended);
  const rating =
    typeof body.rating === "number" && body.rating >= 1 && body.rating <= 3
      ? Math.round(body.rating)
      : null;
  const reflection =
    typeof body.reflection === "string" ? body.reflection.trim().slice(0, REFLECTION_MAX) : "";

  if (!opportunityId) {
    return NextResponse.json({ error: "Missing opportunityId." }, { status: 400 });
  }

  if (attended && rating === null) {
    return NextResponse.json({ error: "Pick how useful it was." }, { status: 400 });
  }

  const { error } = await supabase
    .from("saved_opportunities")
    .update({
      attended,
      rating: attended ? rating : null,
      reflection: attended && reflection ? reflection : null,
      reflected_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("opportunity_id", opportunityId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Only an attended event changes what we know about them. Saying "no" just
  // stops the prompt, so there is nothing new to re-embed.
  let rerank = false;
  if (attended) rerank = await refreshProfileEmbedding(supabase, user.id);

  return NextResponse.json({ ok: true, rerank });
}
