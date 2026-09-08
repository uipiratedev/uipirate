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

export interface BingSubmitResult {
  ok: boolean;
  status: number;
  error?: string;
  mocked?: boolean;
}

export interface BingUrlInfoResult {
  ok: boolean;
  indexed: boolean | null;
  lastCrawlTime: Date | null;
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

/**
 * Retrieves indexing metadata for a specific URL from Bing Webmaster Tools.
 */
export async function getBingUrlInfo(
  url: string,
): Promise<BingUrlInfoResult> {
  const apiKey = getBingApiKey();
  const siteUrl = getSiteOrigin();

  if (!apiKey) {
    return {
      ok: true,
      indexed: true,
      lastCrawlTime: new Date(),
      mocked: true,
    };
  }

  try {
    const res = await fetch(
      `https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?apikey=${encodeURIComponent(apiKey)}&siteUrl=${encodeURIComponent(siteUrl)}&url=${encodeURIComponent(url)}`,
    );

    if (!res.ok) {
      const txt = await res.text();
      return {
        ok: false,
        indexed: null,
        lastCrawlTime: null,
        error: `Bing GetUrlInfo error (${res.status}): ${txt}`,
      };
    }

    const data = await res.json().catch(() => ({}));
    const d = data?.d;

    return {
      ok: true,
      indexed: d?.IsIndexed ?? (d?.UrlStatus === "INDEXED" ? true : null),
      lastCrawlTime: d?.LastCrawlDate ? new Date(d.LastCrawlDate) : null,
    };
  } catch (err: any) {
    return {
      ok: false,
      indexed: null,
      lastCrawlTime: null,
      error: err.message || "Network error fetching Bing URL info",
    };
  }
}
