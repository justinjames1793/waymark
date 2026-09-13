"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { OpportunityCard } from "@/components/opportunity-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ORG_TYPES, CATEGORIES } from "@/lib/constants";
import type { Opportunity } from "@/types/database";

type FeedItem = Opportunity & { similarity?: number };

interface Props {
  opportunities: FeedItem[];
  /** Show the % match badge. Only meaningful for the ranked "For you" feed. */
  showMatch?: boolean;
  /** Ask Groq for "why this matched" lines on the top few cards. */
  explain?: boolean;
  emptyMessage: string;
}

const EXPLAIN_COUNT = 5;

export function Feed({ opportunities, showMatch, explain, emptyMessage }: Props) {
  const [orgType, setOrgType] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const topIds = useMemo(
    () => opportunities.slice(0, EXPLAIN_COUNT).map((o) => o.id),
    [opportunities]
  );

  useEffect(() => {
    if (!explain || topIds.length === 0) return;

    let cancelled = false;

    // Fired after paint, never awaited by the render. Groq is a garnish: if it
    // is missing, slow or rate-limited, the cards above simply never gain a
    // "why this matched" line and nothing else changes.
    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: topIds }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (!cancelled && body?.explanations) setExplanations(body.explanations);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [explain, topIds]);

  function toggleCategory(value: string) {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return opportunities.filter((o) => {
      if (orgType !== "all" && o.org_type !== orgType) return false;
      if (categories.length && !categories.includes(o.category ?? "")) return false;

      if (q) {
        const haystack = [
          o.title,
          o.organization,
          o.description ?? "",
          (o.tags ?? []).join(" "),
          o.location ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [opportunities, orgType, categories, query]);

  const filtersActive = orgType !== "all" || categories.length > 0 || query.trim() !== "";

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events, organizations, topics…"
          aria-label="Search opportunities"
          className="pl-9"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <FilterChip
          label="All"
          selected={orgType === "all"}
          onClick={() => setOrgType("all")}
        />
        {ORG_TYPES.map((t) => (
          <FilterChip
            key={t.value}
            label={t.label}
            selected={orgType === t.value}
            onClick={() => setOrgType(orgType === t.value ? "all" : t.value)}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.value}
            label={c.label}
            subtle
            selected={categories.includes(c.value)}
            onClick={() => toggleCategory(c.value)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {visible.length} {visible.length === 1 ? "opportunity" : "opportunities"}
        </p>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setOrgType("all");
              setCategories([]);
              setQuery("");
            }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">Nothing matches those filters</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {filtersActive
              ? "Try clearing a filter or searching for something broader."
              : emptyMessage}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {visible.map((o) => (
            <OpportunityCard
              key={o.id}
              opportunity={o}
              explanation={explanations[o.id]}
              showMatch={showMatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  selected,
  subtle,
  onClick,
}: {
  label: string;
  selected: boolean;
  subtle?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-3 py-1 font-medium transition-colors",
        subtle ? "text-xs" : "text-sm",
        selected
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-input bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
