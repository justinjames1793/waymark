"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/types/database";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Local-time day key, so an event never lands on the wrong square. */
function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function CalendarView({ events }: { events: Opportunity[] }) {
  const dated = useMemo(
    () => events.filter((e) => e.starts_at && !e.is_recurring),
    [events]
  );

  const [cursor, setCursor] = useState(() => {
    // Open on the month holding the next saved event, not necessarily today —
    // an empty grid is a worse first impression than a slightly future month.
    const upcoming = dated
      .map((e) => new Date(e.starts_at as string))
      .filter((d) => d.getTime() >= Date.now())
      .sort((a, b) => a.getTime() - b.getTime())[0];
    const base = upcoming ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const [selected, setSelected] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, Opportunity[]>();
    for (const e of dated) {
      const key = dayKey(new Date(e.starts_at as string));
      const list = map.get(key);
      if (list) list.push(e);
      else map.set(key, [e]);
    }
    return map;
  }, [dated]);

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const leading = first.getDay();

    const out: (Date | null)[] = Array.from({ length: leading }, () => null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      out.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [cursor]);

  const undated = events.filter((e) => !e.starts_at || e.is_recurring);
  const todayKey = dayKey(new Date());
  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">
          {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={() => {
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
              setSelected(null);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={() => {
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
              setSelected(null);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="bg-background px-1 py-2 text-center text-[11px] font-medium text-muted-foreground"
          >
            {d.slice(0, 1)}
            <span className="hidden sm:inline">{d.slice(1)}</span>
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) return <div key={i} className="min-h-[64px] bg-secondary/40 sm:min-h-[88px]" />;

          const key = dayKey(date);
          const dayEvents = byDay.get(key) ?? [];
          const isToday = key === todayKey;
          const isSelected = key === selected;

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(dayEvents.length ? key : null)}
              className={cn(
                "min-h-[64px] bg-background p-1.5 text-left align-top transition-colors sm:min-h-[88px]",
                dayEvents.length ? "hover:bg-secondary" : "cursor-default",
                isSelected && "bg-secondary"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  isToday ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {date.getDate()}
              </span>

              {dayEvents.length > 0 && (
                <>
                  <div className="mt-1 hidden space-y-0.5 sm:block">
                    {dayEvents.slice(0, 2).map((e) => (
                      <p
                        key={e.id}
                        className="truncate rounded bg-accent/15 px-1 py-0.5 text-[10px] font-medium leading-tight"
                      >
                        {e.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="px-1 text-[10px] text-muted-foreground">
                        +{dayEvents.length - 2} more
                      </p>
                    )}
                  </div>
                  <div className="mt-1 flex gap-0.5 sm:hidden">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span key={e.id} className="h-1.5 w-1.5 rounded-full bg-accent" />
                    ))}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {selectedEvents.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold">
            {new Date(selectedEvents[0].starts_at as string).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="mt-2 space-y-2">
            {selectedEvents.map((e) => (
              <DayEvent key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}

      {undated.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold">Recurring and undated</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved things without a single date — standing office hours, open applications.
          </p>
          <div className="mt-2 space-y-2">
            {undated.map((e) => (
              <DayEvent key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DayEvent({ event }: { event: Opportunity }) {
  const time = event.starts_at
    ? new Date(event.starts_at).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : event.is_recurring
      ? "Recurring"
      : "Date TBA";

  return (
    <a
      href={event.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 rounded-lg border border-border p-3 transition-colors hover:border-foreground/20"
    >
      <span className="w-20 shrink-0 text-xs font-medium text-muted-foreground">{time}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-snug">{event.title}</span>
        <span className="block text-xs text-muted-foreground">{event.organization}</span>
      </span>
    </a>
  );
}
