/**
 * Turns a CMS post into a Google Business Profile "What's new" post.
 *
 * Pure (no I/O) so every rule here is unit tested — this is the code that
 * decides what is said publicly on the business's Google listing.
 */
import { HELD_DRAFT_SLUGS } from "@/lib/indexing/publishable";
import { buildUtmUrl } from "@/lib/analytics/utm";
import { postHref } from "@/lib/pirateCOS/suggested";

export const SITE_ORIGIN = "https://uipirate.com";

/** Google rejects a summary over 1,500 characters. */
export const MAX_SUMMARY = 1500;

export interface GbpSourcePost {
  slug: string;
  title: string;
  excerpt?: string;
  /** Replaces the excerpt when set (AI-written or hand-edited in the admin). */
  overview?: string;
  /** Article HTML, mined for extra photos. */
  content?: string;
  postType?: string;
  featuredImage?: string;
  bannerImage?: string;
  seo?: { noIndex?: boolean };
  publishedAt?: string | null;
}

export interface Eligibility {
  eligible: boolean;
  /** Why not — shown in the admin and stored with the record. */
  reason?: string;
}

/**
 * Whether a post may be announced on Google.
 *
 * Mirrors the indexing rules: held drafts must never be pushed to Google until
 * they are deliberately released, and a post marked noindex is one the owner
 * does not want surfaced there either.
 */
export function eligibility(post: GbpSourcePost): Eligibility {
  if (HELD_DRAFT_SLUGS.has(post.slug))
    return { eligible: false, reason: "Held draft — not released yet" };

  if (post.seo?.noIndex) return { eligible: false, reason: "Marked noindex" };

  if (!post.title?.trim()) return { eligible: false, reason: "No title" };

  if (!post.publishedAt)
    return { eligible: false, reason: "Not published in the CMS" };

  return { eligible: true };
}

/** Plain text from HTML or markdown-ish excerpts. */
export function toPlainText(input: string | undefined | null): string {
  if (!input) return "";

  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Google's guidelines discourage links in post text; the button carries it. */
function stripUrls(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\bwww\.\S+/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Shorten at a word boundary, ending in an ellipsis when cut. */
export function truncateWords(text: string, max: number): string {
  if (text.length <= max) return text;

  const cut = text.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");

  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,.;:!?-]+$/, "")}…`;
}

/** The post body: the title, a blank line, then the excerpt. */
export function buildSummary(post: GbpSourcePost): string {
  const title = stripUrls(toPlainText(post.title));
  // An overview keeps its line breaks (bullets); the excerpt is flattened.
  const overview = post.overview
    ?.replace(/https?:\/\/\S+/gi, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const excerpt = overview || stripUrls(toPlainText(post.excerpt));
  const body = excerpt && excerpt !== title ? `${title}\n\n${excerpt}` : title;

  return truncateWords(body, MAX_SUMMARY);
}

/** The "Learn more" destination: the canonical page, tagged so visits show up. */
export function buildCtaUrl(post: GbpSourcePost): string {
  const url = buildUtmUrl({
    url: `${SITE_ORIGIN}${postHref(post)}`,
    source: "google",
    medium: "business-profile",
    campaign: "gbp-post",
    content: post.slug,
  });

  // buildUtmUrl only fails on an unusable URL; fall back to the bare page.
  return url ?? `${SITE_ORIGIN}${postHref(post)}`;
}

/** Make a CMS image reference absolute, or `null` if it cannot be used. */
export function absoluteImageUrl(value: string | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("data:")) return null;

  const abs = value.startsWith("/") ? `${SITE_ORIGIN}${value}` : value;

  if (!/^https:\/\//i.test(abs)) return null;

  // Google accepts JPG and PNG. The stock blog banner is an SVG placeholder.
  const path = abs.split("?")[0].toLowerCase();

  if (path.endsWith(".svg") || path.endsWith(".gif")) return null;

  return abs;
}

/**
 * The branded 1200×630 card the site already generates for every post
 * (`opengraph-image.tsx`). Used when a post has no photo of its own, so no
 * post goes out as bare text — 16 of the 27 eligible posts had no usable image.
 * Same URL shape the site's own metadata uses; PNG, well inside Google's size
 * limits.
 */
export function ogCardUrl(post: Pick<GbpSourcePost, "slug" | "postType">): string {
  const base =
    post.postType === "case-study"
      ? `/case-studies/${post.slug}`
      : post.postType === "concept"
        ? `/concepts/${post.slug}`
        : `/${post.slug}`;

  return `${SITE_ORIGIN}${base}/opengraph-image/${post.slug}`;
}

/** Most photos sent with one post. */
export const MAX_IMAGES = 3;

/**
 * Up to three usable photos: the featured image, the banner, then pictures from
 * the article itself, without repeats. Anything Google cannot use (inline data,
 * SVG, GIF, plain http) is skipped.
 */
export function collectImages(post: GbpSourcePost, max = MAX_IMAGES): string[] {
  const inArticle = [...(post.content ?? "").matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["']/gi)].map(
    (m) => m[1],
  );
  const seen = new Set<string>();
  const out: string[] = [];

  for (const candidate of [post.featuredImage, post.bannerImage, ...inArticle]) {
    const url = absoluteImageUrl(candidate);

    if (!url || seen.has(url)) continue;

    seen.add(url);
    out.push(url);

    if (out.length >= max) break;
  }

  return out;
}

export interface LocalPostPayload {
  languageCode: string;
  topicType: "STANDARD";
  summary: string;
  callToAction: { actionType: "LEARN_MORE"; url: string };
  media?: Array<{ mediaFormat: "PHOTO"; sourceUrl: string }>;
}

export function buildLocalPost(post: GbpSourcePost): LocalPostPayload {
  const payload: LocalPostPayload = {
    languageCode: "en-US",
    topicType: "STANDARD",
    summary: buildSummary(post),
    callToAction: { actionType: "LEARN_MORE", url: buildCtaUrl(post) },
  };

  // The post's own photos first; otherwise its generated card, so there is
  // always an image.
  const images = collectImages(post);

  payload.media = (images.length ? images : [ogCardUrl(post)]).map((sourceUrl) => ({
    mediaFormat: "PHOTO" as const,
    sourceUrl,
  }));

  return payload;
}
