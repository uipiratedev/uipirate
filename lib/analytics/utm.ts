/**
 * Builds a campaign-tagged URL.
 *
 * "Direct" is 79% of tracked sessions and only 2 sessions in a month carried a
 * UTM tag, so shared links (Reddit, LinkedIn, X, Upwork) lose their source the
 * moment someone opens them from an app that strips the referrer. A tagged
 * link survives that.
 */

export interface UtmInput {
  /** Destination — a full URL or a path on the site. */
  url: string;
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export const SITE_ORIGIN = "https://uipirate.com";

/** One-click presets for the places links actually get shared. */
export const UTM_PRESETS: Array<{
  label: string;
  source: string;
  medium: string;
}> = [
  { label: "Reddit post", source: "reddit", medium: "social" },
  { label: "LinkedIn post", source: "linkedin", medium: "social" },
  { label: "X / Twitter", source: "twitter", medium: "social" },
  { label: "Upwork proposal", source: "upwork", medium: "proposal" },
  { label: "Newsletter", source: "newsletter", medium: "email" },
  { label: "Email signature", source: "email-signature", medium: "email" },
  { label: "WhatsApp message", source: "whatsapp", medium: "message" },
  { label: "GitHub README", source: "github", medium: "referral" },
];

/** Lowercase, hyphenated, no stray punctuation — keeps one campaign one row. */
export function slugifyUtm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

/**
 * The tagged URL, or `null` when the destination is unusable or a required
 * field is empty. Existing query parameters are kept; an existing `utm_*` is
 * replaced rather than duplicated.
 */
export function buildUtmUrl(input: UtmInput): string | null {
  const raw = input.url.trim();

  if (!raw) return null;

  const source = slugifyUtm(input.source);
  const medium = slugifyUtm(input.medium);

  if (!source || !medium) return null;

  let u: URL;

  try {
    u = new URL(raw.startsWith("/") ? `${SITE_ORIGIN}${raw}` : raw);
  } catch {
    return null;
  }

  if (u.protocol !== "http:" && u.protocol !== "https:") return null;

  const set = (k: string, v: string | undefined) => {
    const s = v ? slugifyUtm(v) : "";

    if (s) u.searchParams.set(k, s);
    else u.searchParams.delete(k);
  };

  set("utm_source", source);
  set("utm_medium", medium);
  set("utm_campaign", input.campaign);
  set("utm_content", input.content);
  set("utm_term", input.term);

  return u.toString();
}
