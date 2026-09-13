"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Optimistic favourite toggle. Flips immediately and rolls back if the write
 * fails — a star that lags a round trip feels broken even when it works.
 */
export function SaveButton({
  opportunityId,
  initialSaved,
  onChange,
}: {
  opportunityId: string;
  initialSaved: boolean;
  onChange?: (saved: boolean) => void;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle() {
    const next = !saved;
    setSaved(next);
    setPending(true);
    onChange?.(next);

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId, saved: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setSaved(!next);
      onChange?.(!next);
      toast.error("Could not update your saved list.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save this opportunity"}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
        saved
          ? "text-accent hover:bg-secondary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}
