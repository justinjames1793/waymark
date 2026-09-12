import { cn } from "@/lib/utils";

/**
 * The Waymark mark: a W whose final stroke turns back on itself into an arrow —
 * a trail blaze.
 *
 * Path data is copied verbatim from brand/mark-ink.svg, with the hard-coded
 * #141A2E swapped for currentColor so one component serves both the ink and
 * white lockups. If the brand file changes, re-copy the paths rather than
 * hand-editing them here.
 */
export function WaymarkMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 500"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      <path
        d="M 496 152 L 322 428 L 276 158 L 158 404 L 92 160 C 60 86, 150 68, 214 92"
        fill="none"
        stroke="currentColor"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 253.3 106.7 L 189.4 123.4 L 216.1 52.2 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WaymarkLockup({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <WaymarkMark className={cn("h-[26px] w-[26px]", markClassName)} />
      <span className="text-[17px] font-bold tracking-tight">waymark</span>
    </span>
  );
}
