/**
 * npm run seed — load opportunities and their embeddings.
 *
 * Embeddings are computed HERE, at write time, and stored on the row. Nothing
 * on the render path ever calls the embedding API. See CLAUDE.md.
 *
 * Uses the SECRET key, which bypasses RLS — legitimate because opportunities
 * are public catalog data with no insert policy for browser clients by design.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { SEED_OPPORTUNITIES, type SeedOpportunity } from "./seed-data";
import { embedMany } from "../src/lib/embeddings";

config({ path: ".env.local" });

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const BATCH_SIZE = 16;

/** What an opportunity "means" for matching. Mirrors the profile side. */
function embeddingText(o: SeedOpportunity): string {
  return [
    o.title,
    `Hosted by ${o.organization}`,
    o.category,
    o.description,
    o.tags.join(", "),
  ].join("\n");
}

async function main() {
  console.log(`\n${BOLD}Seeding opportunities${RESET}\n`);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secret) {
    console.error(`${RED}Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.${RESET}`);
    console.error(`${DIM}Run: npm run doctor${RESET}\n`);
    process.exit(1);
  }

  const admin = createClient(url, secret, { auth: { persistSession: false } });

  console.log(`  ${DIM}${SEED_OPPORTUNITIES.length} opportunities to embed${RESET}`);

  const vectors: number[][] = [];
  for (let i = 0; i < SEED_OPPORTUNITIES.length; i += BATCH_SIZE) {
    const batch = SEED_OPPORTUNITIES.slice(i, i + BATCH_SIZE);
    const embedded = await embedMany(batch.map(embeddingText));
    vectors.push(...embedded);
    console.log(`  ${DIM}embedded ${vectors.length}/${SEED_OPPORTUNITIES.length}${RESET}`);
  }

  // Replace rather than append, so re-running seed doesn't duplicate the feed.
  const { error: clearError } = await admin
    .from("opportunities")
    .delete()
    .not("id", "is", null);
  if (clearError) {
    console.error(`\n${RED}Could not clear existing opportunities:${RESET}`, clearError.message);
    process.exit(1);
  }

  const rows = SEED_OPPORTUNITIES.map((o, i) => ({
    title: o.title,
    organization: o.organization,
    org_type: o.org_type,
    category: o.category,
    description: o.description,
    location: o.location,
    starts_at: o.starts_at,
    is_recurring: o.is_recurring ?? false,
    url: o.url,
    tags: o.tags,
    embedding: JSON.stringify(vectors[i]),
  }));

  const { error: insertError } = await admin.from("opportunities").insert(rows);
  if (insertError) {
    console.error(`\n${RED}Insert failed:${RESET}`, insertError.message);
    process.exit(1);
  }

  const { count } = await admin
    .from("opportunities")
    .select("id", { head: true, count: "exact" })
    .not("embedding", "is", null);

  console.log(`\n${GREEN}${BOLD}Seeded ${rows.length} opportunities${RESET}, ${count} with embeddings.\n`);
}

main().catch((err) => {
  console.error(`\n${RED}seed crashed:${RESET}`, err);
  process.exit(1);
});
