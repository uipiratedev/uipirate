/**
 * Which posts an article links to at the bottom, and where those links point.
 *
 * Two problems this replaces:
 *
 * 1. "More to Read" always showed the 3 newest posts. Those are currently case
 *    studies, so every article carried the same 3 links, and the other posts
 *    got almost none — a median of 1 inbound internal link, with 36 pages
 *    sitting at "Discovered – currently not indexed". Internal links are how
 *    Google finds and ranks a page, so unlinked posts stay unseen.
 *
 * 2. The links were built as `/${slug}`, but case studies and concepts live
 *    under `/case-studies/` and `/concepts/`. `/[slug]` answers those with a
 *    redirect, so each such link spent its link equity passing through one.
 *
 * Pure and framework-free so the selection rules are unit tested.
 */

export interface LinkablePost {
  slug: string;
  postType?: string;
  publishedAt?: string | null;
  createdAt?: string;
}

/** The canonical URL path for a post, so no link goes through a redirect. */
export function postHref(post: Pick<LinkablePost, "slug" | "postType">): string {
  if (post.postType === "case-study") return `/case-studies/${post.slug}`;
  if (post.postType === "concept") return `/concepts/${post.slug}`;

  return `/${post.slug}`;
}

const time = (p: LinkablePost) =>
  Date.parse(p.publishedAt || p.createdAt || "") || 0;

/**
 * `count` posts to suggest after `currentSlug`.
 *
 * Takes the posts that follow the current one in newest-first order, wrapping
 * around the end of the list. Because every post is "the next" of the `count`
 * posts before it, **every post receives `count` inbound links** — the newest
 * and the oldest alike — instead of the same few collecting all of them. The
 * result is stable between builds, so cached pages do not churn.
 */
export function pickSuggested<T extends LinkablePost>(
  pool: readonly T[],
  currentSlug: string,
  count = 3,
): T[] {
  const sorted = [...pool].sort((a, b) => time(b) - time(a));
  const others = sorted.filter((p) => p.slug !== currentSlug);

  if (others.length <= count) return others;

  const at = sorted.findIndex((p) => p.slug === currentSlug);

  // Not in the pool (e.g. a different post type): just offer the newest.
  if (at < 0) return others.slice(0, count);

  const out: T[] = [];

  for (let i = 1; out.length < count && i <= sorted.length; i++) {
    const p = sorted[(at + i) % sorted.length];

    if (p.slug !== currentSlug) out.push(p);
  }

  return out;
}
