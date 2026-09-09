export function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY || "uipirate-indexnow-key-2026";
}

export function getHost(): string {
  const origin = process.env.SITE_ORIGIN || "https://uipirate.dev";
  try {
    return new URL(origin).host;
  } catch {
    return "uipirate.dev";
  }
}

export interface IndexNowResult {
  ok: boolean;
  status: number;
  error?: string;
  mocked?: boolean;
}

/**
 * Submits a batch of URLs to the IndexNow protocol (supported by Bing, Yandex, Seznam, Naver).
 */
export async function submitIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (!urls.length) return { ok: true, status: 200 };

  const key = getIndexNowKey();
  const host = getHost();
  const origin = process.env.SITE_ORIGIN || `https://${host}`;
  const keyLocation = `${origin}/api/indexnow-key`;

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls,
      }),
    });

    if (res.status === 200 || res.status === 202) {
      return { ok: true, status: res.status };
    }

    const txt = await res.text().catch(() => "");
    return {
      ok: false,
      status: res.status,
      error: `IndexNow responded with status ${res.status}: ${txt}`,
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 500,
      error: err.message || "Network error submitting to IndexNow",
    };
  }
}
