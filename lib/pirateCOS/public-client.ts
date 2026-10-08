/**
 * Server-side client for the PirateCOS public v1 API.
 *
 * Server-only: import this only from server components / route handlers. The
 * API key has no NEXT_PUBLIC_ prefix, so Next never inlines it into the client
 * bundle.
 *
 * The public readers (`/blogs`, `/[slug]`) consume content through this client
 * instead of querying Mongo directly. Going through the tenant-scoped v1 API
 * means the public site only ever shows the key's tenant's published posts —
 * fixing the cross-tenant leak the direct `Post.find({ published })` queries had.
 *
 * The API key is read from COMETCOS_API_KEY (legacy PIRATECOS_API_KEY still
 * works) and stays on the server — it is never shipped to the browser. Pages
 * fetch here and pass plain data as props.
 */

import {
  proxyIfDataUri,
  versionOf,
  type ImageKind,
} from "./images";
import { pickSuggested } from "./suggested";

const BASE_URL =
  process.env.COMETCOS_API_BASE_URL ||
  process.env.PIRATECOS_API_BASE_URL ||
  "https://cos.uipirate.com";
// The CMS was renamed pirateCOS -> cometCOS and the old path now answers with a
// 308 redirect, so every call paid an extra round trip. Call the real path.
const API_PREFIX = "/api/cometCOS/v1";
const API_KEY = process.env.COMETCOS_API_KEY || process.env.PIRATECOS_API_KEY;

/** The shape the existing reader components expect (legacy `_id`, `createdAt`). */
export interface ReaderPost {
  _id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  tags: string[];
  postType?: string;
  author: { name: string; email: string };
  readTime?: number;
  views?: number;
  totalViews?: number;
  // Case-study-only structured fields (postType: "case-study")
  client?: string;
  clientLogo?: string;
  region?: string;
  technologies?: string[];
  metrics?: Array<{ label: string; value: string }>;
  externalUrl?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: "summary" | "summary_large_image";
    canonicalUrl?: string;
    noIndex?: boolean;
  };
  createdAt: string;
  publishedAt: string | null;
  updatedAt: string;
}

/**
 * Map a v1 API post to the reader shape. Tolerant of both the serialized
 * Phase-1 shape (`id`, `publishedAt`/`updatedAt`, no `content` in lists) and the
 * legacy raw-doc shape (`_id`, `createdAt`) so the migration works regardless of
 * which API version is deployed at the time.
 */
function toReaderPost(p: any): ReaderPost {
  // A few posts store hero images as base64 data URIs (up to ~400 KB, twice).
  // Swap them for short proxy URLs so they stay out of page HTML.
  const v = versionOf(p.updatedAt ?? p.createdAt);
  const img = (value: string | undefined, kind: ImageKind) =>
    proxyIfDataUri(value, p.slug, kind, v);

  return {
    _id: String(p.id ?? p._id ?? ""),
    slug: p.slug,
    title: p.title,
    content: p.content ?? "",
    excerpt: p.excerpt,
    featuredImage: img(p.featuredImage, "featured"),
    bannerImage: img(p.bannerImage, "banner"),
    tags: Array.isArray(p.tags) ? p.tags : [],
    postType: p.postType,
    author: {
      name: p.author?.name ?? "UI Pirate",
      email: p.author?.email ?? "",
    },
    readTime: p.readTime,
    views: p.views,
    totalViews: p.totalViews,
    client: p.client,
    clientLogo: img(p.clientLogo, "logo"),
    region: p.region,
    technologies: Array.isArray(p.technologies) ? p.technologies : undefined,
    metrics: Array.isArray(p.metrics) ? p.metrics : undefined,
    externalUrl: p.externalUrl,
    seo: p.seo,
    createdAt:
      p.createdAt ?? p.publishedAt ?? p.updatedAt ?? new Date(0).toISOString(),
    publishedAt: p.publishedAt ?? p.createdAt ?? null,
    updatedAt: p.updatedAt ?? p.createdAt ?? new Date(0).toISOString(),
  };
}

