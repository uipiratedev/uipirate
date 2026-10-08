import { describe, expect, it } from "vitest";

import {
  absoluteImageUrl,
  buildCtaUrl,
  buildLocalPost,
  buildSummary,
  eligibility,
  ogCardUrl,
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

  it("falls back to the generated card so no post goes out as bare text", () => {
    expect(buildLocalPost(post()).media).toEqual([
      {
        mediaFormat: "PHOTO",
        sourceUrl: "https://uipirate.com/design-tokens/opengraph-image/design-tokens",
      },
    ]);
  });

  it("uses the card when the only image is an unusable svg placeholder", () => {
    expect(
      buildLocalPost(post({ featuredImage: "/assets/blog-banner-default.svg" })).media![0].sourceUrl,
    ).toContain("/opengraph-image/");
  });

  it("builds the card url under the route each post type actually lives at", () => {
    expect(ogCardUrl({ slug: "a", postType: "case-study" })).toBe(
      "https://uipirate.com/case-studies/a/opengraph-image/a",
    );
    expect(ogCardUrl({ slug: "a", postType: "concept" })).toBe(
      "https://uipirate.com/concepts/a/opengraph-image/a",
    );
    expect(ogCardUrl({ slug: "a", postType: "tutorial" })).toBe(
      "https://uipirate.com/a/opengraph-image/a",
    );
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

describe("overview text", () => {
  it("replaces the excerpt, keeping bullet line breaks", () => {
    const s = buildSummary(post({ overview: "Intro line.\n- one\n- two" }));

    expect(s).toBe("Design Tokens: How to Build a Token System\n\nIntro line.\n- one\n- two");
  });

  it("strips links from an overview and stays within Google's limit", () => {
    const s = buildSummary(post({ overview: `See https://x.co/a ${"word ".repeat(600)}` }));

    expect(s).not.toMatch(/https?:/);
    expect(s.length).toBeLessThanOrEqual(1500);
  });
});

describe("cleanOverview", () => {
  it("removes markdown, links and caps length at a sentence", async () => {
    const { cleanOverview, OVERVIEW_MAX } = await import("@/lib/gbp/overview");
    const out = cleanOverview(`**Bold** text https://a.co ${"Sentence one here. ".repeat(100)}`);

    expect(out).not.toMatch(/\*|https?:/);
    expect(out.length).toBeLessThanOrEqual(OVERVIEW_MAX);
    expect(out.endsWith(".")).toBe(true);
  });
});

describe("several images per post", () => {
  it("sends up to three: featured, banner, then pictures from the article", () => {
    const media = buildLocalPost(
      post({
        featuredImage: "https://x.co/a.jpg",
        bannerImage: "https://x.co/b.jpg",
        content: '<p>hi</p><img src="https://x.co/c.png"><img src="https://x.co/d.png">',
      }),
    ).media!;

    expect(media.map((m) => m.sourceUrl)).toEqual([
      "https://x.co/a.jpg",
      "https://x.co/b.jpg",
      "https://x.co/c.png",
    ]);
  });

  it("skips repeats and anything Google cannot use", () => {
    const media = buildLocalPost(
      post({
        featuredImage: "https://x.co/a.jpg",
        content:
          '<img src="https://x.co/a.jpg"><img src="data:image/png;base64,AAAA"><img src="/x.svg"><img src=\'https://x.co/e.jpg\'>',
      }),
    ).media!;

    expect(media.map((m) => m.sourceUrl)).toEqual(["https://x.co/a.jpg", "https://x.co/e.jpg"]);
  });

  it("falls back to the generated card when the post has no usable photo", () => {
    expect(buildLocalPost(post({ content: "<p>text only</p>" })).media).toHaveLength(1);
  });
});

describe("planServices", () => {
  const free = (n: string, d?: string) => ({
    freeFormServiceItem: { category: "categories/gcid:website_designer", label: { displayName: n, description: d } },
  });
  const std = { structuredServiceItem: { serviceTypeId: "job_type_id:web_design" } };

  it("by default keeps everything already listed and only adds the site's services", async () => {
    const { planServices, SITE_SERVICES } = await import("@/lib/gbp/profile");
    const mine = free("UI/UX", "per Hour");
    const plan = planServices([std, mine, free("UX Designer")]);

    expect(plan.remove).toEqual([]);
    expect(plan.add).toHaveLength(SITE_SERVICES.length);
    expect(plan.next).toContain(mine);
    expect(plan.next).toHaveLength(1 + 2 + SITE_SERVICES.length);
    expect(plan.add.map((s) => s.name)).toContain("Design Subscription");
  });

  it("describes existing entries that have no description, and leaves written ones alone", async () => {
    const { planServices } = await import("@/lib/gbp/profile");
    const plan = planServices([
      free("UX Designer"),
      free("UI/UX", "per Hour"),
      { structuredServiceItem: { serviceTypeId: "job_type_id:html" } },
    ]);
    const labels = plan.next
      .filter((s) => s.freeFormServiceItem)
      .map((s) => [s.freeFormServiceItem!.label.displayName, s.freeFormServiceItem!.label.description]);

    expect(plan.described).toEqual(expect.arrayContaining(["html", "UX Designer"]));
    expect(plan.described).not.toContain("UI/UX");
    expect(labels).toContainEqual(["UI/UX", "per Hour"]);
    expect(labels.find(([n]) => n === "UX Designer")![1]).toMatch(/wireframes/);
    // Nothing the listing already had is dropped.
    expect(plan.next.length).toBeGreaterThanOrEqual(3);
  });

  it("every existing entry and standard service we know has a usable description", async () => {
    const { EXISTING_DESCRIPTIONS, STANDARD_DESCRIPTIONS } = await import("@/lib/gbp/profile");

    for (const d of [...Object.values(EXISTING_DESCRIPTIONS), ...Object.values(STANDARD_DESCRIPTIONS)])
      expect(d.length).toBeGreaterThan(150), expect(d.length).toBeLessThanOrEqual(300);
  });

  it("prices only what the pricing page prices, in the format Google expects", async () => {
    const { planServices } = await import("@/lib/gbp/profile");
    const items = planServices([]).next.filter((s) => s.freeFormServiceItem);
    const priced = Object.fromEntries(
      items
        .filter((s) => s.price)
        .map((s) => [s.freeFormServiceItem!.label.displayName, s.price]),
    );

    expect(priced).toEqual({
      "UX & UI Design": { currencyCode: "USD", units: "499" },
      "Full Stack Development": { currencyCode: "USD", units: "499" },
      "SaaS Development": { currencyCode: "USD", units: "499" },
      "Landing Pages": { currencyCode: "USD", units: "2000" },
      "Business Websites": { currencyCode: "USD", units: "2000" },
      "Design Subscription": { currencyCode: "USD", units: "499" },
      "5-Day Design Pilot": { currencyCode: "USD", units: "150" },
      "5-Day Development Pilot": { currencyCode: "USD", units: "250" },
      "5-Day Design + Dev Pilot": { currencyCode: "USD", units: "350" },
      "Custom Project": { currencyCode: "USD", units: "2000" },
    });
  });

  it("leaves the price on an existing entry untouched", async () => {
    const { planServices } = await import("@/lib/gbp/profile");
    const mine = { ...free("UI/UX", "per Hour"), price: { currencyCode: "INR", units: "1200" } };

    expect(planServices([mine]).next).toContain(mine);
  });

  it("refresh replaces earlier short text, but a plain run never overwrites it", async () => {
    const { planServices, SITE_SERVICES, STANDARD_DESCRIPTIONS } = await import("@/lib/gbp/profile");
    const oldStd = { structuredServiceItem: { serviceTypeId: "job_type_id:web_design", description: "Short." } };
    const oldFree = free("UX Designer", "Short.");
    const oldSite = free("UX Audits", "Short.");

    const plain = planServices([oldStd, oldFree, oldSite]);

    expect(plain.described).toEqual([]);
    expect(plain.next[0]).toBe(oldStd);

    const fresh = planServices([oldStd, oldFree, oldSite], SITE_SERVICES, { refresh: true });
    const text = (n: string) =>
      fresh.next.find((s) => s.freeFormServiceItem?.label.displayName === n)!.freeFormServiceItem!.label
        .description;

    expect(fresh.next[0].structuredServiceItem?.description).toBe(STANDARD_DESCRIPTIONS.web_design);
    expect(text("UX Designer")).toMatch(/wireframes/);
    expect(text("UX Audits")).toMatch(/heuristic/i);
    // Replaced, never duplicated.
    expect(fresh.next.filter((s) => s.freeFormServiceItem?.label.displayName === "UX Audits")).toHaveLength(1);
  });

  it("does not add a service the listing already has", async () => {
    const { planServices, SITE_SERVICES } = await import("@/lib/gbp/profile");
    const plan = planServices([free("Design Subscription", "My own wording")]);

    expect(plan.add).toHaveLength(SITE_SERVICES.length - 1);
    expect(plan.same).toEqual(["Design Subscription"]);
  });

  it("with prune, keeps standard services and replaces free-form ones with the site's", async () => {
    const { planServices, SITE_SERVICES } = await import("@/lib/gbp/profile");
    const plan = planServices([std, free("UI Developement"), free("UX Designer")], SITE_SERVICES, {
      prune: true,
    });

    expect(plan.keep).toEqual(["web_design"]);
    expect(plan.remove).toEqual(["UI Developement", "UX Designer"]);
    expect(plan.add).toHaveLength(SITE_SERVICES.length);
    expect(plan.described).toContain("web_design");
    expect(plan.next[0].structuredServiceItem?.description).toMatch(/website/i);
    expect(plan.next).toHaveLength(1 + SITE_SERVICES.length);
  });

  it("never overwrites a description that is already set", async () => {
    const { planServices } = await import("@/lib/gbp/profile");
    const own = { structuredServiceItem: { serviceTypeId: "job_type_id:web_design", description: "Mine" } };
    const plan = planServices([own]);

    expect(plan.described).toEqual([]);
    expect(plan.next[0].structuredServiceItem?.description).toBe("Mine");
  });

  it("reports nothing to do once the listing matches", async () => {
    const { planServices, SITE_SERVICES } = await import("@/lib/gbp/profile");
    const matching = SITE_SERVICES.map((s) => free(s.name, s.description));
    const html = { structuredServiceItem: { serviceTypeId: "job_type_id:html", description: "Done" } };
    const plan = planServices([html, ...matching]);

    expect(plan.described).toEqual([]);
    expect(plan.remove).toEqual([]);
    expect(plan.add).toEqual([]);
  });

  it("respects Google's length limits", async () => {
    const { SITE_SERVICES } = await import("@/lib/gbp/profile");

    for (const s of SITE_SERVICES) {
      expect(s.name.length).toBeLessThanOrEqual(140);
      expect(s.description.length).toBeLessThanOrEqual(300);
      expect(s.description.length).toBeGreaterThan(150);
    }
  });
});

describe("planLinks", () => {
  const attr = (n: string, ...uris: string[]) => ({ name: `attributes/${n}`, valueType: "URL", uriValues: uris.map((uri) => ({ uri })) });

  it("adds the site's links and writes only those attributes", async () => {
    const { planLinks } = await import("@/lib/gbp/attributes");
    const plan = planLinks([attr("url_whatsapp", "https://wa.me/1")]);

    expect(plan.add.map((l) => l.attr)).toEqual(["url_appointment", "url_linkedin", "url_twitter"]);
    expect(plan.mask).toEqual(["attributes/url_appointment", "attributes/url_linkedin", "attributes/url_twitter"]);
    // WhatsApp is never part of what is written.
    expect(plan.attributes.some((a) => a.name.includes("whatsapp"))).toBe(false);
  });

  it("puts both booking links in one attribute, not two", async () => {
    const { planLinks } = await import("@/lib/gbp/attributes");
    const plan = planLinks([]);
    const book = plan.attributes.filter((a) => a.name.endsWith("url_appointment"));

    expect(book).toHaveLength(1);
    expect(book[0].uriValues!.map((u) => u.uri)).toEqual([
      "https://cal.com/ui-pirate/15min",
      "https://uipirate.com/contact",
    ]);
  });

  it("only adds the booking link that is missing", async () => {
    const { planLinks } = await import("@/lib/gbp/attributes");
    const plan = planLinks([attr("url_appointment", "https://cal.com/ui-pirate/15min/")]);
    const book = plan.attributes.find((a) => a.name.endsWith("url_appointment"))!;

    expect(book.uriValues!.map((u) => u.uri)).toEqual([
      "https://cal.com/ui-pirate/15min/",
      "https://uipirate.com/contact",
    ]);
  });

  it("treats a trailing slash or letter case as the same link", async () => {
    const { planLinks } = await import("@/lib/gbp/attributes");
    const plan = planLinks([attr("url_twitter", "https://X.com/UI_Pirate/")]);

    expect(plan.same.map((l) => l.attr)).toEqual(["url_twitter"]);
    expect(plan.mask).not.toContain("attributes/url_twitter");
  });

  it("keeps other booking links and replaces a different social link", async () => {
    const { planLinks } = await import("@/lib/gbp/attributes");
    const plan = planLinks([
      attr("url_appointment", "https://other.example/book"),
      attr("url_linkedin", "https://www.linkedin.com/in/someone-else"),
    ]);
    const book = plan.attributes.find((a) => a.name.endsWith("url_appointment"))!;
    const li = plan.attributes.find((a) => a.name.endsWith("url_linkedin"))!;

    expect(book.uriValues!.map((u) => u.uri)).toEqual([
      "https://other.example/book",
      "https://cal.com/ui-pirate/15min",
      "https://uipirate.com/contact",
    ]);
    expect(li.uriValues).toHaveLength(1);
    expect(li.uriValues![0].uri).toContain("company/ui-pirate");
  });
});

describe("performance summary", () => {
  it("adds up impressions across surfaces and reads the other metrics", async () => {
    const { summarise } = await import("@/lib/gbp/performance");
    const d = (day: number, value: string) => ({ date: { year: 2026, month: 9, day }, value });
    const s = summarise(
      {
        multiDailyMetricTimeSeries: [
          {
            dailyMetricTimeSeries: [
              { dailyMetric: "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH", timeSeries: { datedValues: [d(1, "10"), d(2, "5")] } },
              { dailyMetric: "BUSINESS_IMPRESSIONS_MOBILE_MAPS", timeSeries: { datedValues: [d(1, "7")] } },
              { dailyMetric: "WEBSITE_CLICKS", timeSeries: { datedValues: [d(1, "3"), d(2, "1")] } },
              { dailyMetric: "CALL_CLICKS", timeSeries: { datedValues: [d(2)] } },
            ],
          },
        ],
      } as never,
      "2026-09-01",
      "2026-09-02",
    );

    expect(s.views).toBe(22);
    expect(s.websiteClicks).toBe(4);
    expect(s.calls).toBe(0);
    expect(s.daily).toEqual([
      { date: "2026-09-01", views: 17, websiteClicks: 3 },
      { date: "2026-09-02", views: 5, websiteClicks: 1 },
    ]);
  });
});
