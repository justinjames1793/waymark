/**
 * npm run doctor — preflight check.
 *
 * Exists because the previous build failed in ways that looked like something
 * else: a missing token silently degraded matching, a mis-named variable read
 * as "key not set", RLS was never verified. Every check below prints the fix,
 * not just the failure.
 *
 * Run this before `npm run dev`, and any time something behaves strangely.
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { GROQ_MODEL } from "../src/lib/constants";

config({ path: ".env.local" });

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

type Status = "pass" | "fail" | "warn";
let failures = 0;
let warnings = 0;

function report(status: Status, label: string, detail?: string, fix?: string) {
  const icon =
    status === "pass"
      ? `${GREEN}✓${RESET}`
      : status === "warn"
        ? `${YELLOW}!${RESET}`
        : `${RED}✗${RESET}`;

  console.log(`  ${icon} ${label}${detail ? ` ${DIM}— ${detail}${RESET}` : ""}`);
  if (fix && status !== "pass") console.log(`      ${DIM}fix: ${fix}${RESET}`);

  if (status === "fail") failures++;
  if (status === "warn") warnings++;
}

function section(title: string) {
  console.log(`\n${BOLD}${title}${RESET}`);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.SUPABASE_SECRET_KEY;
const groq = process.env.GROQ_API_KEY;
const hf = process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACE_API_KEY;

async function checkEnv() {
  section("Environment");

  // The single most dangerous misconfiguration: a secret key behind a
  // NEXT_PUBLIC_ prefix is compiled into the browser bundle, and it bypasses
  // RLS. That is every student's data, public.
  const leaked = Object.keys(process.env).filter(
    (k) =>
      k.startsWith("NEXT_PUBLIC_") &&
      (process.env[k] ?? "").startsWith("sb_secret_")
  );
  if (leaked.length) {
    report(
      "fail",
      "No secret key exposed to the browser",
      `${leaked.join(", ")} holds a secret key`,
      "Rename to SUPABASE_SECRET_KEY (no NEXT_PUBLIC_ prefix) and rotate the key in Supabase — it has been in your client bundle."
    );
  } else {
    report("pass", "No secret key exposed to the browser");
  }

  if (!url) {
    report("fail", "NEXT_PUBLIC_SUPABASE_URL set", "missing", "Project Settings > Data API > Project URL");
  } else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)) {
    report(
      "fail",
      "NEXT_PUBLIC_SUPABASE_URL well-formed",
      url,
      "Must be the bare origin, e.g. https://abcdefgh.supabase.co — no /rest/v1, no trailing path."
    );
  } else {
    report("pass", "NEXT_PUBLIC_SUPABASE_URL set", url);
  }

  if (!publishable) {
    report("fail", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY set", "missing", "Project Settings > API Keys > publishable key");
  } else if (publishable.startsWith("sb_secret_")) {
    report("fail", "Publishable key is actually publishable", "a secret key is in the publishable slot", "Swap in the sb_publishable_... key and rotate the secret one.");
  } else if (!publishable.startsWith("sb_publishable_")) {
    report("warn", "Publishable key format", "not an sb_publishable_ key", "Legacy anon JWTs still work but are deprecated by Supabase at end of 2026.");
  } else {
    report("pass", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY set");
  }

  if (!secret) {
    report("fail", "SUPABASE_SECRET_KEY set", "missing", "Needed for seeding and embedding. Project Settings > API Keys > secret key.");
  } else if (!secret.startsWith("sb_secret_")) {
    report("warn", "Secret key format", "not an sb_secret_ key");
  } else {
    report("pass", "SUPABASE_SECRET_KEY set");
  }

  if (!hf) {
    report("warn", "HUGGINGFACE_API_TOKEN set", "missing", "Matching cannot be generated without it. huggingface.co/settings/tokens — fine-grained, 'Make calls to Inference Providers'.");
  } else {
    report("pass", "HUGGINGFACE_API_TOKEN set");
  }

  if (!groq) {
    report("warn", "GROQ_API_KEY set", "missing", "Match explanations will be skipped. The feed still works. console.groq.com");
  } else if (!groq.startsWith("gsk_")) {
    report("warn", "GROQ_API_KEY format", "does not start with gsk_", "Check you copied a Groq key, not an xAI Grok key — different companies.");
  } else {
    report("pass", "GROQ_API_KEY set");
  }
}

async function checkDatabase() {
  section("Database");

  if (!url || !publishable) {
    report("fail", "Supabase reachable", "skipped — missing URL or key");
    return;
  }

  const anon = createClient(url, publishable);

  // Does the project answer at all?
  try {
    const { error } = await anon.from("profiles").select("id", { head: true, count: "exact" });
    if (error && /Invalid API key|JWT/i.test(error.message)) {
      report("fail", "Publishable key accepted", error.message, "Re-copy the key from Project Settings > API Keys.");
      return;
    }
    if (error && /does not exist|schema cache/i.test(error.message)) {
      report("pass", "Supabase reachable");
      report("fail", "Table 'profiles' exists", error.message, "Run supabase/schema.sql in the Supabase SQL Editor.");
    } else if (error) {
      report("fail", "Supabase reachable", error.message);
      return;
    } else {
      report("pass", "Supabase reachable");
      report("pass", "Table 'profiles' exists");
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    report(
      "fail",
      "Supabase reachable",
      msg,
      "If this is a fetch/DNS error, the project may be paused — free-tier projects pause after ~7 days idle. Resume it in the dashboard."
    );
    return;
  }

  const { error: oppErr } = await anon
    .from("opportunities")
    .select("id", { head: true, count: "exact" });
  if (oppErr) {
    report("fail", "Table 'opportunities' exists", oppErr.message, "Run supabase/schema.sql.");
  } else {
    report("pass", "Table 'opportunities' exists");
  }

  if (!secret) {
    report("warn", "RLS verified on every table", "skipped — no secret key");
    return;
  }

  const admin = createClient(url, secret, { auth: { persistSession: false } });

  const { data: rls, error: rlsErr } = await admin.rpc("rls_status");
  if (rlsErr) {
    report("fail", "RLS verified on every table", rlsErr.message, "Run supabase/schema.sql — it defines the rls_status() helper this check uses.");
  } else {
    const rows = (rls ?? []) as { table_name: string; rls_enabled: boolean }[];
    const off = rows.filter((r) => !r.rls_enabled).map((r) => r.table_name);
    if (off.length) {
      report(
        "fail",
        "RLS enabled on every public table",
        `off for: ${off.join(", ")}`,
        `Run: alter table public.${off[0]} enable row level security;  — without this, the publishable key in your browser bundle can read the whole table.`
      );
    } else {
      report("pass", "RLS enabled on every public table", `${rows.length} table(s)`);
    }
  }

  const { error: fnErr } = await admin.rpc("match_opportunities", {
    query_embedding: new Array(384).fill(0),
    match_count: 1,
  });
  if (fnErr) {
    report("fail", "match_opportunities() exists", fnErr.message, "Run supabase/schema.sql. If it mentions 'type vector', the pgvector extension is missing.");
  } else {
    report("pass", "match_opportunities() exists");
  }

  const { count } = await admin
    .from("opportunities")
    .select("id", { head: true, count: "exact" });
  const { count: embedded } = await admin
    .from("opportunities")
    .select("id", { head: true, count: "exact" })
    .not("embedding", "is", null);

  if (!count) {
    report("warn", "Opportunities seeded", "0 rows", "Run: npm run seed");
  } else if (embedded !== count) {
    report("warn", "Opportunities embedded", `${embedded ?? 0}/${count} have vectors`, "Run the embed step so matching has something to rank.");
  } else {
    report("pass", "Opportunities seeded and embedded", `${count} rows`);
  }
}

async function checkServices() {
  section("External services");

  if (hf) {
    try {
      const res = await fetch("https://huggingface.co/api/whoami-v2", {
        headers: { Authorization: `Bearer ${hf}` },
      });
      if (res.ok) {
        report("pass", "Hugging Face token valid");
      } else {
        report("fail", "Hugging Face token valid", `HTTP ${res.status}`, "Token may be revoked or missing the 'Make calls to Inference Providers' permission.");
      }
    } catch {
      report("warn", "Hugging Face token valid", "could not reach huggingface.co");
    }
  }

  if (groq) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${groq}` },
      });
      if (res.ok) {
        report("pass", "Groq key valid");

        // A valid key with a retired model 404s as model_not_found, which reads
        // exactly like an auth failure. Check the model we actually call.
        const body = (await res.json()) as { data?: { id: string }[] };
        const available = (body.data ?? []).map((m) => m.id);
        if (available.includes(GROQ_MODEL)) {
          report("pass", "Groq model available", GROQ_MODEL);
        } else {
          const chat = available
            .filter((id) => !/whisper|guard|orpheus/.test(id))
            .slice(0, 4)
            .join(", ");
          report(
            "warn",
            "Groq model available",
            `${GROQ_MODEL} not in this account's catalogue`,
            `Match explanations will be skipped. Update GROQ_MODEL in src/lib/constants.ts — currently offered: ${chat}`
          );
        }
      } else if (res.status === 401) {
        report("fail", "Groq key valid", "401 unauthorized", "Key is wrong, revoked, or expired. Groq keys you set to expire do exactly this, silently.");
      } else {
        report("warn", "Groq key valid", `HTTP ${res.status}`);
      }
    } catch {
      report("warn", "Groq key valid", "could not reach api.groq.com");
    }
  }
}

async function main() {
  console.log(`\n${BOLD}Waymark preflight${RESET}`);

  await checkEnv();
  await checkDatabase();
  await checkServices();

  console.log("");
  if (failures) {
    console.log(`${RED}${BOLD}${failures} blocking problem(s)${RESET}${warnings ? `, ${warnings} warning(s)` : ""}. Fix the ✗ items above before running the app.\n`);
    process.exit(1);
  }
  if (warnings) {
    console.log(`${YELLOW}All required checks passed, ${warnings} warning(s).${RESET} The app will run; some features will be degraded.\n`);
    return;
  }
  console.log(`${GREEN}${BOLD}All checks passed.${RESET} Run: npm run dev\n`);
}

main().catch((err) => {
  console.error(`\n${RED}doctor crashed:${RESET}`, err);
  process.exit(1);
});
