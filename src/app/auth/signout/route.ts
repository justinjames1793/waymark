import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  await supabase.auth.signOut();
  // 303 so the browser follows with GET. The default (307) preserves the POST
  // method and would re-POST to "/", which Next answers with a 405.
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
