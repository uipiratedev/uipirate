// Enterprise Dashboard UX heuristic auditor.
//
// This analyzes the STATIC server-rendered HTML a URL returns - it does not
// execute JavaScript or render the page. That's an honest limitation, not a
// hidden one: many dashboards are client-rendered SPAs behind auth, and their
// initial HTML response contains little of the real UI. `lowContent` flags
// exactly that case so the UI can surface it instead of presenting a
// confident-looking score for a page it barely saw.
//
// Every check below is a simple, explainable, deterministic rule over the
// parsed DOM - no LLM, no guesswork - matching the "deterministic server
// verification" principle the rest of the tools suite follows.

import * as cheerio from "cheerio";

export interface DashboardFeatures {
  bodyTextLength: number;
  elementCount: number;
  lowContent: boolean;

  tableCount: number;
  tablesWithHeadCount: number;
  sortIndicatorCount: number;
  paginationDetected: boolean;
  rowActionCount: number;

  kpiCandidateCount: number;

  searchInputCount: number;
  filterSelectCount: number;
  filterChipCount: number;

  emptyStateDetected: boolean;

  navLinkCount: number;
  roleKeywordCount: number;
  maxNavDepth: number;
}

export interface CheckResult {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface CategoryResult {
  key: string;
  label: string;
  score: number;
  checks: CheckResult[];
}

export interface DashboardAuditResult {
  overallScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  lowContent: boolean;
  categories: CategoryResult[];
}

const KPI_NUMBER_PATTERN =
  /(\$\s?\d[\d,]*(\.\d+)?\s?[kKmMbB]?|\d[\d,]*(\.\d+)?\s?%|\d[\d,]*(\.\d+)?\s?[kKmMbB]\b)/;

const EMPTY_STATE_PHRASES = [
  "no data",
  "no results",
  "nothing here",
  "nothing to show",
  "get started",
  "no items found",
  "empty state",
  "no records",
];

const ROLE_KEYWORDS = [
  "admin",
  "owner",
  "manager",
  "viewer",
  "member",
  "permission",
  "role",
  "team",
  "billing",
  "settings",
];

export function extractDashboardFeatures(html: string): DashboardFeatures {
  const $ = cheerio.load(html);

  $("script, style, noscript, svg").remove();

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const elementCount = $("body *").length;
  // Dashboards are control-dense, not prose-dense - short labels and numbers
  // are normal. Only flag pages that look like a genuinely empty SPA shell
  // (e.g. <div id="root"></div> before client-side hydration runs).
  const lowContent = bodyText.length < 150 && elementCount < 15;

  // Tables & grids
  const tables = $("table");
  const tableCount = tables.length;
  let tablesWithHeadCount = 0;

  tables.each((_, el) => {
    if ($(el).find("thead, th").length > 0) tablesWithHeadCount++;
  });

  const sortIndicatorCount = $(
    "[aria-sort], [class*='sort' i], [data-sort]",
  ).length;
  const paginationDetected =
    $(
      "[aria-label*='pagination' i], [class*='pagination' i], nav[aria-label*='page' i]",
    ).length > 0 ||
    /\b(next page|previous page|\bnext\b.{0,20}\bprevious\b)/i.test(bodyText);
  const rowActionCount = $(
    "table [class*='action' i] button, table button[aria-label*='edit' i], table button[aria-label*='delete' i], table [role='menuitem']",
  ).length;

  // KPI candidates: short blocks of text that look like a standalone metric
  let kpiCandidateCount = 0;

  $("h1, h2, h3, [class*='stat' i], [class*='metric' i], [class*='kpi' i]").each(
    (_, el) => {
      const text = $(el).text().trim();

      if (text.length > 0 && text.length <= 20 && KPI_NUMBER_PATTERN.test(text)) {
        kpiCandidateCount++;
      }
    },
  );
  // Fallback: any short element anywhere whose entire text is just a metric.
  $("span, div, p").each((_, el) => {
    const text = $(el).text().trim();

    if (
      text.length > 0 &&
      text.length <= 12 &&
      KPI_NUMBER_PATTERN.test(text) &&
      $(el).children().length === 0
    ) {
      kpiCandidateCount++;
    }
  });

  // Filters & search
  const searchInputCount = $(
    "input[type='search'], input[placeholder*='search' i], [role='search']",
  ).length;
  const filterSelectCount = $(
    "select, [role='combobox'], [class*='filter' i] select",
  ).length;
  const filterChipCount = $(
    "[class*='chip' i], [class*='filter-tag' i], [class*='filter-pill' i]",
  ).length;

  // Empty states
  const lowerBodyText = bodyText.toLowerCase();
  const emptyStateDetected = EMPTY_STATE_PHRASES.some((phrase) =>
    lowerBodyText.includes(phrase),
  );

  // Navigation depth / multi-role signals
  const navLinkCount = $("nav a, [role='navigation'] a, aside a").length;
  const roleKeywordCount = ROLE_KEYWORDS.filter((kw) =>
    lowerBodyText.includes(kw),
  ).length;

  let maxNavDepth = 0;

  $("nav ul, [role='navigation'] ul, aside ul").each((_, el) => {
    let depth = 0;
    let node = $(el);

    while (node.length > 0) {
      if (node.is("ul, ol")) depth++;
      node = node.parents("ul, ol").first();
    }
    maxNavDepth = Math.max(maxNavDepth, depth);
  });

  return {
    bodyTextLength: bodyText.length,
    elementCount,
    lowContent,
    tableCount,
    tablesWithHeadCount,
    sortIndicatorCount,
    paginationDetected,
    rowActionCount,
    kpiCandidateCount,
    searchInputCount,
    filterSelectCount,
    filterChipCount,
    emptyStateDetected,
    navLinkCount,
    roleKeywordCount,
    maxNavDepth,
  };
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreToGrade(score: number): DashboardAuditResult["grade"] {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";

  return "F";
}

export function scoreDashboardFeatures(f: DashboardFeatures): DashboardAuditResult {
  // Information density: penalize very sparse (nothing rendered server-side)
  // and very cluttered (huge unstructured element count) pages, reward a
  // moderate, well-structured range.
  const densityChecks: CheckResult[] = [];
  let densityScore = 100;

  if (f.lowContent) {
    densityScore = 20;
    densityChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: false,
      detail: `Only ${f.bodyTextLength} characters of text and ${f.elementCount} elements were found in the initial HTML - this page may be client-rendered or behind authentication.`,
    });
  } else {
    densityChecks.push({
      key: "content-volume",
      label: "Meaningful server-rendered content",
      passed: true,
      detail: `${f.elementCount} elements and ${f.bodyTextLength} characters of text found.`,
    });
    if (f.elementCount > 2500) {
      densityScore -= 30;
      densityChecks.push({
        key: "element-count",
        label: "Element count within a reasonable range",
        passed: false,
        detail: `${f.elementCount} DOM elements is very high - likely to feel cluttered.`,
      });
    } else {
      densityChecks.push({
        key: "element-count",
        label: "Element count within a reasonable range",
        passed: true,
        detail: `${f.elementCount} DOM elements.`,
      });
    }
  }

