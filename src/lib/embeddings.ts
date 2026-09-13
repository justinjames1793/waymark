const HF_MODEL = "sentence-transformers/all-MiniLM-L6-v2";
// api-inference.huggingface.co (the old serverless Inference API host) no
// longer resolves — HF moved this behind the "Inference Providers" router,
// which is also why the token needs that specific permission (see doctor.ts).
const HF_ENDPOINT = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}/pipeline/feature-extraction`;

/**
 * Calls Hugging Face for a 384-dim embedding. Only ever called at write time —
 * onboarding submit, or the seed/ingest script — never from a page render. See
 * "Embeddings are computed at write time, never at read time" in CLAUDE.md.
 */
export async function embed(text: string): Promise<number[]> {
  // doctor and /api/health both accept either name (the .env.local key drifted
  // from CLAUDE.md's HUGGINGFACE_API_TOKEN to HUGGINGFACE_API_KEY at some
  // point) — matching that here so this isn't the one place that silently
  // breaks on the name it doesn't expect.
  const token = process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("HUGGINGFACE_API_TOKEN is not set");

  const res = await fetch(HF_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // wait_for_model: the free tier unloads idle models; without this the
    // first call of the day 503s instead of just taking a few extra seconds.
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
  });

  if (!res.ok) {
    throw new Error(`Hugging Face embedding request failed: ${res.status} ${await res.text()}`);
  }

  const data: unknown = await res.json();

  // A single string input normally comes back as a flat 384-number array, but
  // guard against the nested per-token shape some pipeline versions return.
  const vector =
    Array.isArray(data) && typeof data[0] === "number"
      ? (data as number[])
      : (data as number[][])[0];

  if (!Array.isArray(vector) || vector.length !== 384) {
    throw new Error("Unexpected embedding shape from Hugging Face");
  }

  return vector;
}

/**
 * Batch version, for the seed/ingest script. The endpoint returns one vector
 * per input, so a whole quarter of events costs a handful of requests instead
 * of one per row.
 */
export async function embedMany(texts: string[]): Promise<number[][]> {
  const token = process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("HUGGINGFACE_API_TOKEN is not set");

  const res = await fetch(HF_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: texts, options: { wait_for_model: true } }),
  });

  if (!res.ok) {
    throw new Error(`Hugging Face embedding request failed: ${res.status} ${await res.text()}`);
  }

  const data: unknown = await res.json();

  if (!Array.isArray(data) || data.length !== texts.length) {
    throw new Error("Unexpected batch embedding shape from Hugging Face");
  }

  return data.map((vector) => {
    if (!Array.isArray(vector) || vector.length !== 384) {
      throw new Error("Unexpected embedding shape from Hugging Face");
    }
    return vector as number[];
  });
}

export interface ProfileEmbeddingInput {
  major: string;
  year: string;
  interests: string[];
  careerGoals: string;
  resume?: string | null;
  /** Events the student attended, so the feed learns from what they did. */
  experiences?: {
    title: string;
    organization: string;
    rating: number | null;
    reflection: string | null;
  }[];
}

// all-MiniLM-L6-v2 truncates at 256 word pieces and says nothing about it, so
// order here is load-bearing: the stated goals go first and the free-text
// resume last, because that is the part we can most afford to lose.
const RESUME_BUDGET = 600;
const MAX_EXPERIENCES = 5;

/** The text actually fed to the model — what a profile "means" for matching purposes. */
export function buildProfileEmbeddingText(input: ProfileEmbeddingInput): string {
  const parts = [
    `Major: ${input.major}`,
    `Year: ${input.year}`,
    `Interests: ${input.interests.join(", ")}`,
    `Career goals: ${input.careerGoals}`,
  ];

  // Only experiences the student got something out of. A vector has no way to
  // express "less like this", so folding in a badly-rated event would pull the
  // feed toward more of exactly what they disliked.
  const valued = (input.experiences ?? [])
    .filter((e) => (e.rating ?? 0) >= 2)
    .slice(0, MAX_EXPERIENCES);

  if (valued.length) {
    const lines = valued.map((e) => {
      const took = e.reflection?.trim();
      return `- ${e.title} (${e.organization})${took ? `: ${took}` : ""}`;
    });
    parts.push(`Has attended and valued:\n${lines.join("\n")}`);
  }

  const resume = input.resume?.trim();
  if (resume) parts.push(`Background: ${resume.slice(0, RESUME_BUDGET)}`);

  return parts.join("\n");
}
