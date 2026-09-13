import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Favourite / unfavourite an opportunity.
 *
 * Writes go through the caller's own client, so RLS ("saved: manage own") is
 * what stops one student touching another's list — not anything checked here.
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
  const saved = Boolean(body.saved);

  if (!opportunityId) {
    return NextResponse.json({ error: "Missing opportunityId." }, { status: 400 });
  }

  if (saved) {
    const { error } = await supabase
      .from("saved_opportunities")
      .upsert(
        { user_id: user.id, opportunity_id: opportunityId },
        { onConflict: "user_id,opportunity_id" }
      );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("saved_opportunities")
      .delete()
      .eq("user_id", user.id)
      .eq("opportunity_id", opportunityId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved });
}
