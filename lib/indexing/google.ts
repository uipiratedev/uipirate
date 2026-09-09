import { getGoogleAccessToken } from "./auth";

export interface GooglePublishResult {
  ok: boolean;
  status: number;
  urlNotificationMetadata?: any;
  error?: string;
  mocked?: boolean;
}

export interface GoogleInspectionResult {
  ok: boolean;
  status: number;
  verdict: "PASS" | "PARTIAL" | "FAIL" | "NEUTRAL" | null;
  coverageState: string | null;
  indexingState: string | null;
  robotsTxtState: string | null;
  lastCrawlTime: Date | null;
  googleCanonical: string | null;
  userCanonical: string | null;
  raw?: any;
  error?: string;
  mocked?: boolean;
}

export function getGscSiteUrl(): string {
  return process.env.GSC_SITE_URL || "sc-domain:uipirate.com";
}

/**
 * Submits a URL to the Google Indexing API for crawl notification.
 */
export async function publishGoogleUrl(
  url: string,
  type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED",
): Promise<GooglePublishResult> {
  const token = await getGoogleAccessToken([
    "https://www.googleapis.com/auth/indexing",
  ]);

  if (!token) {
    // If no credentials configured, simulate a successful response for development
    return {
      ok: true,
      status: 200,
      mocked: true,
      urlNotificationMetadata: {
        url,
        latestUpdate: {
          url,
          type,
          notifyTime: new Date().toISOString(),
        },
      },
    };
  }

  try {
    const res = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type }),
      },
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: json?.error?.message || `Google Indexing API error (${res.status})`,
      };
    }

    return {
      ok: true,
      status: res.status,
      urlNotificationMetadata: json.urlNotificationMetadata,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 500,
      error: err.message || "Network error calling Google Indexing API",
    };
  }
}

/**
 * Calls Google Search Console URL Inspection API to query live index status.
 */
export async function inspectGoogleUrl(
  url: string,
): Promise<GoogleInspectionResult> {
  const token = await getGoogleAccessToken([
    "https://www.googleapis.com/auth/webmasters.readonly",
  ]);

  if (!token) {
    // If credentials are not yet configured in local dev, provide standard default response
    return {
      ok: true,
      status: 200,
      mocked: true,
      verdict: "PASS",
      coverageState: "Submitted and indexed",
      indexingState: "INDEXING_ALLOWED",
      robotsTxtState: "ALLOWED",
      lastCrawlTime: new Date(),
      googleCanonical: url,
      userCanonical: url,
    };
  }

  const siteUrl = getGscSiteUrl();

  try {
    const res = await fetch(
      "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inspectionUrl: url,
          siteUrl,
        }),
      },
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        verdict: null,
        coverageState: null,
        indexingState: null,
        robotsTxtState: null,
        lastCrawlTime: null,
        googleCanonical: null,
        userCanonical: null,
        error: json?.error?.message || `Google Inspection API error (${res.status})`,
      };
    }

    const inspectResult = json.inspectionResult?.indexStatusResult;
    const verdict = inspectResult?.verdict as
      | "PASS"
      | "PARTIAL"
      | "FAIL"
      | "NEUTRAL"
      | undefined;

    return {
      ok: true,
      status: res.status,
      verdict: verdict || null,
      coverageState: inspectResult?.coverageState || null,
      indexingState: inspectResult?.indexingState || null,
      robotsTxtState: inspectResult?.robotsTxtState || null,
      lastCrawlTime: inspectResult?.lastCrawlTime
        ? new Date(inspectResult.lastCrawlTime)
        : null,
      googleCanonical: inspectResult?.googleCanonical || null,
      userCanonical: inspectResult?.userCanonical || null,
      raw: json.inspectionResult,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 500,
      verdict: null,
      coverageState: null,
      indexingState: null,
      robotsTxtState: null,
      lastCrawlTime: null,
      googleCanonical: null,
      userCanonical: null,
      error: err.message || "Network error calling Google Inspection API",
    };
  }
}

/**
 * Resubmits sitemap feed to Google Search Console.
 */
export async function submitSitemapToGSC(
  feedpath = "sitemap.xml",
): Promise<{ ok: boolean; status: number; error?: string }> {
  const token = await getGoogleAccessToken([
    "https://www.googleapis.com/auth/webmasters",
  ]);

  if (!token) {
    return { ok: true, status: 200 };
  }

  const siteUrl = getGscSiteUrl();

  try {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(feedpath)}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!res.ok) {
      const txt = await res.text();
      return { ok: false, status: res.status, error: txt };
    }

    return { ok: true, status: res.status };
  } catch (err: any) {
    return { ok: false, status: 500, error: err.message };
  }
}
