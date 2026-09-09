import { getGoogleAccessToken, getParsedServiceAccount } from "@/lib/indexing/auth";
import { getGscSiteUrl } from "@/lib/indexing/google";
import { getBingApiKey, getSiteOrigin } from "@/lib/indexing/bing";
import { COUNTRY_CODE_TO_NAME } from "./ip";

export interface SearchQueryItem {
  query: string;
  engine: "google" | "bing" | "all";
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  country?: string;
  countryCode?: string;
  page?: string;
}

export interface SearchCountryItem {
  countryCode: string;
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchPageItem {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchAnalyticsResult {
  range: { from: string; to: string };
  engine: "google" | "bing" | "all";
  kpis: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    googleClicks: number;
    bingClicks: number;
  };
  queries: SearchQueryItem[];
  countries: SearchCountryItem[];
  pages: SearchPageItem[];
  series: Array<{
    date: string;
    clicks: number;
    impressions: number;
  }>;
  mocked?: boolean;
}

// 3-letter ISO code to 2-letter standard mapping used by GSC
const ISO3_TO_NAME: Record<string, string> = {
  ind: "India",
  usa: "United States",
  gbr: "United Kingdom",
  can: "Canada",
  deu: "Germany",
  fra: "France",
  aus: "Australia",
  jpn: "Japan",
  sgp: "Singapore",
  are: "United Arab Emirates",
  nld: "Netherlands",
  ita: "Italy",
  esp: "Spain",
  bra: "Brazil",
  che: "Switzerland",
  swe: "Sweden",
  pol: "Poland",
  irl: "Ireland",
  rus: "Russia",
  kor: "South Korea",
  chn: "China",
  hkg: "Hong Kong",
  twn: "Taiwan",
  nzl: "New Zealand",
  zaf: "South Africa",
  mex: "Mexico",
  arg: "Argentina",
  pak: "Pakistan",
  bgd: "Bangladesh",
  idn: "Indonesia",
  phl: "Philippines",
  vnm: "Vietnam",
  tha: "Thailand",
  isr: "Israel",
  tur: "Turkey",
  bel: "Belgium",
  aut: "Austria",
  nor: "Norway",
  dnk: "Denmark",
  fin: "Finland",
  prt: "Portugal",
  grc: "Greece",
  cze: "Czech Republic",
  rou: "Romania",
  hun: "Hungary",
  mys: "Malaysia",
  sau: "Saudi Arabia",
  egy: "Egypt",
  nga: "Nigeria",
  ken: "Kenya",
  col: "Colombia",
  chl: "Chile",
  per: "Peru",
  ukr: "Ukraine",
};

export function normalizeGscCountry(code?: string): { code: string; name: string } {
  if (!code) return { code: "UNK", name: "Unknown" };
  const lower = code.toLowerCase();
  const upper = code.toUpperCase();

  if (ISO3_TO_NAME[lower]) {
    return { code: upper, name: ISO3_TO_NAME[lower] };
  }
  if (COUNTRY_CODE_TO_NAME[upper]) {
    return { code: upper, name: COUNTRY_CODE_TO_NAME[upper] };
  }

  return { code: upper, name: upper };
}

/**
 * Queries Google Search Console Search Analytics API.
 */
export async function queryGoogleSearchAnalytics(params: {
  startDate: string;
  endDate: string;
  dimensions?: Array<"query" | "country" | "page" | "date">;
  dimension?: "query" | "country" | "page" | "date";
  rowLimit?: number;
}): Promise<any[]> {
  const token = await getGoogleAccessToken([
    "https://www.googleapis.com/auth/webmasters.readonly",
  ]);

  if (!token) return [];

  const siteUrl = getGscSiteUrl();
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const dimensions =
    params.dimensions || (params.dimension ? [params.dimension] : ["query"]);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: params.startDate,
        endDate: params.endDate,
        dimensions,
        rowLimit: params.rowLimit || 100,
      }),
    });

    if (!res.ok) return [];
    const json = await res.json();
    return json?.rows || [];
  } catch {
    return [];
  }
}

/**
 * Parses Bing API date format "/Date(1725580800000)/" or "/Date(1725580800000-0700)/" into "YYYY-MM-DD"
 */
