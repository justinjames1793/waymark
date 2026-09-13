"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { YEARS, INTERESTS } from "@/lib/constants";

export interface InitialProfile {
  full_name: string | null;
  major: string | null;
  year: string | null;
  interests: string[] | null;
  career_goals: string | null;
  resume?: string | null;
}

/**
 * Shared by /onboarding and /profile. Both write through the same route, which
 * recomputes the profile embedding — so editing your goals actually re-ranks
 * the feed instead of silently leaving the old vector in place.
 */
export function ProfileForm({
  initial,
  mode,
}: {
  initial: InitialProfile | null;
  mode: "onboarding" | "edit";
}) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [major, setMajor] = useState(initial?.major ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [interests, setInterests] = useState<string[]>(initial?.interests ?? []);
  const [careerGoals, setCareerGoals] = useState(initial?.career_goals ?? "");
  const [resume, setResume] = useState(initial?.resume ?? "");
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
        body: JSON.stringify({ fullName, major, year, interests, careerGoals, resume }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");

      if (!body.matchingReady) {
        toast.warning("Saved. Recommendations will sharpen once matching catches up.");
      } else if (mode === "edit") {
        toast.success("Profile updated — your feed has been re-ranked.");
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
    <form onSubmit={handleSubmit} className="space-y-6">
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
              aria-pressed={year === y}
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
                aria-pressed={selected}
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

      <div>
        <Label htmlFor="resume">
          Resume <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <p className="-mt-1 mb-1.5 text-xs text-muted-foreground">
          Paste it as text — experience, projects, skills. It sharpens matching,
          and it grows as you log events you attend.
        </p>
        <Textarea
          id="resume"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Experience, projects, coursework, skills…"
          className="min-h-[140px]"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "onboarding" ? "Find my feed" : "Save changes"}
      </Button>
    </form>
  );
}