  // KPI prominence
  const kpiChecks: CheckResult[] = [];
  let kpiScore = 0;

  if (f.kpiCandidateCount >= 3) {
    kpiScore = 100;
  } else if (f.kpiCandidateCount >= 1) {
    kpiScore = 60;
  } else {
    kpiScore = 15;
  }
  kpiChecks.push({
    key: "kpi-candidates",
    label: "Prominent standalone metrics (KPI cards)",
    passed: f.kpiCandidateCount >= 3,
    detail:
      f.kpiCandidateCount > 0
        ? `Found ${f.kpiCandidateCount} short, number-led elements that look like KPI values.`
        : "No short, standalone metric-like elements were detected near the top of the page.",
  });

  // Table & grid usability
  const tableChecks: CheckResult[] = [];
  let tableScore = 0;

  if (f.tableCount === 0) {
    tableScore = 40;
    tableChecks.push({
      key: "table-present",
      label: "Data table or grid present",
      passed: false,
      detail: "No <table> elements found - this page may use custom grid markup that can't be detected structurally.",
    });
  } else {
    tableScore += 30;
    tableChecks.push({
      key: "table-present",
      label: "Data table or grid present",
      passed: true,
      detail: `${f.tableCount} table${f.tableCount === 1 ? "" : "s"} found.`,
    });

    const headRatio = f.tablesWithHeadCount / f.tableCount;

    tableScore += Math.round(headRatio * 25);
    tableChecks.push({
      key: "table-headers",
      label: "Tables have proper header markup",
      passed: headRatio === 1,
      detail: `${f.tablesWithHeadCount} of ${f.tableCount} tables use <thead>/<th>.`,
    });

    tableScore += f.sortIndicatorCount > 0 ? 20 : 0;
    tableChecks.push({
      key: "sort-indicators",
      label: "Sortable column indicators",
      passed: f.sortIndicatorCount > 0,
      detail:
        f.sortIndicatorCount > 0
          ? `${f.sortIndicatorCount} sort-related attribute(s)/class(es) found.`
          : "No aria-sort, data-sort, or *sort* class names found on table headers.",
    });

    tableScore += f.paginationDetected ? 15 : 0;
    tableChecks.push({
      key: "pagination",
      label: "Pagination controls",
      passed: f.paginationDetected,
      detail: f.paginationDetected
        ? "Pagination markup or next/previous controls detected."
        : "No pagination controls detected - large tables may be hard to navigate.",
    });

    tableScore += f.rowActionCount > 0 ? 10 : 0;
    tableChecks.push({
      key: "row-actions",
      label: "Inline row actions",
      passed: f.rowActionCount > 0,
      detail:
        f.rowActionCount > 0
          ? `${f.rowActionCount} inline row action control(s) found.`
          : "No inline edit/delete/menu controls found inside tables.",
    });
  }

