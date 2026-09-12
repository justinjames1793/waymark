-- Waymark schema.
-- Paste the whole file into the Supabase SQL Editor and run it. Safe to re-run.
--
-- Two rules this file exists to enforce:
--   1. Row Level Security is enabled explicitly on every table, so nothing
--      depends on a checkbox someone did or did not tick in the dashboard.
--   2. Embeddings are stored, never computed at read time.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text,
  full_name           text,
  major               text,
  year                text,
  interests           text[],
  career_goals        text,

  -- Computed once when the student finishes or edits onboarding, never on page
  -- render. all-MiniLM-L6-v2 is 384-dimensional.
  embedding           vector(384),

  onboarding_complete boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- No delete policy: students cannot delete their profile row directly. Account
-- deletion goes through auth.users, and the cascade above cleans this up.

-- Create the profile row the moment the account exists, so onboarding always
-- has a row to update. Without this, a student can land on onboarding with no
-- row, the update matches zero rows, "succeeds", and they bounce forever.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- opportunities
-- ---------------------------------------------------------------------------

create table if not exists public.opportunities (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  organization  text not null,
  org_type      text,             -- club | department | center | program
  category      text,             -- speaker | workshop | networking | ...
  description   text,
  location      text,
  starts_at     timestamptz,
  is_recurring  boolean not null default false,
  url           text,
  tags          text[],
  embedding     vector(384),
  created_at    timestamptz not null default now()
);

alter table public.opportunities enable row level security;

drop policy if exists "opportunities: readable by signed-in students" on public.opportunities;
create policy "opportunities: readable by signed-in students"
  on public.opportunities for select
  to authenticated
  using (true);

-- Deliberately no insert/update/delete policy. Seeding and ingest run with the
-- SECRET key, which bypasses RLS. That means no browser client can ever write
-- to this table, which is what we want.

create index if not exists opportunities_starts_at_idx
  on public.opportunities (starts_at);

create index if not exists opportunities_embedding_idx
  on public.opportunities using hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------------------------
-- saved_opportunities
-- ---------------------------------------------------------------------------

create table if not exists public.saved_opportunities (
  user_id        uuid not null references auth.users(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

alter table public.saved_opportunities enable row level security;

drop policy if exists "saved: manage own" on public.saved_opportunities;
create policy "saved: manage own"
  on public.saved_opportunities for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Matching
-- ---------------------------------------------------------------------------

-- Generic vector search. Note it never returns the embedding column.
create or replace function public.match_opportunities(
  query_embedding vector(384),
  match_count int default 12
)
returns table (
  id uuid,
  title text,
  organization text,
  org_type text,
  category text,
  description text,
  location text,
  starts_at timestamptz,
  is_recurring boolean,
  url text,
  tags text[],
  created_at timestamptz,
  similarity float
)
language sql
stable
as $$
  select
    o.id, o.title, o.organization, o.org_type, o.category, o.description,
    o.location, o.starts_at, o.is_recurring, o.url, o.tags, o.created_at,
    1 - (o.embedding <=> query_embedding) as similarity
  from public.opportunities o
  where o.embedding is not null
  order by o.embedding <=> query_embedding
  limit match_count;
$$;

-- The one the dashboard actually calls. Reads the caller's stored profile
-- embedding, so no vector ever travels to the browser and back, and there is
-- no embedding API call on the render path.
create or replace function public.match_for_me(match_count int default 12)
returns table (
  id uuid,
  title text,
  organization text,
  org_type text,
  category text,
  description text,
  location text,
  starts_at timestamptz,
  is_recurring boolean,
  url text,
  tags text[],
  created_at timestamptz,
  similarity float
)
language plpgsql
stable
security invoker
as $$
declare
  me vector(384);
begin
  select p.embedding into me
  from public.profiles p
  where p.id = auth.uid();

  if me is null then
    return;  -- no profile embedding yet; caller falls back to a plain list
  end if;

  return query select * from public.match_opportunities(me, match_count);
end;
$$;

-- ---------------------------------------------------------------------------
-- Diagnostics — used by `npm run doctor`
-- ---------------------------------------------------------------------------

-- Reports whether RLS is actually on for every table in public. doctor calls
-- this with the secret key and fails the run if anything comes back false.
create or replace function public.rls_status()
returns table (table_name text, rls_enabled boolean)
language sql
stable
security definer
set search_path = public
as $$
  select c.relname::text, c.relrowsecurity
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r'
  order by c.relname;
$$;

revoke all on function public.rls_status() from public, anon, authenticated;