export function parseBingDate(dateStr?: string): string {
  if (!dateStr) return "";
  const match = dateStr.match(/\d+/);
  if (!match) return "";
  const ms = parseInt(match[0], 10);
  if (isNaN(ms)) return "";
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * Queries Bing Webmaster Tools API for search keyword stats.
 */
export async function queryBingSearchAnalytics(): Promise<any[]> {
  const apiKey = getBingApiKey();
  if (!apiKey) return [];

  const defaultUrl = getSiteOrigin();
  const candidateUrls = [
    defaultUrl,
    "https://www.uipirate.com/",
    "https://uipirate.com/",
    "https://www.uipirate.com",
    "https://uipirate.com",
  ];

  // Try candidate URLs
  for (const siteUrl of candidateUrls) {
    try {
      const res = await fetch(
        `https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(siteUrl)}`,
      );

      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.d) && json.d.length > 0) {
          return json.d;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  // Fallback: Query GetUserSites to retrieve verified site list
  try {
    const sitesRes = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/GetUserSites?apikey=${encodeURIComponent(apiKey)}`,
    );
    if (sitesRes.ok) {
      const sitesJson = await sitesRes.json();
      const siteList = sitesJson?.d || [];
      for (const s of siteList) {
        const discoveredUrl = s.Url || s.url;
        if (!discoveredUrl) continue;
        const res = await fetch(
          `https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(discoveredUrl)}`,
        );
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json?.d)) {
            return json.d;
          }
        }
      }
    }
  } catch {
    // Return empty on failure
  }

  return [];
}

/**
 * Queries Bing Webmaster Tools API for historical daily rank and traffic stats.
 */
export async function queryBingRankAndTrafficStats(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<Array<{ date: string; clicks: number; impressions: number }>> {
  const apiKey = getBingApiKey();
  if (!apiKey) return [];

  const defaultUrl = getSiteOrigin();
  const candidateUrls = [
    defaultUrl,
    "https://www.uipirate.com/",
    "https://uipirate.com/",
  ];

  for (const siteUrl of candidateUrls) {
    try {
      const res = await fetch(
        `https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(siteUrl)}`,
      );
      if (res.ok) {
        const json = await res.json();
        const allStats = json?.d || [];
        if (Array.isArray(allStats) && allStats.length > 0) {
          return allStats
            .map((s: any) => ({
              date: parseBingDate(s.Date),
              clicks: Number(s.Clicks) || 0,
              impressions: Number(s.Impressions) || 0,
            }))
            .filter((s) => {
              if (!s.date) return false;
              if (params?.startDate && s.date < params.startDate) return false;
              if (params?.endDate && s.date > params.endDate) return false;
              return true;
            })
            .sort((a, b) => a.date.localeCompare(b.date));
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return [];
}

/**
 * Queries Bing Webmaster Tools API for page-level traffic stats.
 */
export async function queryBingPageStats(): Promise<any[]> {
  const apiKey = getBingApiKey();
  if (!apiKey) return [];

  const defaultUrl = getSiteOrigin();
  const candidateUrls = [
    defaultUrl,
    "https://www.uipirate.com/",
    "https://uipirate.com/",
  ];

  for (const siteUrl of candidateUrls) {
    try {
      const res = await fetch(
        `https://ssl.bing.com/webmaster/api.svc/json/GetPageStats?apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(siteUrl)}`,
      );
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json?.d) && json.d.length > 0) {
          return json.d;
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return [];
}

/**
 * Returns mock search intelligence data for development when API keys are unconfigured.
 */
