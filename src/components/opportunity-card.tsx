"use client";

import { CalendarDays, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SaveButton } from "@/components/save-button";
import { cn, formatEventTime, formatMatch } from "@/lib/utils";
import { categoryLabel, orgTypeLabel } from "@/lib/constants";
import type { Opportunity } from "@/types/database";

interface Props {
  opportunity: Opportunity & { similarity?: number };
  /** The Groq "why this matched" line. Absent whenever Groq is unavailable. */
  explanation?: string;
  showMatch?: boolean;
  saved?: boolean;
  onSavedChange?: (id: string, saved: boolean) => void;
}

export function OpportunityCard({
  opportunity: o,
  explanation,
  showMatch,
  saved = false,
  onSavedChange,
}: Props) {
  return (
    <article className="rounded-xl border border-border p-5 transition-colors hover:border-foreground/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{orgTypeLabel(o.org_type)}</Badge>
            <Badge variant="outline">{categoryLabel(o.category)}</Badge>
            {o.is_recurring && <Badge variant="outline">Recurring</Badge>}
          </div>

          <h3 className="mt-3 font-semibold leading-snug tracking-tight">
            {o.url ? (
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-1.5 hover:underline"
              >
                {o.title}
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </a>
            ) : (
              o.title
            )}
          </h3>

          <p className="mt-0.5 text-sm text-muted-foreground">{o.organization}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {showMatch && typeof o.similarity === "number" && (
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              {formatMatch(o.similarity)}
            </span>
          )}
          <SaveButton
            opportunityId={o.id}
            initialSaved={saved}
            onChange={(next) => onSavedChange?.(o.id, next)}
          />
        </div>
      </div>

      {o.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {o.description}
        </p>
      )}

      {explanation && (
        <p className="mt-3 flex gap-2 rounded-lg bg-secondary px-3 py-2 text-sm leading-relaxed">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          <span>{explanation}</span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatEventTime(o.starts_at, o.is_recurring)}
        </span>
        {o.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {o.location}
          </span>
        )}
      </div>
    </article>
  );
}
