export function getBingApiKey(): string | undefined {
  return (
    process.env.BING_WMT_API_KEY ||
    process.env.BING_WEBMASTER ||
    process.env.BING_API_KEY
  );
}

export function getSiteOrigin(): string {
  return process.env.SITE_ORIGIN || "https://www.uipirate.com/";
}

export interface BingInspectionResult {
  ok: boolean;
  /** Bing's own coverage verdict, e.g. "Indexed", "DiscoveredButNotSelected", "Blocked". */
  indexStatus: string | null;
  statusMessage: string | null;
  errorMessage: string | null;
  indexed: boolean | null;
  discoveryDate: Date | null;
  lastCrawlTime: Date | null;
  crawlAllowed: string | null;
  indexingAllowed: string | null;
  pageFetchSuccessful: string | null;
  canonicalUrl: string | null;
  redirectedUrl: string | null;
  raw?: any;
  error?: string;
  mocked?: boolean;
}

function bingDate(v: unknown): Date | null {
  if (typeof v !== "string" || !v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Calls the Bing Webmaster Tools *internal* URL Inspection endpoint — the same
 * one the BWT dashboard uses. This is the only Bing surface that returns a real
 * coverage verdict (Indexed / DiscoveredButNotSelected / Blocked / ...), i.e.
 * the equivalent of Google's coverageState.
 *
 * It is NOT part of the public API-key surface: it authenticates with a signed-in
 * Microsoft session, supplied via BING_INSPECTOR_COOKIE (raw Cookie header copied
 * from a logged-in browser session). Cookies expire after a few days, so this is
 * a manual-backfill tool, not something the serverless cron can use.
 */
export async function getBingUrlInspection(
  url: string,
): Promise<BingInspectionResult> {
  const cookie = process.env.BING_INSPECTOR_COOKIE;
  const siteUrl = getSiteOrigin();

  const blank: Omit<BingInspectionResult, "ok"> = {
    indexStatus: null,
    statusMessage: null,
    errorMessage: null,
    indexed: null,
    discoveryDate: null,
    lastCrawlTime: null,
    crawlAllowed: null,
    indexingAllowed: null,
    pageFetchSuccessful: null,
    canonicalUrl: null,
    redirectedUrl: null,
  };

  if (!cookie) {
    return { ok: true, mocked: true, ...blank, indexStatus: "Indexed", indexed: true };
  }

  const endpoint =
    `https://www.bing.com/webmasters/api/urlinspector/inspecturl` +
    `?siteUrl=${encodeURIComponent(siteUrl)}` +
    `&urlToInspect=${encodeURIComponent(url)}` +
    `&mode=Bingdex`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        accept: "application/json, text/plain, */*",
        "x-requested-with": "XMLHttpRequest",
        referer: `https://www.bing.com/webmasters/urlinspection?siteUrl=${siteUrl}`,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        cookie,
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.code === "UserUnAuthorized") {
      return {
        ok: false,
        ...blank,
        error:
          json?.message ||
          `Bing inspector error (${res.status})${json?.code ? ` ${json.code}` : ""}`,
      };
    }

    const info = json?.IndexInfoResponse?.IndexInfo || {};
    const indexStatus: string | null = info.BWTIndexStatus ?? null;
    const indexed =
      indexStatus == null ? null : indexStatus.toLowerCase() === "indexed";

    return {
      ok: true,
      indexStatus,
      statusMessage: info.StatusMessage ?? null,
      errorMessage: info.ErrorMessage
        ? String(info.ErrorMessage).replace(/<[^>]+>/g, "")
        : null,
      indexed,
      discoveryDate: bingDate(info.DiscoveryDate),
      lastCrawlTime: bingDate(info.CrawledDate),
      crawlAllowed: info.CrawlAllowed ?? null,
      indexingAllowed: info.IndexingAllowed ?? null,
      pageFetchSuccessful: info.PageFetchSuccessful ?? null,
      canonicalUrl: info.CanonicalRedirectedToURL ?? null,
      redirectedUrl: info.RedirectedUrl ?? null,
      raw: json?.IndexInfoResponse,
    };
  } catch (err: any) {
    return {
      ok: false,
      ...blank,
      error: err.message || "Network error calling Bing inspector",
    };
  }
}

