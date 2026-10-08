import { describe, expect, it } from "vitest";

import {
  absoluteImageUrl,
  buildCtaUrl,
  buildLocalPost,
  buildSummary,
  eligibility,
  toPlainText,
  truncateWords,
} from "@/lib/gbp/payload";
import {
  nextBacklogAt,
  selectToPublish,
  type QueueItem,
} from "@/lib/gbp/schedule";

const post = (over: Record<string, unknown> = {}) => ({
  slug: "design-tokens",
  title: "Design Tokens: How to Build a Token System",
  excerpt: "A practical guide to token architecture.",
  postType: "tutorial",
  publishedAt: "2026-09-16T13:01:14.502Z",
  ...over,
});

describe("eligibility", () => {
  it("allows a published post", () => {
    expect(eligibility(post()).eligible).toBe(true);
  });

  it.each(["frytx", "infinity-aquasol", "designing-testdynamiz", "designing-brahmastra"])(
    "never announces the held draft %s",
    (slug) => {
      const r = eligibility(post({ slug, postType: "case-study" }));

      expect(r.eligible).toBe(false);
      expect(r.reason).toMatch(/held/i);
    },
  );

  it("refuses noindex posts", () => {
    expect(eligibility(post({ seo: { noIndex: true } })).eligible).toBe(false);
  });

  it("refuses an unpublished or untitled post", () => {
    expect(eligibility(post({ publishedAt: null })).eligible).toBe(false);
    expect(eligibility(post({ title: "  " })).eligible).toBe(false);
  });
});

describe("summary", () => {
  it("is the title, a blank line, then the excerpt", () => {
    expect(buildSummary(post())).toBe(
      "Design Tokens: How to Build a Token System\n\nA practical guide to token architecture.",
    );
  });

  it("strips html and links from the text", () => {
    const s = buildSummary(
      post({ excerpt: "<p>Read <b>this</b> at https://uipirate.com/x now &amp; later</p>" }),
    );

    expect(s).not.toMatch(/<|https?:/);
    expect(s).toContain("Read this at now & later");
  });

  it("never exceeds Google's 1,500 character limit", () => {
    const s = buildSummary(post({ excerpt: "word ".repeat(2000) }));

    expect(s.length).toBeLessThanOrEqual(1500);
    expect(s.endsWith("…")).toBe(true);
  });

  it("does not repeat the title when the excerpt is identical", () => {
    expect(buildSummary(post({ excerpt: "Same" , title: "Same" }))).toBe("Same");
  });

  it("falls back to the title when there is no excerpt", () => {
    expect(buildSummary(post({ excerpt: undefined }))).toBe(post().title);
  });
});

describe("truncateWords / toPlainText", () => {
  it("cuts at a word boundary", () => {
    const out = truncateWords("alpha beta gamma delta epsilon", 18);

    expect(out.endsWith("…")).toBe(true);
    expect(out).not.toMatch(/gam…$/); // no mid-word cut
  });

  it("leaves short text alone", () => {
    expect(truncateWords("short", 50)).toBe("short");
  });

  it("collapses whitespace and entities", () => {
    expect(toPlainText("a&nbsp;&nbsp;b\n\n c")).toBe("a b c");
  });
});

describe("call to action", () => {
  it("links to the canonical page with UTM tags", () => {
    const u = new URL(buildCtaUrl(post()));

    expect(u.origin + u.pathname).toBe("https://uipirate.com/design-tokens");
    expect(u.searchParams.get("utm_source")).toBe("google");
    expect(u.searchParams.get("utm_medium")).toBe("business-profile");
    expect(u.searchParams.get("utm_content")).toBe("design-tokens");
  });

  it("points case studies at /case-studies, not through a redirect", () => {
    expect(buildCtaUrl(post({ slug: "xyz", postType: "case-study" }))).toContain(
      "https://uipirate.com/case-studies/xyz?",
    );
  });
});

describe("images", () => {
  it("accepts absolute https and site-relative paths", () => {
    expect(absoluteImageUrl("https://res.cloudinary.com/a.png")).toBe(
      "https://res.cloudinary.com/a.png",
    );
    expect(absoluteImageUrl("/api/post-image/x/featured/1")).toBe(
      "https://uipirate.com/api/post-image/x/featured/1",
    );
  });

  it("rejects what Google cannot use", () => {
    expect(absoluteImageUrl("data:image/png;base64,AAAA")).toBeNull();
    expect(absoluteImageUrl("/assets/blog-banner-default.svg")).toBeNull();
    expect(absoluteImageUrl("http://insecure.example/a.png")).toBeNull();
    expect(absoluteImageUrl(undefined)).toBeNull();
  });

  it("omits media when there is no usable image", () => {
    expect(buildLocalPost(post()).media).toBeUndefined();
  });

  it("prefers the featured image, falling back to the banner", () => {
    expect(
      buildLocalPost(post({ featuredImage: "https://x.co/f.jpg", bannerImage: "https://x.co/b.jpg" }))
        .media![0].sourceUrl,
    ).toBe("https://x.co/f.jpg");
    expect(
      buildLocalPost(post({ featuredImage: "/a.svg", bannerImage: "https://x.co/b.jpg" })).media![0]
        .sourceUrl,
    ).toBe("https://x.co/b.jpg");
  });
});

