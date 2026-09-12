"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { WaymarkLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { YEARS, INTERESTS } from "@/lib/constants";

interface InitialProfile {
  full_name: string | null;
  major: string | null;
  year: string | null;
  interests: string[] | null;
  career_goals: string | null;
}

export default function OnboardingForm({ initial }: { initial: InitialProfile | null }) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [major, setMajor] = useState(initial?.major ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [careerGoals, setCareerGoals] = useState(initial?.career_goals ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !major.trim() || !year || interests.length === 0 || !careerGoals.trim()) {
      setError("Fill in every field, and pick at least one interest.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, major, year, interests, careerGoals }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");

      if (!body.matchingReady) {
        toast.warning("Saved. Recommendations will sharpen once matching catches up.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-12">
      <div className="mx-auto max-w-xl">
        <WaymarkLockup />

        <h1 className="mt-8 text-2xl font-bold tracking-tight">Tell us about you.</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This is what the recommendation engine matches against — the more
          specific, the better the feed.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="fullName">Name</Label>
            <Input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="Data Science"
            />
          </div>

          <div>
            <Label>Year</Label>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    year === y
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-secondary"
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Interests</Label>
            <p className="-mt-1 mb-1.5 text-xs text-muted-foreground">
              Pick as many as apply — this drives the feed more than anything else.
            </p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      selected
                        ? "border-transparent bg-accent/15 text-accent-foreground"
                        : "border-input bg-background hover:bg-secondary"
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="careerGoals">Career goals</Label>
            <Textarea
              id="careerGoals"
              required
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="What are you hoping to figure out or move toward? Be specific — 'break into product management' matches differently than 'not sure yet, exploring tech.'"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Find my feed
          </Button>
        </form>
      </div>
    </main>
  );
}
