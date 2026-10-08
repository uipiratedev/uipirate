import { describe, expect, it } from "vitest";

import { pickSuggested, postHref } from "@/lib/pirateCOS/suggested";

// Newest first: p1 is the newest.
const post = (n: number, postType?: string) => ({
  slug: `p${n}`,
  postType,
  publishedAt: new Date(2026, 9, 30 - n).toISOString(),
});
const pool = Array.from({ length: 8 }, (_, i) => post(i + 1));

describe("postHref", () => {
  it("links each type to its canonical route, never through a redirect", () => {
    expect(postHref({ slug: "a", postType: "case-study" })).toBe("/case-studies/a");
    expect(postHref({ slug: "a", postType: "concept" })).toBe("/concepts/a");
    expect(postHref({ slug: "a", postType: "blog" })).toBe("/a");
    expect(postHref({ slug: "a", postType: "tutorial" })).toBe("/a");
    expect(postHref({ slug: "a" })).toBe("/a");
  });
});

describe("pickSuggested", () => {
  it("offers the posts that follow the current one, newest-first", () => {
    expect(pickSuggested(pool, "p2").map((p) => p.slug)).toEqual(["p3", "p4", "p5"]);
  });

  it("wraps around so the oldest posts still link somewhere", () => {
    expect(pickSuggested(pool, "p7").map((p) => p.slug)).toEqual(["p8", "p1", "p2"]);
    expect(pickSuggested(pool, "p8").map((p) => p.slug)).toEqual(["p1", "p2", "p3"]);
  });

  it("never suggests the post itself", () => {
    for (const p of pool)
      expect(pickSuggested(pool, p.slug).map((s) => s.slug)).not.toContain(p.slug);
  });

  it("gives EVERY post the same number of inbound links", () => {
    // The point of the change: previously the 3 newest posts collected every
    // link and the rest got none.
    const inbound = new Map<string, number>();

    for (const p of pool)
      for (const s of pickSuggested(pool, p.slug, 3))
        inbound.set(s.slug, (inbound.get(s.slug) ?? 0) + 1);

    expect(pool.every((p) => inbound.get(p.slug) === 3)).toBe(true);
  });

  it("is stable regardless of the order the CMS returns", () => {
    const shuffled = [pool[4], pool[0], pool[7], pool[2], pool[5], pool[1], pool[6], pool[3]];

    expect(pickSuggested(shuffled, "p3").map((p) => p.slug)).toEqual(
      pickSuggested(pool, "p3").map((p) => p.slug),
    );
  });

  it("falls back to the newest when the current post is not in the pool", () => {
    expect(pickSuggested(pool, "elsewhere").map((p) => p.slug)).toEqual(["p1", "p2", "p3"]);
  });

  it("returns whatever exists when the pool is small", () => {
    expect(pickSuggested([post(1), post(2)], "p1").map((p) => p.slug)).toEqual(["p2"]);
    expect(pickSuggested([], "p1")).toEqual([]);
  });

  it("respects a custom count", () => {
    expect(pickSuggested(pool, "p1", 2)).toHaveLength(2);
  });
});
