/**
 * Writes the Google Business post text with Gemini, from the whole article
 * rather than the one-line CMS excerpt.
 *
 * The call is isolated here so the prompt and the output rules can be tested
 * without a network; `generateOverview` is the only function that does I/O.
 */
import { toPlainText } from "./payload";

/** Google's limit is 1,500 for the whole post; the title is added around this. */
export const OVERVIEW_MAX = 1100;

/** What the model is told about the business, so posts sound like it. */
export const BUSINESS_CONTEXT = `UI Pirate is a product design and engineering studio. It designs and builds
web and mobile products for startups and growing companies (UI/UX, Next.js and
Angular front ends, Node and Python back ends, AI features) and publishes
tutorials, design-system guides and case studies from that work.`;

const ARTICLE_CHARS = 12_000;

export interface OverviewInput {
  title: string;
  excerpt?: string;
  content?: string;
  postType?: string;
}

export function buildOverviewPrompt(p: OverviewInput): string {
  const kind =
    p.postType === "case-study"
      ? "case study"
      : p.postType === "tutorial"
        ? "tutorial"
        : p.postType === "concept"
          ? "concept"
          : "blog article";
  const body = toPlainText(p.content).slice(0, ARTICLE_CHARS);

  return `You write short posts for the Google Business Profile of this business.

BUSINESS
${BUSINESS_CONTEXT}

TASK
Write the post text announcing the ${kind} below. A "Learn more" button already
links to the full page, so do not include any URL, email or phone number.

RULES
- 700 to 1000 characters, plain text, no markdown, no hashtags, no emojis.
- First sentence: the problem or result the reader cares about, not "We published".
- Then 3 to 4 concrete takeaways from the article, as short sentences or lines
  starting with "- ". Use only facts that are in the article; never invent numbers,
  clients or claims.
- End with one sentence inviting the reader to read the full ${kind}.
- Do not repeat the title.

TITLE
${p.title}

EXCERPT
${toPlainText(p.excerpt)}

ARTICLE
${body || "(no body available — write only from the title and excerpt)"}`;
}

/** Clean model output into text Google will accept. */
export function cleanOverview(raw: string): string {
  const text = raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[*_#`]+/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  if (text.length <= OVERVIEW_MAX) return text;

  const cut = text.slice(0, OVERVIEW_MAX - 1);
  const at = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("\n"));

  // End on a full sentence when one is reasonably close; otherwise on a word.
  if (at > OVERVIEW_MAX * 0.6) return cut.slice(0, at + 1).trim();

  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:!?-]+$/, "")}…`;
}

export class OverviewError extends Error {}

export function isOverviewConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export async function generateOverview(p: OverviewInput): Promise<string> {
  const key = process.env.GEMINI_API_KEY?.trim();

  if (!key) throw new OverviewError("GEMINI_API_KEY is not set.");

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildOverviewPrompt(p) }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          // 2.5 models spend the budget on hidden reasoning first and cut the text off.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
      signal: AbortSignal.timeout(40_000),
    },
  ).catch((e: unknown) => {
    throw new OverviewError(`Could not reach Gemini: ${e instanceof Error ? e.message : String(e)}`);
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");

    throw new OverviewError(`Gemini returned ${res.status}. ${detail.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = json.candidates?.[0]?.content?.parts?.map((x) => x.text ?? "").join("") ?? "";
  if (json.candidates?.[0]?.finishReason === "MAX_TOKENS")
    throw new OverviewError("Gemini stopped before finishing. Try again.");

  const out = cleanOverview(text);

  if (out.length < 80) throw new OverviewError("Gemini returned no usable text.");

  return out;
}