async function apiGet(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<any | null> {
  if (!API_KEY) {
    console.error(
      "COMETCOS_API_KEY is not set — public reader cannot fetch content.",
    );

    return null;
  }

  const url = new URL(`${BASE_URL}${API_PREFIX}${path}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${API_KEY}` },
      // Use a time-based revalidate (NOT `cache: "no-store"`). In the App Router
      // `no-store` opts the whole calling route out of static prerendering and
      // makes it dynamically rendered on every request, which disables <Link>
      // prefetch and makes navigation to /blogs, /case-studies, etc. a full
      // server round-trip. `next: { revalidate }` keeps those pages statically
      // prerendered + refreshed on an interval (matching each route's own
      // `export const revalidate`). Responses over Next's 2MB fetch-cache cap
      // simply aren't stored in the data cache — the page-level ISR still works.
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`PirateCOS v1 GET ${path} failed: ${res.status}`);
      }

      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`PirateCOS v1 GET ${path} threw`, err);

    return null;
  }
}

// List cards never need the heavy HTML `content`. Requesting an explicit slim
// field set keeps the list payload small (and under Next's 2MB fetch-cache
// limit) once the Phase-1 API — which honors `fields` — is deployed.
const LIST_FIELDS =
  "id,slug,title,excerpt,featuredImage,bannerImage,tags,postType,author,readTime,views,publishedAt,updatedAt,client,clientLogo,region,technologies,metrics,externalUrl";

/**
 * What the sitemap needs from a post, and nothing else. Fetching a hundred
 * posts with LIST_FIELDS drags every hero image along — a few posts store them
 * as base64, which pushed this one request to ~2.2 MB, over Next's 2 MB
 * data-cache limit, so it was refetched on every build and revalidation.
 */
export const SITEMAP_FIELDS = "id,slug,postType,publishedAt,updatedAt,seo";

/** List published posts for the reader. Returns [] on any failure. */
export async function listPosts(opts?: {
  limit?: number;
  page?: number;
  postType?: string;
  /** Comma-separated field list; defaults to the card fields. */
  fields?: string;
}): Promise<ReaderPost[]> {
  const json = await apiGet("/content", {
    limit: opts?.limit ?? 50,
    page: opts?.page ?? 1,
    postType: opts?.postType,
    fields: opts?.fields ?? LIST_FIELDS,
  });

  if (!json?.success || !Array.isArray(json.data)) return [];

  return json.data.map(toReaderPost);
}

/** Fetch a single published post by slug. Returns null if not found. */
export async function getPostBySlug(slug: string): Promise<ReaderPost | null> {
  const json = await apiGet(`/content/${encodeURIComponent(slug)}`);

  if (!json?.success || !json.data) return null;

  return toReaderPost(json.data);
}

/** Slugs for static generation. Best-effort; returns [] if unavailable. */
export async function listPostSlugs(opts?: {
  postType?: string;
}): Promise<string[]> {
  const json = await apiGet("/content", {
    limit: 100,
    fields: "slug",
    postType: opts?.postType,
  });

  if (!json?.success || !Array.isArray(json.data)) return [];

  return json.data.map((p: any) => p.slug).filter(Boolean);
}

/**
 * The untouched image value for one post — used only by the image proxy route,
 * which needs the original `data:` URI that `toReaderPost` deliberately hides.
 * `null` when the post or the field does not exist.
 */
export async function getRawPostImage(
  slug: string,
  kind: ImageKind,
): Promise<string | null> {
  const json = await apiGet(`/content/${encodeURIComponent(slug)}`);

  if (!json?.success || !json.data) return null;

  const field =
    kind === "featured"
      ? json.data.featuredImage
      : kind === "banner"
        ? json.data.bannerImage
        : json.data.clientLogo;

  return typeof field === "string" && field ? field : null;
}

/**
 * The posts an article links to at the bottom.
 *
 * Picks the slugs from a tiny field-limited list (~17 KB for the whole
 * catalogue), then fetches only the chosen few as full cards — so the heavy
 * image fields of every other post are never downloaded. `content` is blanked:
 * the cards never use it, and left in it would be serialised into the page.
 * Returns [] on any failure, so a CMS hiccup cannot take the article down.
 */
export async function getSuggestedPosts(
  currentSlug: string,
  count = 3,
): Promise<ReaderPost[]> {
  try {
    const pool = await listPosts({
      limit: 100,
      fields: "id,slug,postType,publishedAt,updatedAt",
    });

    // Case studies and concepts have their own sections; suggest articles.
    const articles = pool.filter(
      (p) => p.postType !== "case-study" && p.postType !== "concept",
    );

    const picks = pickSuggested(articles, currentSlug, count);
    const full = await Promise.all(picks.map((p) => getPostBySlug(p.slug)));

    return full
      .filter((p): p is ReaderPost => p !== null)
      .map((p) => ({ ...p, content: "" }));
  } catch {
    return [];
  }
}
