import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import { GROQ_MODEL } from "@/lib/constants";

/**
 * "Why this matched" lines for the top few cards.
 *
 * Groq is a garnish (CLAUDE.md): every failure path here returns an empty set
 * of explanations with a 200, never an error, so the feed renders the same way
 * whether or not this succeeds. The client fetches it after paint.
 */

const TIMEOUT_MS = 8000;

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ explanations: {} });

  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ explanations: {} });

  const body = await request.json();
  const ids: string[] = Array.isArray(body.ids)
    ? body.ids.filter((id: unknown) => typeof id === "string").slice(0, 6)
    : [];
  if (!ids.length) return NextResponse.json({ explanations: {} });

  // RLS scopes this to the caller's own row.
  const { data: profile } = await supabase
    .from("profiles")
    .select("major, year, interests, career_goals")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ explanations: {} });

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, title, organization, category, description")
    .in("id", ids);

  if (!opportunities?.length) return NextResponse.json({ explanations: {} });

  const student = [
    `Major: ${profile.major}`,
    `Year: ${profile.year}`,
    `Interests: ${(profile.interests ?? []).join(", ")}`,
    `Career goals: ${profile.career_goals}`,
  ].join("\n");

  const list = opportunities
    .map(
      (o: { id: string; title: string; organization: string; description: string | null }) =>
        `id: ${o.id}\ntitle: ${o.title}\norganization: ${o.organization}\ndescription: ${o.description ?? ""}`
    )
    .join("\n\n");

  const prompt = `A university student has this profile:

${student}

For each campus opportunity below, write one sentence (max 20 words) saying why it fits THIS student specifically. Reference their goals or major concretely — never generic praise. Address them as "you".

${list}

Return only JSON: {"explanations": {"<id>": "<sentence>"}}`;

  try {
    const groq = new Groq({ apiKey: key, timeout: TIMEOUT_MS, maxRetries: 0 });

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ explanations: {} });

    const parsed = JSON.parse(raw);
    const explanations: Record<string, string> = {};

    // Only trust ids we actually asked about, so a hallucinated key can't get
    // rendered against the wrong card.
    for (const id of ids) {
      const line = parsed?.explanations?.[id];
      if (typeof line === "string" && line.trim()) explanations[id] = line.trim();
    }

    return NextResponse.json({ explanations });
  } catch (err) {
    console.error("Groq explanation failed:", err);
    return NextResponse.json({ explanations: {} });
  }
}
