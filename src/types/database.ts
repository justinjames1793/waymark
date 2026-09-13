export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  major: string | null;
  year: string | null;
  interests: string[] | null;
  career_goals: string | null;
  resume: string | null;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

/** A saved (favourited) opportunity, plus the reflection once the event passes. */
export interface SavedOpportunity {
  user_id: string;
  opportunity_id: string;
  created_at: string;
  attended: boolean | null;
  rating: number | null;
  reflection: string | null;
  reflected_at: string | null;
}

/** A saved row joined to the opportunity it points at. */
export interface SavedWithOpportunity extends SavedOpportunity {
  opportunities: Opportunity;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  org_type: string | null;
  category: string | null;
  description: string | null;
  location: string | null;
  starts_at: string | null;
  is_recurring: boolean;
  url: string | null;
  tags: string[] | null;
  created_at: string;
}

/** An opportunity returned by match_opportunities(), carrying its score. */
export interface MatchedOpportunity extends Opportunity {
  similarity: number;
}
