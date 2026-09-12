import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 *
 * Uses the PUBLISHABLE key, which is compiled into the JavaScript bundle and is
 * therefore visible to anyone who opens devtools. That is fine — and only fine —
 * because Row Level Security is enabled on every table, so this key can only
 * reach rows the signed-in student is allowed to see. If RLS is ever turned off
 * on a table, this key becomes a public read of that whole table.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
