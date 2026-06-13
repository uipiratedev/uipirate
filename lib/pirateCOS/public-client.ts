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
 * The API key is read from PIRATECOS_API_KEY and stays on the server — it is
 * never shipped to the browser. Pages fetch here and pass plain data as props.
 */

const BASE_URL =
  process.env.PIRATECOS_API_BASE_URL || "https://cos.uipirate.com";
const API_KEY = process.env.PIRATECOS_API_KEY;

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
  return {
    _id: String(p.id ?? p._id ?? ""),
    slug: p.slug,
    title: p.title,
    content: p.content ?? "",
    excerpt: p.excerpt,
    featuredImage: p.featuredImage,
    bannerImage: p.bannerImage,
    tags: Array.isArray(p.tags) ? p.tags : [],
    postType: p.postType,
    author: { name: p.author?.name ?? "UI Pirate", email: p.author?.email ?? "" },
    readTime: p.readTime,
    views: p.views,
    totalViews: p.totalViews,
    seo: p.seo,
    createdAt: p.createdAt ?? p.publishedAt ?? p.updatedAt ?? new Date(0).toISOString(),
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
      "PIRATECOS_API_KEY is not set — public reader cannot fetch content.",
    );

    return null;
  }

  const url = new URL(`${BASE_URL}/api/pirateCOS/v1${path}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${API_KEY}` },
      // ISR: cache reader fetches for 60s, matching the API's Cache-Control.
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
  "id,slug,title,excerpt,featuredImage,bannerImage,tags,postType,author,readTime,views,publishedAt,updatedAt";

/** List published posts for the reader. Returns [] on any failure. */
export async function listPosts(opts?: {
  limit?: number;
  page?: number;
  postType?: string;
}): Promise<ReaderPost[]> {
  const json = await apiGet("/content", {
    limit: opts?.limit ?? 50,
    page: opts?.page ?? 1,
    postType: opts?.postType,
    fields: LIST_FIELDS,
  });

  if (!json?.success || !Array.isArray(json.data)) return [];

  return json.data.map(toReaderPost);
}

/** Fetch a single published post by slug. Returns null if not found. */
export async function getPostBySlug(
  slug: string,
): Promise<ReaderPost | null> {
  const json = await apiGet(`/content/${encodeURIComponent(slug)}`);

  if (!json?.success || !json.data) return null;

  return toReaderPost(json.data);
}

/** Slugs for static generation. Best-effort; returns [] if unavailable. */
export async function listPostSlugs(): Promise<string[]> {
  const json = await apiGet("/content", { limit: 100, fields: "slug" });

  if (!json?.success || !Array.isArray(json.data)) return [];

  return json.data.map((p: any) => p.slug).filter(Boolean);
}
