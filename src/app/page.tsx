import Link from "next/link";
import { Compass, Layers, Sparkles } from "lucide-react";
import { WaymarkLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Layers,
    title: "Everything, in one place",
    body: "Club events, speaker talks, info sessions, research openings, fellowships and programs — pulled out of the departments that keep them siloed.",
  },
  {
    icon: Sparkles,
    title: "Ranked for you, not by date",
    body: "Tell Waymark your major, your interests, and where you want to end up. It puts the things that actually fit at the top.",
  },
  {
    icon: Compass,
    title: "Past your own department",
    body: "The opportunity that changes your direction is usually somewhere you had no reason to look. That's exactly what a ranked feed is good at surfacing.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <WaymarkLockup />
        <div className="flex items-center gap-1.5">
          <Link href="/auth">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/auth?mode=signup" className="hidden sm:block">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="bg-grid relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
        <div className="mx-auto max-w-3xl px-5 pb-24 pt-24 text-center sm:pt-28">
          <p className="mb-5 inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Starting at UC San Diego
          </p>

          <h1 className="text-[2.6rem] font-bold leading-[1.08] tracking-tight sm:text-6xl">
            Find your next step
            <br />
            on campus.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The opportunities that grow your career are already happening around
            you, scattered across hundreds of clubs, departments and centers.
            Waymark brings them into one feed, ranked against your goals.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth?mode=signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Get started
              </Button>
            </Link>
            <Link href="/auth" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                I have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {features.map((feature) => (
            <div key={feature.title}>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <feature.icon className="h-[18px] w-[18px]" />
              </div>
              <h2 className="font-semibold tracking-tight">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <WaymarkLockup className="text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Built at UC San Diego.
          </p>
        </div>
      </footer>
    </main>
  );
}
