import type { SupabaseClient } from "@supabase/supabase-js";
import type { SavedWithOpportunity } from "@/types/database";

/** Every opportunity the student has favourited, joined to the event itself. */
export async function fetchSaved(
  supabase: SupabaseClient,
  userId: string
): Promise<SavedWithOpportunity[]> {
  const { data } = await supabase
    .from("saved_opportunities")
    .select("*, opportunities(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return ((data ?? []) as SavedWithOpportunity[]).filter((r) => r.opportunities);
}

export interface SavedSplit {
  /** Still to come, or undated/recurring. */
  upcoming: SavedWithOpportunity[];
  /** Passed, never answered — these are what the app prompts about. */
  pending: SavedWithOpportunity[];
  /** Answered, whether or not they went. */
  answered: SavedWithOpportunity[];
}

/**
 * A recurring or undated opportunity never "passes", so it never generates a
 * prompt — asking "did you go?" about a standing office hour would be noise.
 */
export function splitSaved(rows: SavedWithOpportunity[], now = new Date()): SavedSplit {
  const upcoming: SavedWithOpportunity[] = [];
  const pending: SavedWithOpportunity[] = [];
  const answered: SavedWithOpportunity[] = [];

  for (const row of rows) {
    // Explicitly boolean, not just "not null": before the reflection migration
    // runs the column is absent and reads as undefined, and `!== null` would
    // file every saved event as already answered.
    if (row.attended === true || row.attended === false) {
      answered.push(row);
      continue;
    }

    const startsAt = row.opportunities.starts_at;
    const hasPassed =
      Boolean(startsAt) &&
      !row.opportunities.is_recurring &&
      new Date(startsAt as string).getTime() < now.getTime();

    if (hasPassed) pending.push(row);
    else upcoming.push(row);
  }

  const byDate = (a: SavedWithOpportunity, b: SavedWithOpportunity) => {
    const at = a.opportunities.starts_at;
    const bt = b.opportunities.starts_at;
    if (!at) return 1;
    if (!bt) return -1;
    return new Date(at).getTime() - new Date(bt).getTime();
  };

  upcoming.sort(byDate);
  pending.sort(byDate);

  return { upcoming, pending, answered };
}
