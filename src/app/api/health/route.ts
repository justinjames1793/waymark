import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side counterpart to `npm run doctor`. Hit http://localhost:3000/api/health
 * while the dev server is running to see what the *server* thinks is configured.
 * Never returns a key value — only whether each one is present.
 */
export async function GET() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ),
    SUPABASE_SECRET_KEY: Boolean(process.env.SUPABASE_SECRET_KEY),
    GROQ_API_KEY: Boolean(process.env.GROQ_API_KEY),
    HUGGINGFACE_API_TOKEN: Boolean(
      process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACE_API_KEY
    ),
  };

  let database: "ok" | "unreachable" | "not_configured" = "not_configured";
  let detail: string | null = null;

  if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .select("id", { head: true, count: "exact" });
      if (error) {
        database = "unreachable";
        detail = error.message;
      } else {
        database = "ok";
      }
    } catch (err) {
      database = "unreachable";
      detail = err instanceof Error ? err.message : String(err);
    }
  }

  const ok = Object.values(env).every(Boolean) && database === "ok";

  return NextResponse.json({ ok, env, database, detail }, { status: ok ? 200 : 503 });
}
