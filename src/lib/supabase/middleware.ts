import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * THIS FILE IS WHY SIGN-IN WORKS.
 *
 * Supabase stores the session in cookies that expire and must be refreshed on
 * every request. Without middleware doing that refresh, the browser thinks it
 * is signed in while the server does not: you sign in, get redirected to a
 * protected page, the server renders it, sees no user, and bounces you back to
 * /auth. It looks exactly like a wrong password. The previous version of this
 * app shipped without this file, which is the bug we are not repeating.
 *
 * Do not delete this, and do not skip calling getUser() below — the call is
 * what performs the refresh.
 */

const PROTECTED = ["/dashboard", "/onboarding", "/opportunities"];

/**
 * Pages a signed-in student has no reason to see. Matched EXACTLY, not by
 * prefix: "/auth".startsWith() would also swallow "/auth/callback" (breaking
 * email confirmation) and "/auth/signout" (making sign-out redirect to the
 * dashboard instead of signing out — an infinite "why am I still logged in").
 */
const AUTH_ONLY = ["/auth"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() revalidates the token against Supabase and refreshes the cookie.
  // Never replace this with getSession(), which trusts the cookie without
  // checking it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (PROTECTED.some((p) => path.startsWith(p)) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (AUTH_ONLY.includes(path) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
