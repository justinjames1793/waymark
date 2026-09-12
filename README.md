# Waymark

Waymark helps college students find their next career-growth opportunity —
club events, speaker talks, research openings, networking, and programs across
every department — in one ranked feed. Starting at UC San Diego.

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

## Security notes

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ships to the browser by design. It is
  safe **only** because Row Level Security is enabled on every table.
- `SUPABASE_SECRET_KEY` bypasses RLS. Server-side only. Never prefix it with
  `NEXT_PUBLIC_`.
- `.env.local` is gitignored. Keep it that way.
