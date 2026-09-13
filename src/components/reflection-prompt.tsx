"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatEventTime } from "@/lib/utils";
import type { Opportunity } from "@/types/database";

const RATINGS = [
  { value: 3, label: "Very useful" },
  { value: 2, label: "Somewhat" },
  { value: 1, label: "Not really" },
];

/**
 * Shown for a saved event whose start time has passed and that hasn't been
 * answered yet. Answering "yes" is what teaches the recommender — the route
 * behind this recomputes the profile embedding from what was actually attended.
 */
export function ReflectionPrompt({ opportunity }: { opportunity: Opportunity }) {
  const router = useRouter();

  const [attended, setAttended] = useState<boolean | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(didAttend: boolean, withRating: number | null) {
    setLoading(true);
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          attended: didAttend,
          rating: withRating,
          reflection,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");

      toast.success(
        body.rerank
          ? "Thanks — your feed has been updated to reflect that."
          : "Thanks, noted."
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-accent/40 bg-accent/[0.06] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        You saved this
      </p>
      <h3 className="mt-1.5 font-semibold leading-snug tracking-tight">
        {opportunity.title}
      </h3>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {opportunity.organization} · {formatEventTime(opportunity.starts_at, false)}
      </p>

      {attended === null ? (
        <>
          <p className="mt-4 text-sm">Did you end up going?</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={() => setAttended(true)} disabled={loading}>
              Yes, I went
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => submit(false, null)}
              disabled={loading}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              No
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm">How useful was it for where you&rsquo;re heading?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRating(r.value)}
                aria-pressed={rating === r.value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  rating === r.value
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-secondary"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor={`reflection-${opportunity.id}`} className="text-sm">
              What did you take away from it?{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id={`reflection-${opportunity.id}`}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="A contact you made, something that changed your mind, a skill you picked up…"
              className="mt-1.5 min-h-[72px]"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => submit(true, rating)}
              disabled={loading || rating === null}
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save to my profile
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAttended(null)}
              disabled={loading}
            >
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
