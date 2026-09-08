import { describe, it, expect } from "vitest";
import { isPublishable, extractPath, HELD_DRAFT_SLUGS } from "@/lib/indexing/publishable";
import { mapCoverageState, mapBingState } from "@/lib/indexing/coverage";
import { QUOTA_LIMITS, getTodayDateString, getQuotaId } from "@/lib/indexing/quota";

describe("Draft Guard & Publishable Validation", () => {
  it("extractsPath extracts path from absolute URLs and relative paths", () => {
    expect(extractPath("https://uipirate.dev/case-studies/frytx")).toBe("/case-studies/frytx");
    expect(extractPath("https://uipirate.dev/tools/saas/pricing-page-analyzer?query=1")).toBe("/tools/saas/pricing-page-analyzer");
    expect(extractPath("/about")).toBe("/about");
    expect(extractPath("pricing")).toBe("/pricing");
  });

  it("blocks held draft case studies from being submitted", async () => {
    for (const slug of HELD_DRAFT_SLUGS) {
      const result = await isPublishable(`https://uipirate.dev/case-studies/${slug}`);
      expect(result.publishable).toBe(false);
      expect(result.isDraft).toBe(true);
    }
  });

  it("blocks system and admin routes", async () => {
    const adminCheck = await isPublishable("/admin/indexing");
    expect(adminCheck.publishable).toBe(false);
    expect(adminCheck.isDraft).toBe(false);

    const apiCheck = await isPublishable("/api/admin/indexing");
    expect(apiCheck.publishable).toBe(false);
  });

  it("allows standard static live pages", async () => {
    const aboutCheck = await isPublishable("/about");
    expect(aboutCheck.publishable).toBe(true);
    expect(aboutCheck.isDraft).toBe(false);

    const toolsCheck = await isPublishable("/tools/saas/pricing-page-analyzer");
    expect(toolsCheck.publishable).toBe(true);
  });
});

describe("Coverage State Presentation Mapping", () => {
  it("maps indexed states to success tone", () => {
    const s1 = mapCoverageState("Submitted and indexed");
    expect(s1.chipLabel).toBe("Indexed");
    expect(s1.tone).toBe("success");
    expect(s1.actionable).toBe(false);

    const s2 = mapCoverageState(null, "PASS");
    expect(s2.chipLabel).toBe("Indexed");
    expect(s2.tone).toBe("success");
  });

  it("maps crawled not indexed to warning and actionable", () => {
    const s = mapCoverageState("Crawled - currently not indexed");
    expect(s.chipLabel).toBe("Crawled, not indexed");
    expect(s.tone).toBe("warning");
    expect(s.actionable).toBe(true);
  });

  it("maps canonical mismatch", () => {
    const s = mapCoverageState("Duplicate, Google chose different canonical");
    expect(s.chipLabel).toBe("Canonical mismatch");
    expect(s.tone).toBe("warning");
    expect(s.actionable).toBe(true);
  });

  it("maps robots blocked to danger", () => {
    const s = mapCoverageState("Blocked by robots.txt");
    expect(s.chipLabel).toBe("Robots-blocked");
    expect(s.tone).toBe("danger");
    expect(s.actionable).toBe(true);
  });

  it("maps bing indexed states", () => {
    expect(mapBingState(true).chipLabel).toBe("Indexed");
    expect(mapBingState(true).tone).toBe("success");
    expect(mapBingState(false).chipLabel).toBe("Not Indexed");
    expect(mapBingState(false).tone).toBe("warning");
    expect(mapBingState(null).chipLabel).toBe("Unchecked");
  });
});

describe("Quota Configuration", () => {
  it("has the expected daily quotas per plan", () => {
    expect(QUOTA_LIMITS["google-indexing"]).toBe(200);
    expect(QUOTA_LIMITS["google-inspection"]).toBe(2000);
    expect(QUOTA_LIMITS["bing-submit"]).toBe(10000);
  });

  it("formats quota keys correctly", () => {
    const today = getTodayDateString();
    expect(getQuotaId("google-indexing")).toBe(`google-indexing:${today}`);
  });
});
