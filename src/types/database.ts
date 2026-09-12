export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  major: string | null;
  year: string | null;
  interests: string[] | null;
  career_goals: string | null;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
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
