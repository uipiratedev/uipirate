import { describe, expect, it } from "vitest";

import { buildUtmUrl, slugifyUtm } from "@/lib/analytics/utm";

describe("slugifyUtm", () => {
  it("normalises case, spaces and punctuation", () => {
    expect(slugifyUtm("  Design Tokens Post! ")).toBe("design-tokens-post");
    expect(slugifyUtm("r/DesignSystems")).toBe("r-designsystems");
  });

  it("is empty for junk", () => {
    expect(slugifyUtm("   ")).toBe("");
    expect(slugifyUtm("!!!")).toBe("");
  });
});

describe("buildUtmUrl", () => {
  const base = { source: "Reddit", medium: "social" };

  it("tags an absolute URL", () => {
    expect(
      buildUtmUrl({
        ...base,
        url: "https://uipirate.com/pricing",
        campaign: "Launch",
      }),
    ).toBe(
      "https://uipirate.com/pricing?utm_source=reddit&utm_medium=social&utm_campaign=launch",
    );
  });

  it("resolves a bare path against the site", () => {
    expect(buildUtmUrl({ ...base, url: "/contact" })).toBe(
      "https://uipirate.com/contact?utm_source=reddit&utm_medium=social",
    );
  });

  it("keeps existing query params and replaces existing utm ones", () => {
    const out = buildUtmUrl({
      ...base,
      url: "https://uipirate.com/x?ref=a&utm_source=old",
    })!;
    const u = new URL(out);

    expect(u.searchParams.get("ref")).toBe("a");
    expect(u.searchParams.getAll("utm_source")).toEqual(["reddit"]);
  });

  it("drops optional fields that are blank", () => {
    const out = buildUtmUrl({ ...base, url: "/", campaign: "  " })!;

    expect(out).not.toContain("utm_campaign");
  });

  it("returns null when required input is missing or unusable", () => {
    expect(buildUtmUrl({ ...base, url: "" })).toBeNull();
    expect(buildUtmUrl({ source: "", medium: "social", url: "/" })).toBeNull();
    expect(buildUtmUrl({ source: "x", medium: "", url: "/" })).toBeNull();
    expect(buildUtmUrl({ ...base, url: "not a url" })).toBeNull();
  });

  it("refuses non-http schemes", () => {
    expect(buildUtmUrl({ ...base, url: "javascript:alert(1)" })).toBeNull();
    expect(buildUtmUrl({ ...base, url: "mailto:a@b.co" })).toBeNull();
  });
});
