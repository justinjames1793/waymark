/**
 * Shared between the onboarding form (client) and its API route (server),
 * which validates submitted year/interests against these same lists — so the
 * allowed values live in exactly one place.
 */

export const YEARS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "5th+ year",
  "Grad student",
] as const;

export const INTERESTS = [
  "Research",
  "Startups & entrepreneurship",
  "Data science & AI",
  "Software engineering",
  "Consulting",
  "Finance",
  "Product & design",
  "Public policy & government",
  "Healthcare & medicine",
  "Nonprofit & social impact",
  "Sustainability & climate",
  "Arts & media",
  "Law",
  "Education",
  "Biotech & life sciences",
  "Still exploring",
] as const;

/**
 * The Groq model used for match explanations. Lives here so `npm run doctor`
 * checks the same string the app calls — a model that has been retired 404s as
 * model_not_found, which reads exactly like a bad API key.
 */
export const GROQ_MODEL = "openai/gpt-oss-120b";

/** Feed tabs. Values match `opportunities.org_type` exactly. */
export const ORG_TYPES = [
  { value: "club", label: "Clubs" },
  { value: "professional", label: "Professional" },
  { value: "university", label: "University" },
  { value: "research", label: "Research" },
] as const;

/** Filter chips. Values match `opportunities.category` exactly. */
export const CATEGORIES = [
  { value: "networking", label: "Networking" },
  { value: "workshop", label: "Workshop" },
  { value: "info-session", label: "Info session" },
  { value: "career-fair", label: "Career fair" },
  { value: "speaker", label: "Speaker" },
  { value: "research", label: "Research" },
  { value: "competition", label: "Competition" },
  { value: "program", label: "Program" },
  { value: "volunteer", label: "Volunteer" },
] as const;

export function orgTypeLabel(value: string | null): string {
  return ORG_TYPES.find((t) => t.value === value)?.label ?? "Campus";
}

export function categoryLabel(value: string | null): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? (value ?? "Event");
}
