import type { SupabaseClient } from "@supabase/supabase-js";
import { embed, buildProfileEmbeddingText } from "@/lib/embeddings";

interface AttendedRow {
  rating: number | null;
  reflection: string | null;
  opportunities: { title: string; organization: string } | null;
}

/**
 * Recomputes the caller's profile vector from whatever is currently stored —
 * their answers, their resume, and every event they attended and rated.
 *
 * This is the one place a profile embedding is written, so onboarding, profile
 * edits and post-event reflections all converge on the same definition of what
 * a student "means". Always called at write time; never on a render path.
 *
 * Returns false when the embedding could not be computed. Callers should still
 * save the rest of the change: a stale vector degrades ranking, but a failed
 * save loses the student's answers.
 */
export async function refreshProfileEmbedding(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("major, year, interests, career_goals, resume")
    .eq("id", userId)
    .single();

  if (!profile?.major || !profile.year || !profile.career_goals) return false;

  const { data: attended } = await supabase
    .from("saved_opportunities")
    .select("rating, reflection, opportunities(title, organization)")
    .eq("user_id", userId)
    .eq("attended", true)
    .order("reflected_at", { ascending: false });

  // supabase-js infers an embedded resource as an array, but opportunity_id is
  // a plain FK, so PostgREST returns one object — verified against the live
  // API. The cast goes through unknown because the inferred type disagrees.
  const experiences = ((attended ?? []) as unknown as AttendedRow[])
    .filter((row) => row.opportunities)
    .map((row) => ({
      title: row.opportunities!.title,
      organization: row.opportunities!.organization,
      rating: row.rating,
      reflection: row.reflection,
    }));

  try {
    const vector = await embed(
      buildProfileEmbeddingText({
        major: profile.major,
        year: profile.year,
        interests: profile.interests ?? [],
        careerGoals: profile.career_goals,
        resume: profile.resume,
        experiences,
      })
    );

    const { error } = await supabase
      .from("profiles")
      .update({ embedding: vector, updated_at: new Date().toISOString() })
      .eq("id", userId);

    return !error;
  } catch (err) {
    console.error("Profile embedding refresh failed:", err);
    return false;
  }
}