  // Filter & search discoverability
  const filterChecks: CheckResult[] = [];
  let filterScore = 0;

  filterScore += f.searchInputCount > 0 ? 40 : 0;
  filterChecks.push({
    key: "search-input",
    label: "Search input present",
    passed: f.searchInputCount > 0,
    detail:
      f.searchInputCount > 0
        ? `${f.searchInputCount} search input(s) found.`
        : "No search input detected.",
  });

  filterScore += f.filterSelectCount > 0 ? 35 : 0;
  filterChecks.push({
    key: "filter-controls",
    label: "Filter dropdowns/selects",
    passed: f.filterSelectCount > 0,
    detail:
      f.filterSelectCount > 0
        ? `${f.filterSelectCount} filter/select control(s) found.`
        : "No <select> or combobox filter controls detected.",
  });

  filterScore += f.filterChipCount > 0 ? 25 : 0;
  filterChecks.push({
    key: "active-filter-chips",
    label: "Active filter chips",
    passed: f.filterChipCount > 0,
    detail:
      f.filterChipCount > 0
        ? `${f.filterChipCount} chip/tag-like element(s) found - helps users see active filters at a glance.`
        : "No filter-chip-style elements detected.",
  });

  // Empty states & multi-role navigation combined into one "workflow depth" category
  const workflowChecks: CheckResult[] = [];
  let workflowScore = 0;

  workflowScore += f.emptyStateDetected ? 30 : 10;
  workflowChecks.push({
    key: "empty-state-copy",
    label: "Empty-state guidance copy",
    passed: f.emptyStateDetected,
    detail: f.emptyStateDetected
      ? "Found copy suggesting a designed empty/zero-data state."
      : "No common empty-state phrasing found (may still exist behind conditional rendering).",
  });

  workflowScore += f.navLinkCount >= 4 ? 30 : f.navLinkCount > 0 ? 15 : 0;
  workflowChecks.push({
    key: "navigation-links",
    label: "Structured navigation",
    passed: f.navLinkCount >= 4,
    detail: `${f.navLinkCount} navigation link(s) found in <nav>/<aside> landmarks.`,
  });

  workflowScore += f.roleKeywordCount >= 3 ? 25 : f.roleKeywordCount > 0 ? 12 : 0;
  workflowChecks.push({
    key: "role-signals",
    label: "Multi-role / permission signals",
    passed: f.roleKeywordCount >= 3,
    detail:
      f.roleKeywordCount > 0
        ? `${f.roleKeywordCount} role/permission-related keyword(s) found (admin, billing, team, etc.).`
        : "No role or permission-related keywords found.",
  });

  workflowScore += f.maxNavDepth >= 2 ? 15 : 0;
  workflowChecks.push({
    key: "nav-depth",
    label: "Nested navigation for sub-sections",
    passed: f.maxNavDepth >= 2,
    detail: `Deepest nested <ul> found in navigation: ${f.maxNavDepth} level(s).`,
  });

  const categories: CategoryResult[] = [
    { key: "density", label: "Information Density", score: clampScore(densityScore), checks: densityChecks },
    { key: "kpi", label: "KPI Prominence", score: clampScore(kpiScore), checks: kpiChecks },
    { key: "tables", label: "Table & Grid Usability", score: clampScore(tableScore), checks: tableChecks },
    { key: "filters", label: "Filter & Search Discoverability", score: clampScore(filterScore), checks: filterChecks },
    { key: "workflow", label: "Empty States & Multi-Role Navigation", score: clampScore(workflowScore), checks: workflowChecks },
  ];

  const overallScore = clampScore(
    categories.reduce((sum, c) => sum + c.score, 0) / categories.length,
  );

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    lowContent: f.lowContent,
    categories,
  };
}

export function runDashboardAudit(html: string): DashboardAuditResult {
  return scoreDashboardFeatures(extractDashboardFeatures(html));
}
