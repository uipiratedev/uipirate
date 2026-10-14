import { describe, expect, it } from "vitest";

import { sheetToRows } from "@/lib/marketing/parseSheet";
import { normalizeWebsiteState } from "@/lib/marketing/constants";

const CSV = `Company Name,Category / Specialty,City,State,Phone,Email,Website,Has Website,Pitch Hook Angle
EcoPackables,"Plant-based, home-compostable mailers",Vista,California,+1 (619) 494-0061,Info@ecopackables.com,https://www.ecopackables.com,Has Website,Pitch calculator
Lau's Packaging Inc.,Poly bags,Hayward,California,+1 (760) 672-1126,larry@lauspkg.com,https://lauspkg.com,,Pitch tiers
IMPAK,Barrier,Los Angeles,California,+1 (310) 715-6600,x@impak.com,https://impak.com,can need redesign,Pitch builder`;

describe("sheetToRows", () => {
  it("maps the outreach sheet columns", () => {
    const rows = sheetToRows(CSV);

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({
      name: "EcoPackables",
      category: "Plant-based, home-compostable mailers",
      city: "Vista",
      phone: "+1 (619) 494-0061",
      hasWebsite: "Has Website",
      pitch: "Pitch calculator",
    });
    expect(rows[1].hasWebsite).toBeUndefined();
  });
});

describe("normalizeWebsiteState", () => {
  it("normalises sheet values", () => {
    expect(normalizeWebsiteState("Has Website")).toBe("has-website");
    expect(normalizeWebsiteState("No website")).toBe("no-website");
    expect(normalizeWebsiteState("can need redesign")).toBe("needs-redesign");
    expect(normalizeWebsiteState("Privacy error")).toBe("privacy-error");
    expect(normalizeWebsiteState("SSL Error")).toBe("privacy-error");
    expect(normalizeWebsiteState("")).toBe("");
    expect(normalizeWebsiteState(undefined)).toBe("");
  });
});
