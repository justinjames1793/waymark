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
