# Waymark

Waymark helps college students find their next career-growth opportunity —
club events, speaker talks, research openings, networking, and programs across
every department — in one ranked feed. Starting at UC San Diego.

## The problem

Career-growth opportunities on a campus this size are real but invisible. They
are scattered across hundreds of clubs, departments, labs and centers, each with
its own newsletter, Discord and flyer wall. There is no front door. Students
mostly find out about the thing that would have changed their direction after it
happened, or never — and the ones who do find it are usually already inside the
department running it.

Waymark is the front door: one feed, ranked against where a student is trying to
go rather than by date.

## What's built

**Onboarding** — major, year, interest pills, free-text career goals, and an
optional resume. This is turned into a 384-dimension vector at write time and
stored on the profile.

**For you** — the ranked feed. A Postgres function does a pgvector search
against the student's stored vector and returns opportunities by similarity, with
a % match badge. Groq writes a one-line "why this matched you specifically" on
the top cards, fetched after the page paints.

**Explore** — the whole catalogue by date, deliberately *not* filtered by stated
interests. The premise of the product is surfacing things you had no reason to
look for, and a feed that only ever reflects what you already said can't do that.

**Tabs, filters, search** — Clubs / Professional / University / Research, nine
category filters (networking, career fair, workshop, info session, speaker,
research, competition, program, volunteer), and text search across titles,
organizations, descriptions and tags.

**Saved and Calendar** — bookmark anything; see it as a list or on a month grid.

**The reflection loop** — this is the part that compounds. When a saved event's
date passes, Waymark asks whether the student went, how useful it was, and what
they took away. Answering recomputes their profile vector, so the feed learns
from what they *actually attended and valued*, not just what they typed at
signup. In testing, one attended robotics event moved every robotics event up
the ranking — the largest by 31 places.

The attended events accumulate into an experience log on the profile, which is
both a record for the student and a growing input to matching.

## Stack

Next.js 14 (App Router) + TypeScript · Supabase (Postgres, Auth, RLS, pgvector) ·
Hugging Face `all-MiniLM-L6-v2` embeddings · Groq for match explanations ·
Tailwind. Deployed on Vercel.

## Getting started

**1. Install**

```bash
npm install
```

**2. Environment**

```bash
cp .env.example .env.local
```

Fill in from your Supabase dashboard (Project Settings → Data API for the URL,
API Keys for the publishable and secret keys), plus free keys from
[console.groq.com](https://console.groq.com) and
[huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
(fine-grained, with "Make calls to Inference Providers").

**3. Database**

Paste `supabase/schema.sql` into the Supabase SQL Editor and run it. It creates
the tables, enables Row Level Security on all of them, and defines the vector
search functions.

Then: Authentication → Sign In / Providers → Email → turn **Confirm email OFF**
for local development. Free-tier email is rate-limited to a handful per hour,
which makes testing signup painful. Turn it back on before real students use it.

**4. Check everything before you run it**

```bash
npm run doctor
```

Verifies env vars, database connectivity, that RLS is on for every table, and
that the Groq and Hugging Face keys actually work — each with the fix printed
next to the failure.

**5. Run**

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)

## Seed data

`npm run seed` loads 56 opportunities. The organizations, programs, centers and
URLs are real UC San Diego ones — the Jacobs School student orgs, the Career
Center, the Undergraduate Research Hub, FMP, SPURS, HDSI, Scripps, The Basement
and the Office of Innovation and Commercialization. Only the Fall 2026 Career
Fair slot comes from a published listing; the rest carry plausible fall-quarter
dates so the feed has something upcoming.

Treat it as realistic demo data, not a live scrape. Real ingest replaces it
before students use this.

## Walking through it

Roughly the order that shows the most in the least time:

1. **Signed out landing page** — the pitch.
2. **Sign up → onboarding.** Fill in a real profile; the interest pills and the
   free-text goals are what the matching runs on.
3. **For you.** Point at the % match badges and the Groq explanation lines —
   this is the recommendation engine, not a date-sorted list.
4. **Filters and search.** Switch to Clubs, filter to Networking, search a topic.
5. **Explore.** The deliberate escape hatch out of your own recommendations.
6. **Save something**, then show it on Saved and on the Calendar.
7. **The reflection loop.** For a saved event whose date has passed: answer
   "did you go?", rate it, write a takeaway — then go back to For you and show
   the ranking has moved. This is the part that is hard to copy.

Nothing seeded is in the past before late September 2026, so the reflection
prompt won't fire until then. Backdate an opportunity's `starts_at` to demo it
earlier.

## Security notes

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ships to the browser by design. It is
  safe **only** because Row Level Security is enabled on every table.
- `SUPABASE_SECRET_KEY` bypasses RLS. Server-side only. Never prefix it with
  `NEXT_PUBLIC_`.
- `.env.local` is gitignored. Keep it that way.
