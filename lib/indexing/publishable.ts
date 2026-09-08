import { getPostBySlug } from "@/lib/pirateCOS/public-client";

/**
 * Hardcoded list of known draft/held case study slugs that must NEVER be
 * submitted to search engine indexes until explicitly flipped live.
 */
export const HELD_DRAFT_SLUGS = new Set([
  "frytx",
  "infinity-aquasol",
  "designing-testdynamiz",
  "designing-brahmastra",
]);

/**
 * Internal system paths that should never be indexed.
 */
const SYSTEM_PREFIXES = ["/admin", "/login", "/api", "/_next", "/_og"];

/**
 * Normalize an absolute URL or path to a pathname.
 */
export function extractPath(urlOrPath: string): string {
  try {
    if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
      const u = new URL(urlOrPath);
      return u.pathname || "/";
    }
  } catch {
    // fallback to string manipulation
  }
  const [clean] = urlOrPath.split("?");
  return clean.startsWith("/") ? clean : `/${clean}`;
}

export interface PublishableCheckResult {
  publishable: boolean;
  isDraft: boolean;
  reason?: string;
}

/**
 * Validates whether a given URL or path is safe and eligible for search engine indexing.
 * Rejects drafts, unreleased case studies, admin routes, and intentional noindex items.
 */
export async function isPublishable(
  urlOrPath: string,
): Promise<PublishableCheckResult> {
  const path = extractPath(urlOrPath);

  // 1. Block system/admin paths
  for (const prefix of SYSTEM_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return {
        publishable: false,
        isDraft: false,
        reason: `System path excluded: ${prefix}`,
      };
    }
  }

  // 2. Check held draft case studies
  if (path.startsWith("/case-studies/")) {
    const slug = path.replace(/^\/case-studies\//, "").replace(/\/$/, "");
    if (HELD_DRAFT_SLUGS.has(slug)) {
      return {
        publishable: false,
        isDraft: true,
        reason: `Case study '${slug}' is currently held in draft state.`,
      };
    }

    // Check CMS post status if possible
    try {
      const post = await getPostBySlug(slug);
      if (!post) {
        // Not published in CMS
        return {
          publishable: false,
          isDraft: true,
          reason: `Case study '${slug}' is not published in CMS.`,
        };
      }
      if (post.seo?.noIndex) {
        return {
          publishable: false,
          isDraft: false,
          reason: `Case study '${slug}' has SEO noIndex enabled.`,
        };
      }
    } catch {
      // In case CMS is unreachable or in dev without key, allow normal check
    }
  }

  // 3. Check standalone blog posts (e.g. /[slug])
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 1 && !["about", "pricing", "process", "contact", "faqs", "blogs", "case-studies", "tools", "apps4sale", "componentlab", "privacy", "terms", "sitemap"].includes(segments[0])) {
    const slug = segments[0];
    try {
      const post = await getPostBySlug(slug);
      if (post) {
        if (post.seo?.noIndex) {
          return {
            publishable: false,
            isDraft: false,
            reason: `Blog post '${slug}' has SEO noIndex enabled.`,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  return { publishable: true, isDraft: false };
}
