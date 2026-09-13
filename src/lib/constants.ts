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
 * Keyword → interest hints, used to surface likely interests once a student
 * types their major.
 *
 * These only reorder and highlight; they never select anything and never hide
 * an option. The product exists to get students out of their own department, so
 * narrowing the list by major would work directly against the point — and
 * silently pre-selecting would put answers in their profile they never gave.
 *
 * Matches accumulate, so a compound major like "Bioinformatics" or
 * "Math-Computer Science" collects hints from every keyword it contains.
 */
const MAJOR_HINTS: [string, string[]][] = [
  ["data scien", ["Data science & AI", "Research", "Software engineering"]],
  ["informatics", ["Data science & AI", "Software engineering"]],
  ["statistic", ["Data science & AI", "Research", "Finance"]],
  ["computation", ["Data science & AI", "Software engineering", "Research"]],
  ["computer", ["Software engineering", "Data science & AI", "Startups & entrepreneurship"]],
  ["software", ["Software engineering", "Startups & entrepreneurship"]],
  ["math", ["Data science & AI", "Research", "Finance"]],
  ["cognitive", ["Research", "Data science & AI", "Healthcare & medicine"]],
  ["neuro", ["Research", "Healthcare & medicine", "Biotech & life sciences"]],
  ["psych", ["Research", "Healthcare & medicine", "Nonprofit & social impact"]],
  // Ahead of the generic "bio" entry on purpose: matches accumulate in array
  // order, and Marine Biology should lead with climate work, not healthcare.
  ["marine", ["Sustainability & climate", "Research", "Biotech & life sciences"]],
  ["ocean", ["Sustainability & climate", "Research"]],
  ["ecolog", ["Sustainability & climate", "Research"]],
  ["environment", ["Sustainability & climate", "Research", "Public policy & government"]],
  ["climate", ["Sustainability & climate", "Research"]],
  ["earth", ["Sustainability & climate", "Research"]],
  ["bioeng", ["Biotech & life sciences", "Healthcare & medicine", "Research"]],
  ["biomedical", ["Biotech & life sciences", "Healthcare & medicine", "Research"]],
  ["bio", ["Biotech & life sciences", "Research", "Healthcare & medicine"]],
  ["chem", ["Biotech & life sciences", "Research"]],
  ["physic", ["Research", "Data science & AI"]],
  ["astronom", ["Research", "Data science & AI"]],
  ["public health", ["Healthcare & medicine", "Nonprofit & social impact"]],
  ["nursing", ["Healthcare & medicine", "Research"]],
  ["pharm", ["Healthcare & medicine", "Biotech & life sciences"]],
  ["medicine", ["Healthcare & medicine", "Research"]],
  ["econ", ["Finance", "Consulting", "Data science & AI"]],
  ["business", ["Consulting", "Finance", "Startups & entrepreneurship"]],
  ["management", ["Consulting", "Startups & entrepreneurship", "Finance"]],
  ["accounting", ["Finance", "Consulting"]],
  ["marketing", ["Product & design", "Startups & entrepreneurship", "Arts & media"]],
  ["political", ["Public policy & government", "Law", "Nonprofit & social impact"]],
  ["policy", ["Public policy & government", "Nonprofit & social impact"]],
  ["international", ["Public policy & government", "Nonprofit & social impact"]],
  ["law", ["Law", "Public policy & government"]],
  ["sociolog", ["Nonprofit & social impact", "Public policy & government", "Research"]],
  ["anthropolog", ["Research", "Nonprofit & social impact"]],
  ["ethnic", ["Nonprofit & social impact", "Public policy & government"]],
  ["engineering", ["Research", "Software engineering", "Startups & entrepreneurship"]],
  ["mechanical", ["Research", "Startups & entrepreneurship"]],
  ["aerospace", ["Research", "Startups & entrepreneurship"]],
  ["electrical", ["Software engineering", "Research"]],
  ["civil", ["Sustainability & climate", "Research"]],
  ["design", ["Product & design", "Arts & media"]],
  ["visual art", ["Arts & media", "Product & design"]],
  ["music", ["Arts & media"]],
  ["theat", ["Arts & media"]],
  ["literature", ["Arts & media", "Education"]],
  ["writing", ["Arts & media", "Education"]],
  ["film", ["Arts & media", "Product & design"]],
  ["media", ["Arts & media", "Product & design"]],
  ["communication", ["Arts & media", "Product & design", "Public policy & government"]],
  ["linguistic", ["Research", "Data science & AI", "Education"]],
  ["educat", ["Education", "Nonprofit & social impact"]],
  ["history", ["Research", "Education", "Law"]],
  ["philosoph", ["Research", "Law", "Education"]],
  ["urban", ["Sustainability & climate", "Public policy & government"]],
  ["architect", ["Product & design", "Sustainability & climate"]],
];

const MAX_SUGGESTIONS = 4;

/** Interests worth highlighting for a typed major. Empty when nothing matches. */
export function suggestedInterests(major: string): string[] {
  const q = major.trim().toLowerCase();
  if (q.length < 3) return [];

  const out: string[] = [];
  for (const [keyword, hints] of MAJOR_HINTS) {
    if (!q.includes(keyword)) continue;
    for (const hint of hints) {
      if (!out.includes(hint)) out.push(hint);
    }
  }

  return out.slice(0, MAX_SUGGESTIONS);
}

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
