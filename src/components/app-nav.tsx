"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WaymarkLockup, WaymarkMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "For you" },
  { href: "/explore", label: "Explore" },
  { href: "/saved", label: "Saved" },
  { href: "/calendar", label: "Calendar" },
  { href: "/profile", label: "Profile" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[60px] max-w-5xl items-center gap-4 px-5">
        {/* Wordmark costs ~85px that five tabs need on a phone. The mark alone
            still reads as the logo and still goes home. */}
        <Link href="/dashboard" className="shrink-0" aria-label="Waymark home">
          <WaymarkMark className="h-[26px] w-[26px] sm:hidden" />
          <WaymarkLockup className="hidden sm:inline-flex" />
        </Link>

        {/* Five tabs do not fit a phone. Scroll them rather than wrapping the
            header to two rows or hiding destinations behind a menu. */}
        <nav className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <form action="/auth/signout" method="post" className="hidden sm:block">
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
