import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client, scoped to the signed-in student via cookies.
 * Still uses the publishable key, so RLS applies. This is what pages and route
 * handlers should use for anything touching a student's own data.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Admin client using the SECRET key. This BYPASSES Row Level Security entirely —
 * it can read and write every student's data.
 *
 * Rules:
 *   - Only ever import this from server-only code (route handlers, scripts).
 *   - Never pass user input straight into a query made with it.
 *   - Never use it just to make an RLS error go away. An RLS error means the
 *     policy is wrong; fix the policy.
 *
 * Legitimate uses here: seeding opportunities, generating embeddings in bulk.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is not set");

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      cookies: { getAll: () => [], setAll: () => {} },
    }
  );
}
