export type CoverageTone = "success" | "warning" | "danger" | "default";

export interface CoveragePresentation {
  chipLabel: string;
  tone: CoverageTone;
  actionable: boolean;
  hint: string;
}

export function mapCoverageState(
  coverageState: string | null | undefined,
  verdict?: "PASS" | "PARTIAL" | "FAIL" | "NEUTRAL" | null,
): CoveragePresentation {
  if (!coverageState) {
    if (verdict === "PASS") {
      return {
        chipLabel: "Indexed",
        tone: "success",
        actionable: false,
        hint: "URL is indexed and eligible for search results.",
      };
    }
    return {
      chipLabel: "Unknown",
      tone: "default",
      actionable: true,
      hint: "Not yet inspected via Search Console API.",
    };
  }

  const raw = coverageState.toLowerCase().trim();

  if (
    raw.includes("submitted and indexed") ||
    raw.includes("url is on google") ||
    raw.includes("indexed") && !raw.includes("not indexed") && !raw.includes("indexed, though blocked")
  ) {
    return {
      chipLabel: "Indexed",
      tone: "success",
      actionable: false,
      hint: "URL is indexed and appearing on Google.",
    };
  }

  if (raw.includes("crawled") && (raw.includes("not indexed") || raw.includes("currently not indexed"))) {
    return {
      chipLabel: "Crawled, not indexed",
      tone: "warning",
      actionable: true,
      hint: "Google crawled the page but chose not to index it (often content quality or thin content).",
    };
  }

  if (raw.includes("discovered") && (raw.includes("not indexed") || raw.includes("currently not indexed"))) {
    return {
      chipLabel: "Discovered",
      tone: "warning",
      actionable: true,
      hint: "Google found the URL but hasn't crawled it yet (check internal links and crawl budget).",
    };
  }

  if (raw.includes("different canonical") || raw.includes("google chose different canonical")) {
    return {
      chipLabel: "Canonical mismatch",
      tone: "warning",
      actionable: true,
      hint: "Google picked a different canonical URL than declared.",
    };
  }

  if (raw.includes("duplicate")) {
    return {
      chipLabel: "Duplicate",
      tone: "warning",
      actionable: true,
      hint: "Detected as duplicate content of another URL.",
    };
  }

  if (raw.includes("noindex")) {
    return {
      chipLabel: "Noindex",
      tone: "default",
      actionable: false,
      hint: "Excluded from Google by a meta noindex tag or HTTP header.",
    };
  }

  if (raw.includes("robots.txt") || raw.includes("blocked by robots")) {
    return {
      chipLabel: "Robots-blocked",
      tone: "danger",
      actionable: true,
      hint: "Crawling blocked by robots.txt rules.",
    };
  }

  if (raw.includes("404") || raw.includes("not found")) {
    return {
      chipLabel: "404 Error",
      tone: "danger",
      actionable: true,
      hint: "Page returned 404 or soft-404 not found status.",
    };
  }

  if (raw.includes("redirect")) {
    return {
      chipLabel: "Redirect",
      tone: "default",
      actionable: false,
      hint: "Page redirects to another destination.",
    };
  }

  return {
    chipLabel: coverageState,
    tone: "default",
    actionable: false,
    hint: coverageState,
  };
}

export function mapBingState(
  indexed: boolean | null | undefined,
  lastError?: string | null,
): CoveragePresentation {
  if (indexed === true) {
    return {
      chipLabel: "Indexed",
      tone: "success",
      actionable: false,
      hint: "URL is indexed in Bing search.",
    };
  }
  if (indexed === false) {
    return {
      chipLabel: "Not Indexed",
      tone: "warning",
      actionable: true,
      hint: lastError || "URL is not indexed in Bing.",
    };
  }
  return {
    chipLabel: "Unchecked",
    tone: "default",
    actionable: false,
    hint: "Bing index status not yet queried.",
  };
}