function getMockSearchAnalytics(
  from: string,
  to: string,
  engine: "google" | "bing" | "all",
): SearchAnalyticsResult {
  const allMockQueries: SearchQueryItem[] = [
    {
      query: "tailwind button components",
      engine: "google",
      clicks: 1420,
      impressions: 28400,
      ctr: 0.05,
      position: 2.3,
      page: "/componentlab/buttons",
    },
    {
      query: "animated ui components react",
      engine: "google",
      clicks: 980,
      impressions: 16500,
      ctr: 0.059,
      position: 3.1,
      page: "/componentlab",
    },
    {
      query: "modern web design agency",
      engine: "bing",
      clicks: 640,
      impressions: 12200,
      ctr: 0.052,
      position: 1.8,
      page: "/",
    },
    {
      query: "color palette generator tailwind",
      engine: "google",
      clicks: 530,
      impressions: 9800,
      ctr: 0.054,
      position: 4.2,
      page: "/tools",
    },
    {
      query: "nextjs animation examples",
      engine: "google",
      clicks: 410,
      impressions: 8100,
      ctr: 0.051,
      position: 3.9,
      page: "/componentlab/cards",
    },
    {
      query: "fintech case study website design",
      engine: "bing",
      clicks: 310,
      impressions: 5400,
      ctr: 0.057,
      position: 2.1,
      page: "/case-studies",
    },
    {
      query: "saas pricing table design",
      engine: "google",
      clicks: 280,
      impressions: 6200,
      ctr: 0.045,
      position: 5.1,
      page: "/pricing",
    },
    {
      query: "box shadow generator css",
      engine: "google",
      clicks: 240,
      impressions: 4800,
      ctr: 0.05,
      position: 4.8,
      page: "/tools",
    },
  ];

  const mockQueries = allMockQueries.filter((q) =>
    engine === "all" ? true : q.engine === engine,
  );

  const mockCountries: SearchCountryItem[] = [
    {
      countryCode: "USA",
      country: "United States",
      clicks: 2150,
      impressions: 38200,
      ctr: 0.056,
      position: 2.8,
    },
    {
      countryCode: "IND",
      country: "India",
      clicks: 1420,
      impressions: 26400,
      ctr: 0.054,
      position: 3.1,
    },
    {
      countryCode: "GBR",
      country: "United Kingdom",
      clicks: 680,
      impressions: 11900,
      ctr: 0.057,
      position: 2.9,
    },
    {
      countryCode: "DEU",
      country: "Germany",
      clicks: 430,
      impressions: 8200,
      ctr: 0.052,
      position: 3.4,
    },
    {
      countryCode: "CAN",
      country: "Canada",
      clicks: 390,
      impressions: 7100,
      ctr: 0.055,
      position: 3.0,
    },
    {
      countryCode: "AUS",
      country: "Australia",
      clicks: 290,
      impressions: 5400,
      ctr: 0.054,
      position: 3.2,
    },
  ];

  const mockPages: SearchPageItem[] = [
    {
      page: "/componentlab",
      clicks: 2400,
      impressions: 44900,
      ctr: 0.053,
      position: 2.7,
    },
    {
      page: "/componentlab/buttons",
      clicks: 1420,
      impressions: 28400,
      ctr: 0.05,
      position: 2.3,
    },
    {
      page: "/",
      clicks: 950,
      impressions: 17600,
      ctr: 0.054,
      position: 2.0,
    },
    {
      page: "/tools",
      clicks: 770,
      impressions: 14600,
      ctr: 0.053,
      position: 4.5,
    },
    {
      page: "/case-studies",
      clicks: 310,
      impressions: 5400,
      ctr: 0.057,
      position: 2.1,
    },
    {
      page: "/pricing",
      clicks: 280,
      impressions: 6200,
      ctr: 0.045,
      position: 5.1,
    },
  ];

  const totalClicks = mockQueries.reduce((sum, q) => sum + q.clicks, 0);
  const totalImpressions = mockQueries.reduce((sum, q) => sum + q.impressions, 0);
  const googleClicks = mockQueries
    .filter((q) => q.engine === "google")
    .reduce((sum, q) => sum + q.clicks, 0);
  const bingClicks = mockQueries
    .filter((q) => q.engine === "bing")
    .reduce((sum, q) => sum + q.clicks, 0);

  return {
    range: { from, to },
    engine,
    kpis: {
      totalClicks,
      totalImpressions,
      avgCtr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
      avgPosition: 3.1,
      googleClicks,
      bingClicks,
    },
    queries: mockQueries,
    countries: mockCountries,
    pages: mockPages,
    series: [
      { date: "2026-09-02", clicks: 420, impressions: 7800 },
      { date: "2026-09-03", clicks: 490, impressions: 8900 },
      { date: "2026-09-04", clicks: 580, impressions: 10400 },
      { date: "2026-09-05", clicks: 610, impressions: 11200 },
      { date: "2026-09-06", clicks: 730, impressions: 13100 },
      { date: "2026-09-07", clicks: 840, impressions: 15600 },
      { date: "2026-09-08", clicks: 910, impressions: 16800 },
    ],
    mocked: true,
  };
}

/**
 * Main aggregator for Search Console & Bing Webmaster Search Intelligence.
 */
