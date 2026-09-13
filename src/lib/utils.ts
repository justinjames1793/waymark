import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Renders an event time the way a student would say it: "Tue, Mar 4 at 6:00 PM",
 * "Today at 5:00 PM", or "Recurring" for things with no single date.
 */
export function formatEventTime(
  startsAt: string | null,
  isRecurring = false
): string {
  if (!startsAt) return isRecurring ? "Recurring" : "Date TBA";

  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return "Date TBA";

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sameDay) return `Today at ${time}`;

  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return `${day} at ${time}`;
}

/**
 * pgvector cosine similarity comes back in a narrow band, not across 0–1, so
 * the raw number is useless to show: against the seeded catalog a student's
 * best match scores ~0.48 and the median ~0.28. Stretching 0.20–0.50 across
 * 0–100 makes a strong match read as one.
 *
 * Presentation only — ranking always uses the raw score. If the catalog or the
 * profile prompt changes shape, re-check the real distribution before trusting
 * these bounds.
 */
export function formatMatch(similarity: number): string {
  const stretched = (similarity - 0.2) / 0.3;
  const pct = Math.round(Math.min(Math.max(stretched, 0), 1) * 100);
  return `${pct}% match`;
}
