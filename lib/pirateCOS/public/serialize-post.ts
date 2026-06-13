import type { IPost } from "@/models/Post";

/**
 * The ONLY shape a Post is ever allowed to take on a public (v1) API response.
 *
 * This is an allow-list, not a deny-list: anything not explicitly copied in
 * `serializePost()` below can never leak. Internal/sensitive fields such as
 * `tenantId`, `teamId`, `owner.email`, `assignees[].email`, `aiWorkspaceSession`,
 * `approval*`, `botViews`, `duplicateViews`, and `distributionRecords` are
 * intentionally absent. See PIRATECOS_PUBLIC_API_INTEGRATION_PLAN.md §3.1.
 */
export interface PublicPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string; // HTML
  featuredImage?: string;
  bannerImage?: string;
  tags: string[];
  postType: string;
  author: { name: string }; // email intentionally omitted
  readTime?: number;
  views?: number; // unique human views only — never bot/duplicate internals
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
  publishedAt?: string;
  updatedAt: string;
}

/**
 * Fields that callers may request via `?fields=`. `id` is always included
 * regardless of the requested set so responses stay addressable.
 */
export const PUBLIC_POST_FIELDS: (keyof PublicPost)[] = [
  "id",
  "slug",
  "title",
  "excerpt",
  "content",
  "featuredImage",
  "bannerImage",
  "tags",
  "postType",
  "author",
  "readTime",
  "views",
  "seo",
  "publishedAt",
  "updatedAt",
];

type AnyPost = IPost | Record<string, any>;

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  const d = value instanceof Date ? value : new Date(value as string);

  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

/**
 * Convert a raw Mongo Post document (lean or hydrated) into the public,
 * whitelist-only shape. Never pass a raw doc to a public response — always
 * run it through here first.
 */
export function serializePost(post: AnyPost): PublicPost {
  const seo = post.seo || {};

  return {
    id: String(post._id ?? post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || undefined,
    content: post.content,
    featuredImage: post.featuredImage || undefined,
    bannerImage: post.bannerImage || undefined,
    tags: Array.isArray(post.tags) ? post.tags : [],
    postType: post.postType || "blog",
    author: { name: post.author?.name || "" },
    readTime: post.readTime,
    views: post.views ?? 0,
    seo: {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
      keywords: Array.isArray(seo.keywords) ? seo.keywords : undefined,
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: seo.ogImage,
      canonicalUrl: seo.canonicalUrl,
      noIndex: seo.noIndex,
    },
    publishedAt: toIso(post.publishedAt),
    updatedAt: toIso(post.updatedAt) || new Date(0).toISOString(),
  };
}

/**
 * Narrow a PublicPost to a requested subset of fields (from `?fields=a,b,c`).
 * `id` is always retained. Unknown field names are ignored. Returns the full
 * object when `fieldsCsv` is empty/undefined.
 */
export function pickFields(
  post: PublicPost,
  fieldsCsv?: string | null,
): Partial<PublicPost> {
  if (!fieldsCsv) return post;

  const requested = new Set(
    fieldsCsv
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
  );

  requested.add("id");

  const out: Partial<PublicPost> = {};

  for (const field of PUBLIC_POST_FIELDS) {
    if (requested.has(field)) {
      (out as any)[field] = post[field];
    }
  }

  return out;
}