export async function getSearchIntelligence(params: {
  from: string;
  to: string;
  engine?: "google" | "bing" | "all";
}): Promise<SearchAnalyticsResult> {
  const engine = params.engine || "all";
  const startDate = params.from.slice(0, 10);
  const endDate = params.to.slice(0, 10);

  // Check if live API calls should be made
  const hasGoogle = Boolean(getParsedServiceAccount());
  const hasBing = Boolean(getBingApiKey());

  if (!hasGoogle && !hasBing) {
    return getMockSearchAnalytics(params.from, params.to, engine);
  }

  const [gscQueries, gscCountries, gscPages, gscDates, bingQueries, bingPages, bingDailyStats] =
    await Promise.all([
      hasGoogle && (engine === "all" || engine === "google")
        ? queryGoogleSearchAnalytics({
            startDate,
            endDate,
            dimensions: ["query", "country", "page"],
            rowLimit: 250,
          })
        : Promise.resolve([]),
      hasGoogle && (engine === "all" || engine === "google")
        ? queryGoogleSearchAnalytics({ startDate, endDate, dimension: "country", rowLimit: 50 })
        : Promise.resolve([]),
      hasGoogle && (engine === "all" || engine === "google")
        ? queryGoogleSearchAnalytics({ startDate, endDate, dimension: "page", rowLimit: 50 })
        : Promise.resolve([]),
      hasGoogle && (engine === "all" || engine === "google")
        ? queryGoogleSearchAnalytics({ startDate, endDate, dimension: "date", rowLimit: 120 })
        : Promise.resolve([]),
      hasBing && (engine === "all" || engine === "bing")
        ? queryBingSearchAnalytics()
        : Promise.resolve([]),
      hasBing && (engine === "all" || engine === "bing")
        ? queryBingPageStats()
        : Promise.resolve([]),
      hasBing && (engine === "all" || engine === "bing")
        ? queryBingRankAndTrafficStats({ startDate, endDate })
        : Promise.resolve([]),
    ]);

  const queries: SearchQueryItem[] = [];

  for (const r of gscQueries) {
    const rawCountry = r.keys?.[1];
    const norm = normalizeGscCountry(rawCountry);
    queries.push({
      query: r.keys?.[0] || "(unknown)",
      engine: "google",
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: r.ctr || 0,
      position: Math.round((r.position || 0) * 10) / 10,
      country: norm.name,
      countryCode: norm.code,
      page: r.keys?.[2] || "/",
    });
  }

  // Filter & aggregate Bing keywords — strictly respect the selected date range.
  const bingQueryMap = new Map<string, SearchQueryItem>();
  for (const r of bingQueries) {
    const itemDate = parseBingDate(r.Date);
    // Skip entries that fall outside the selected range. Bing GetQueryStats
    // rows always carry a Date, so an out-of-range window (e.g. last 24h with
    // no Bing activity) correctly yields zero.
    if (!itemDate || itemDate < startDate || itemDate > endDate) continue;

    const rawQuery = (r.Query || r.query || "").trim();
    if (!rawQuery) continue;

    const existing = bingQueryMap.get(rawQuery.toLowerCase());
    const clicks = r.Clicks || r.clicks || 0;
    const impressions = r.Impressions || r.impressions || 0;
    const rawPos = r.AvgImpressionPosition || r.position || 0;
    const position = rawPos > 0 ? rawPos : 1;

    if (existing) {
      existing.clicks += clicks;
      existing.impressions += impressions;
      existing.ctr = existing.impressions > 0 ? existing.clicks / existing.impressions : 0;
      existing.position = Math.round(((existing.position + position) / 2) * 10) / 10;
    } else {
      bingQueryMap.set(rawQuery.toLowerCase(), {
        query: rawQuery,
        engine: "bing",
        clicks,
        impressions,
        ctr: impressions > 0 ? clicks / impressions : 0,
        position: Math.round(position * 10) / 10,
      });
    }
  }

  for (const bq of bingQueryMap.values()) {
    queries.push(bq);
  }

  // Sort queries by clicks descending, then impressions descending
  queries.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  // Countries
  const countries: SearchCountryItem[] = gscCountries
    .map((r) => {
      const raw = r.keys?.[0] || "";
      const norm = normalizeGscCountry(raw);
      return {
        countryCode: norm.code,
        country: norm.name,
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: r.ctr || 0,
        position: Math.round((r.position || 0) * 10) / 10,
      };
    })
    .sort((a, b) => b.clicks - a.clicks);

  // Pages from GSC and Bing
  const pageMap = new Map<string, SearchPageItem>();
  for (const r of gscPages) {
    let p = r.keys?.[0] || "/";
    try {
      if (p.startsWith("http://") || p.startsWith("https://")) {
        p = new URL(p).pathname;
      }
    } catch {
      // keep p
    }
    const clicks = r.clicks || 0;
    const impressions = r.impressions || 0;
    const ctr = r.ctr || 0;
    const position = Math.round((r.position || 0) * 10) / 10;
    pageMap.set(p, { page: p, clicks, impressions, ctr, position });
  }

  for (const bp of bingPages) {
    let rawUrl = bp.Query || bp.query || "/";
    try {
      if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
        rawUrl = new URL(rawUrl).pathname;
      }
    } catch {
      // keep rawUrl
    }
    const clicks = bp.Clicks || bp.clicks || 0;
    const impressions = bp.Impressions || bp.impressions || 0;
    const rawPos = bp.AvgImpressionPosition || bp.position || 0;
    const position = Math.round((rawPos > 0 ? rawPos : 1) * 10) / 10;

    const existing = pageMap.get(rawUrl);
    if (existing) {
      existing.clicks += clicks;
      existing.impressions += impressions;
      existing.ctr = existing.impressions > 0 ? existing.clicks / existing.impressions : 0;
      existing.position = Math.round(((existing.position + position) / 2) * 10) / 10;
    } else {
      pageMap.set(rawUrl, {
        page: rawUrl,
        clicks,
        impressions,
        ctr: impressions > 0 ? clicks / impressions : 0,
        position,
      });
    }
  }

  const pages: SearchPageItem[] = Array.from(pageMap.values()).sort(
    (a, b) => b.clicks - a.clicks || b.impressions - a.impressions,
  );

  // Merge daily series for trend charts
  const dateMap = new Map<string, { date: string; clicks: number; impressions: number }>();

  if (engine === "all" || engine === "google") {
    for (const r of gscDates) {
      const date = r.keys?.[0];
      if (!date) continue;
      const existing = dateMap.get(date) || { date, clicks: 0, impressions: 0 };
      existing.clicks += r.clicks || 0;
      existing.impressions += r.impressions || 0;
      dateMap.set(date, existing);
    }
  }

  if (engine === "all" || engine === "bing") {
    for (const r of bingDailyStats) {
      if (!r.date) continue;
      const existing = dateMap.get(r.date) || { date: r.date, clicks: 0, impressions: 0 };
      existing.clicks += r.clicks || 0;
      existing.impressions += r.impressions || 0;
      dateMap.set(r.date, existing);
    }
  }

  const series = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  const totalClicks = queries.reduce((sum, q) => sum + q.clicks, 0);
  const totalImpressions = queries.reduce((sum, q) => sum + q.impressions, 0);
  const googleClicks = queries
    .filter((q) => q.engine === "google")
    .reduce((sum, q) => sum + q.clicks, 0);
  const bingClicks = queries
    .filter((q) => q.engine === "bing")
    .reduce((sum, q) => sum + q.clicks, 0);

  const seriesClicks = series.reduce((sum, s) => sum + s.clicks, 0);
  const seriesImpressions = series.reduce((sum, s) => sum + s.impressions, 0);

  const displayClicks = Math.max(totalClicks, seriesClicks);
  const displayImpressions = Math.max(totalImpressions, seriesImpressions);

  const avgPosition =
    queries.length > 0
      ? Math.round((queries.reduce((sum, q) => sum + q.position, 0) / queries.length) * 10) / 10
      : 0;

  if (queries.length === 0 && countries.length === 0 && pages.length === 0 && series.length === 0) {
    const mock = getMockSearchAnalytics(params.from, params.to, engine);
    return {
      ...mock,
      mocked: true,
    };
  }

  return {
    range: { from: params.from, to: params.to },
    engine,
    kpis: {
      totalClicks: displayClicks,
      totalImpressions: displayImpressions,
      avgCtr: displayImpressions > 0 ? displayClicks / displayImpressions : 0,
      avgPosition,
      googleClicks,
      bingClicks: Math.max(
        bingClicks,
        bingDailyStats.reduce((s, d) => s + d.clicks, 0),
      ),
    },
    queries,
    countries,
    pages,
    series,
    mocked: false,
  };
}
