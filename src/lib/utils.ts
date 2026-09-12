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
 * pgvector cosine similarity comes back roughly in 0..1, but the useful range
 * for sentence embeddings is compressed near the top. Presenting the raw value
 * makes everything look like a 70% match, so we stretch the 0.3–0.9 band across
 * 0–100 and clamp. This is presentation only — ranking always uses the raw score.
 */
export function formatMatch(similarity: number): string {
  const stretched = (similarity - 0.3) / 0.6;
  const pct = Math.round(Math.min(Math.max(stretched, 0), 1) * 100);
  return `${pct}% match`;
}
