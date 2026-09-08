import { describe, it, expect } from "vitest";
import {
  normalizeGscCountry,
  getSearchIntelligence,
} from "@/lib/analytics/searchConsole";

describe("normalizeGscCountry", () => {
  it("normalizes GSC 3-letter country codes to friendly names", () => {
    expect(normalizeGscCountry("ind")).toEqual({
      code: "IND",
      name: "India",
    });
    expect(normalizeGscCountry("usa")).toEqual({
      code: "USA",
      name: "United States",
    });
    expect(normalizeGscCountry("gbr")).toEqual({
      code: "GBR",
      name: "United Kingdom",
    });
    expect(normalizeGscCountry("deu")).toEqual({
      code: "DEU",
      name: "Germany",
    });
  });

  it("handles standard 2-letter codes gracefully", () => {
    expect(normalizeGscCountry("US")).toEqual({
      code: "US",
      name: "United States",
    });
    expect(normalizeGscCountry("IN")).toEqual({
      code: "IN",
      name: "India",
    });
  });

  it("handles unknown/empty codes", () => {
    expect(normalizeGscCountry("")).toEqual({
      code: "UNK",
      name: "Unknown",
    });
  });
});

describe("getSearchIntelligence", () => {
  it("returns structured search intelligence dataset", async () => {
    const data = await getSearchIntelligence({
      from: "2026-09-01T00:00:00.000Z",
      to: "2026-09-08T00:00:00.000Z",
      engine: "all",
    });

    expect(data.kpis).toBeDefined();
    expect(data.kpis.totalClicks).toBeGreaterThan(0);
    expect(data.kpis.totalImpressions).toBeGreaterThan(0);
    expect(data.queries.length).toBeGreaterThan(0);
    expect(data.countries.length).toBeGreaterThan(0);
    expect(data.pages.length).toBeGreaterThan(0);
  });

  it("filters search queries by engine", async () => {
    const googleData = await getSearchIntelligence({
      from: "2026-09-01T00:00:00.000Z",
      to: "2026-09-08T00:00:00.000Z",
      engine: "google",
    });

    for (const q of googleData.queries) {
      expect(q.engine).toBe("google");
    }

    const bingData = await getSearchIntelligence({
      from: "2026-09-01T00:00:00.000Z",
      to: "2026-09-08T00:00:00.000Z",
      engine: "bing",
    });

    for (const q of bingData.queries) {
      expect(q.engine).toBe("bing");
    }
  });
});