export interface BingSubmitResult {
  ok: boolean;
  status: number;
  error?: string;
  mocked?: boolean;
}

export interface BingUrlInfoResult {
  ok: boolean;
  /**
   * Heuristic: Bing has no "indexed" boolean in its API. We treat a URL as
   * indexed when Bing has crawled it with an OK status and non-empty body,
   * OR when it has recorded search impressions for it.
   */
  indexed: boolean | null;
  discovered: boolean;
  crawled: boolean;
  lastCrawlTime: Date | null;
  discoveryDate: Date | null;
  httpStatus: number | null;
  documentSize: number | null;
  impressions: number | null;
  clicks: number | null;
  status: string;
  error?: string;
  mocked?: boolean;
}

/**
 * Submits a batch of URLs to Bing Webmaster Tools API.
 */
export async function submitBingUrls(
  urls: string[],
): Promise<BingSubmitResult> {
  const apiKey = getBingApiKey();
  const siteUrl = getSiteOrigin();

  if (!apiKey) {
    return { ok: true, status: 200, mocked: true };
  }

  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          siteUrl,
          urlList: urls,
        }),
      },
    );

    if (!res.ok) {
      const txt = await res.text();
      return {
        ok: false,
        status: res.status,
        error: `Bing API error (${res.status}): ${txt}`,
      };
    }

    return { ok: true, status: res.status };
  } catch (err: any) {
    return {
      ok: false,
      status: 500,
      error: err.message || "Network error submitting to Bing",
    };
  }
}

export interface BingCrawlIssue {
  url: string;
  httpCode: number | null;
  issues: number | null;
  issuesText: string[];
  anchorCount: number | null;
  crawledDate: Date | null;
}

// Bing Webmaster "CrawlIssues" flags enum (best-effort decode).
const BING_CRAWL_ISSUE_FLAGS: Array<[number, string]> = [
  [2, "301 redirect"],
  [4, "302 redirect"],
  [8, "4xx error"],
  [16, "5xx error"],
  [32, "Important URL blocked by robots.txt"],
  [64, "Contains malware"],
  [256, "Contains noindex"],
  [512, "Redirect during crawl"],
];

function decodeBingIssues(mask: number | null | undefined): string[] {
  if (!mask || mask <= 1) return [];
  return BING_CRAWL_ISSUE_FLAGS.filter(([bit]) => (mask & bit) === bit).map(
    ([, label]) => label,
  );
}

/**
 * Fetches the site-wide crawl issue list from Bing Webmaster Tools.
 * This is the closest Bing gets to Google's "why not indexed" reasons:
 * per-URL HTTP status, robots blocks, noindex, redirects, malware.
 * Returns a Map keyed by URL for quick lookup during a bulk inspection.
 */