describe("buildLocalPost", () => {
  it("is a STANDARD post with a LEARN_MORE button", () => {
    const p = buildLocalPost(post());

    expect(p.topicType).toBe("STANDARD");
    expect(p.callToAction.actionType).toBe("LEARN_MORE");
    expect(p.languageCode).toBe("en-US");
  });
});

// ── scheduling ────────────────────────────────────────────────────────────────

const q = (slug: string, over: Partial<QueueItem> = {}): QueueItem => ({
  slug,
  status: "queued",
  origin: "backlog",
  postPublishedAt: "2026-09-01T00:00:00Z",
  ...over,
});
const HOURS = 3_600_000;
const now = new Date("2026-10-10T04:00:00Z");

describe("selectToPublish", () => {
  it("publishes new posts immediately, regardless of the backlog gap", () => {
    const queue = [
      q("a", { origin: "backlog", status: "published", publishedAt: new Date(now.getTime() - HOURS) }),
      q("new1", { origin: "new" }),
    ];

    expect(selectToPublish(queue, now).map((x) => x.slug)).toEqual(["new1"]);
  });

  it("releases one backlog post per run, newest first", () => {
    const queue = [
      q("old", { postPublishedAt: "2026-01-01T00:00:00Z" }),
      q("mid", { postPublishedAt: "2026-05-01T00:00:00Z" }),
      q("recent", { postPublishedAt: "2026-09-01T00:00:00Z" }),
    ];

    expect(selectToPublish(queue, now).map((x) => x.slug)).toEqual(["recent"]);
  });

  it("holds the backlog until the gap has passed", () => {
    const recentlyPublished = q("done", {
      status: "published",
      publishedAt: new Date(now.getTime() - 24 * HOURS),
    });

    expect(selectToPublish([recentlyPublished, q("next")], now)).toEqual([]);

    const longAgo = q("done", {
      status: "published",
      publishedAt: new Date(now.getTime() - 100 * HOURS),
    });

    expect(selectToPublish([longAgo, q("next")], now).map((x) => x.slug)).toEqual(["next"]);
  });

  it("caps brand-new posts per run so a bulk import cannot flood the profile", () => {
    const queue = ["a", "b", "c", "d", "e"].map((s) => q(s, { origin: "new" }));

    expect(selectToPublish(queue, now)).toHaveLength(3);
  });

  it("sends new posts and one backlog post together when both are due", () => {
    const queue = [q("fresh", { origin: "new" }), q("back")];

    expect(selectToPublish(queue, now).map((x) => x.slug).sort()).toEqual(["back", "fresh"]);
  });

  it("retries a failed post, but stops after the attempt limit", () => {
    expect(selectToPublish([q("f", { status: "failed", attempts: 1, origin: "new" })], now)).toHaveLength(1);
    expect(selectToPublish([q("f", { status: "failed", attempts: 3, origin: "new" })], now)).toHaveLength(0);
  });

  it("ignores posts that are already published, skipped, or mid-publish", () => {
    const queue = [
      q("a", { status: "published", origin: "new" }),
      q("b", { status: "skipped", origin: "new" }),
      q("c", { status: "publishing", origin: "new" }),
    ];

    expect(selectToPublish(queue, now)).toEqual([]);
  });

  it("an empty queue publishes nothing", () => {
    expect(selectToPublish([], now)).toEqual([]);
  });
});

describe("nextBacklogAt", () => {
  it("is null when nothing is waiting", () => {
    expect(nextBacklogAt([q("a", { status: "published" })], now)).toBeNull();
  });

  it("is now when no backlog post has gone out yet", () => {
    expect(nextBacklogAt([q("a")], now)!.getTime()).toBe(now.getTime());
  });

  it("is one gap after the last backlog post", () => {
    const last = new Date(now.getTime() - 10 * HOURS);
    const at = nextBacklogAt([q("done", { status: "published", publishedAt: last }), q("a")], now)!;

    expect(at.getTime()).toBe(last.getTime() + 84 * HOURS);
  });
});