export async function getBingCrawlIssues(): Promise<{
  ok: boolean;
  byUrl: Map<string, BingCrawlIssue>;
  count: number;
  error?: string;
  mocked?: boolean;
}> {
  const apiKey = getBingApiKey();
  const siteUrl = getSiteOrigin();
  const byUrl = new Map<string, BingCrawlIssue>();

  if (!apiKey) {
    return { ok: true, byUrl, count: 0, mocked: true };
  }

  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/GetCrawlIssues?apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(siteUrl)}`,
    );

    if (!res.ok) {
      const txt = await res.text();
      return {
        ok: false,
        byUrl,
        count: 0,
        error: `Bing GetCrawlIssues error (${res.status}): ${txt}`,
      };
    }

    const data = await res.json().catch(() => ({}));
    const rows: any[] = Array.isArray(data?.d) ? data.d : [];

    for (const row of rows) {
      const url: string = row?.Url;
      if (!url) continue;
      byUrl.set(url, {
        url,
        httpCode: typeof row?.HttpCode === "number" ? row.HttpCode : null,
        issues: typeof row?.Issues === "number" ? row.Issues : null,
        issuesText: decodeBingIssues(row?.Issues),
        anchorCount:
          typeof row?.AnchorCount === "number" ? row.AnchorCount : null,
        crawledDate: parseBingDate(row?.CrawledDate),
      });
    }

    return { ok: true, byUrl, count: byUrl.size };
  } catch (err: any) {
    return {
      ok: false,
      byUrl,
      count: 0,
      error: err.message || "Network error fetching Bing crawl issues",
    };
  }
}

function parseBingDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  // Bing returns "/Date(1699999999999)/" style timestamps.
  const m = v.match(/\/Date\((\d+)\)\//);
  if (m) return new Date(Number(m[1]));
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Retrieves indexing metadata for a specific URL from Bing Webmaster Tools.
 */
export async function getBingUrlInfo(
  url: string,
  opts: { withTraffic?: boolean } = {},
): Promise<BingUrlInfoResult> {
  const withTraffic = opts.withTraffic ?? false;
  const apiKey = getBingApiKey();
  const siteUrl = getSiteOrigin();

  const empty = {
    discovered: false,
    crawled: false,
    lastCrawlTime: null,
    discoveryDate: null,
    httpStatus: null,
    documentSize: null,
    impressions: null,
    clicks: null,
  };

  if (!apiKey) {
    return {
      ok: true,
      indexed: true,
      status: "Indexed",
      ...empty,
      crawled: true,
      lastCrawlTime: new Date(),
      mocked: true,
    };
  }

  const base = `https://ssl.bing.com/webmaster/api.svc/json`;
  const qs = `apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(siteUrl)}&url=${encodeURIComponent(url)}`;

  try {
    // GetUrlInfo has no IsIndexed field; it exposes discovery + crawl facts.
    // GetUrlTrafficInfo gives impressions/clicks — presence proves Bing indexed it.
    const infoRes = await fetch(`${base}/GetUrlInfo?${qs}`);
    const trafficRes =
      withTraffic && infoRes.ok
        ? await fetch(`${base}/GetUrlTrafficInfo?${qs}`).catch(() => null)
        : null;

    if (!infoRes.ok) {
      const txt = await infoRes.text();
      return {
        ok: false,
        indexed: null,
        status: `ERROR (${infoRes.status})`,
        ...empty,
        error: `Bing GetUrlInfo error (${infoRes.status}): ${txt.slice(0, 200)}`,
      };
    }

    const d = (await infoRes.json().catch(() => ({})))?.d;
    const t =
      trafficRes && trafficRes.ok
        ? (await trafficRes.json().catch(() => ({})))?.d
        : null;

    const discoveryDate = parseBingDate(d?.DiscoveryDate);
    const lastCrawlTime = parseBingDate(d?.LastCrawledDate);
    const httpStatus = typeof d?.HttpStatus === "number" ? d.HttpStatus : null;
    const documentSize =
      typeof d?.DocumentSize === "number" ? d.DocumentSize : null;
    const impressions = typeof t?.Impressions === "number" ? t.Impressions : null;
    const clicks = typeof t?.Clicks === "number" ? t.Clicks : null;

    const discovered = !!discoveryDate || d?.IsPage === true;
    const crawled = !!lastCrawlTime;
    const okStatus = httpStatus === 0 || httpStatus === 200;
    const indexed =
      (impressions ?? 0) > 0 ||
      (crawled && okStatus && (documentSize ?? 0) > 0);

    const status = !discovered
      ? "Unknown to Bing"
      : !crawled
        ? "Discovered - not crawled"
        : !okStatus
          ? `Crawled - HTTP ${httpStatus}`
          : indexed
            ? "Indexed"
            : "Crawled - not indexed";

    return {
      ok: true,
      indexed,
      discovered,
      crawled,
      lastCrawlTime,
      discoveryDate,
      httpStatus,
      documentSize,
      impressions,
      clicks,
      status,
    };
  } catch (err: any) {
    return {
      ok: false,
      indexed: null,
      status: "ERROR",
      ...empty,
      error: err.message || "Network error fetching Bing URL info",
    };
  }
}
