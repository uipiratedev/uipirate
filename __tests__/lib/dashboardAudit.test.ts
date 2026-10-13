import { describe, it, expect } from "vitest";

import {
  extractDashboardFeatures,
  scoreDashboardFeatures,
  runDashboardAudit,
  DashboardFeatures,
} from "@/lib/dashboardAudit";

const SPA_SHELL_HTML = `
<!DOCTYPE html>
<html><head><title>App</title></head>
<body><div id="root"></div><script src="/bundle.js"></script></body>
</html>`;

const RICH_DASHBOARD_HTML = `
<!DOCTYPE html>
<html><body>
  <nav>
    <ul>
      <li><a href="/overview">Overview</a></li>
      <li><a href="/admin">Admin</a>
        <ul>
          <li><a href="/admin/team">Team</a></li>
          <li><a href="/admin/billing">Billing</a></li>
        </ul>
      </li>
      <li><a href="/settings">Settings</a></li>
      <li><a href="/reports">Reports</a></li>
    </ul>
  </nav>
  <main>
    <h1>Dashboard</h1>
    <section class="stat-cards">
      <div class="stat"><span>$12.4K</span></div>
      <div class="stat"><span>84%</span></div>
      <div class="stat"><span>1.2K</span></div>
    </section>
    <div role="search">
      <input type="search" placeholder="Search orders..." />
    </div>
    <select class="filter"><option>All statuses</option></select>
    <div class="filter-chip">Status: Active <button>x</button></div>
    <table>
      <thead>
        <tr><th aria-sort="ascending">Name</th><th class="sortable">Amount</th></tr>
      </thead>
      <tbody>
        <tr><td>Acme</td><td>$100</td>
          <td class="row-actions"><button aria-label="edit">Edit</button></td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="pagination">
      <button>Previous</button><button>Next</button>
    </nav>
    <p>Manage your team's billing and permission roles from the admin panel.</p>
  </main>
</body></html>`;

const SPARSE_TABLE_HTML = `
<!DOCTYPE html>
<html><body>
  <main>
    <h1>Reports</h1>
    <p>${"Lorem ipsum dolor sit amet consectetur adipiscing elit. ".repeat(20)}</p>
    <table><tr><td>Row 1</td></tr><tr><td>Row 2</td></tr></table>
  </main>
</body></html>`;

describe("extractDashboardFeatures", () => {
  it("flags an empty SPA shell as low-content", () => {
    const features = extractDashboardFeatures(SPA_SHELL_HTML);

    expect(features.lowContent).toBe(true);
    expect(features.tableCount).toBe(0);
  });

  it("does not flag a page with real content as low-content", () => {
    const features = extractDashboardFeatures(RICH_DASHBOARD_HTML);

    expect(features.lowContent).toBe(false);
  });

  it("counts tables and detects proper <thead> markup", () => {
    const rich = extractDashboardFeatures(RICH_DASHBOARD_HTML);

    expect(rich.tableCount).toBe(1);
    expect(rich.tablesWithHeadCount).toBe(1);

    const sparse = extractDashboardFeatures(SPARSE_TABLE_HTML);

    expect(sparse.tableCount).toBe(1);
    expect(sparse.tablesWithHeadCount).toBe(0);
  });

  it("detects sort indicators and pagination controls", () => {
    const features = extractDashboardFeatures(RICH_DASHBOARD_HTML);

    expect(features.sortIndicatorCount).toBeGreaterThan(0);
    expect(features.paginationDetected).toBe(true);
  });

  it("detects search input, filter select, and filter chips", () => {
    const features = extractDashboardFeatures(RICH_DASHBOARD_HTML);

    // 2, not 1: the fixture wraps the <input type="search"> in a
    // role="search" div, and both distinct elements legitimately match
    // separate clauses of the search-input selector.
    expect(features.searchInputCount).toBe(2);
    expect(features.filterSelectCount).toBe(1);
    expect(features.filterChipCount).toBe(1);
  });

  it("detects KPI-like short numeric elements", () => {
    const features = extractDashboardFeatures(RICH_DASHBOARD_HTML);

    expect(features.kpiCandidateCount).toBeGreaterThanOrEqual(3);
  });

  it("finds no KPI candidates on a page with none", () => {
    const features = extractDashboardFeatures(SPARSE_TABLE_HTML);

    expect(features.kpiCandidateCount).toBe(0);
  });

  it("counts nav links and detects nested navigation depth", () => {
    const features = extractDashboardFeatures(RICH_DASHBOARD_HTML);

    expect(features.navLinkCount).toBeGreaterThanOrEqual(4);
    expect(features.maxNavDepth).toBeGreaterThanOrEqual(2);
  });

  it("detects role/permission keywords in body text", () => {
    const features = extractDashboardFeatures(RICH_DASHBOARD_HTML);

    expect(features.roleKeywordCount).toBeGreaterThan(0);
  });

  it("finds zero role keywords on a page without them", () => {
    const features = extractDashboardFeatures(SPARSE_TABLE_HTML);

    expect(features.roleKeywordCount).toBe(0);
  });
});

function baseFeatures(): DashboardFeatures {
  return {
    bodyTextLength: 1000,
    elementCount: 200,
    lowContent: false,
    tableCount: 0,
    tablesWithHeadCount: 0,
    sortIndicatorCount: 0,
    paginationDetected: false,
    rowActionCount: 0,
    kpiCandidateCount: 0,
    searchInputCount: 0,
    filterSelectCount: 0,
    filterChipCount: 0,
    emptyStateDetected: false,
    navLinkCount: 0,
    roleKeywordCount: 0,
    maxNavDepth: 0,
  };
}

describe("scoreDashboardFeatures", () => {
  it("gives a very low density score to low-content pages", () => {
    const result = scoreDashboardFeatures({ ...baseFeatures(), lowContent: true });
    const density = result.categories.find((c) => c.key === "density")!;

    expect(density.score).toBeLessThan(30);
  });

  it("scores a fully-featured table category at or near 100", () => {
    const result = scoreDashboardFeatures({
      ...baseFeatures(),
      tableCount: 2,
      tablesWithHeadCount: 2,
      sortIndicatorCount: 3,
      paginationDetected: true,
      rowActionCount: 1,
    });
    const tables = result.categories.find((c) => c.key === "tables")!;

    expect(tables.score).toBe(100);
  });

  it("gives a low table score when no tables are present", () => {
    const result = scoreDashboardFeatures(baseFeatures());
    const tables = result.categories.find((c) => c.key === "tables")!;

    expect(tables.score).toBeLessThan(50);
  });

  it("rewards more KPI candidates with a higher score, monotonically", () => {
    const none = scoreDashboardFeatures({ ...baseFeatures(), kpiCandidateCount: 0 });
    const some = scoreDashboardFeatures({ ...baseFeatures(), kpiCandidateCount: 1 });
    const many = scoreDashboardFeatures({ ...baseFeatures(), kpiCandidateCount: 5 });

    const score = (r: ReturnType<typeof scoreDashboardFeatures>) =>
      r.categories.find((c) => c.key === "kpi")!.score;

    expect(score(none)).toBeLessThan(score(some));
    expect(score(some)).toBeLessThan(score(many));
  });

  it("every category score is clamped to [0, 100]", () => {
    const result = scoreDashboardFeatures({
      ...baseFeatures(),
      tableCount: 10,
      tablesWithHeadCount: 10,
      sortIndicatorCount: 50,
      paginationDetected: true,
      rowActionCount: 20,
    });

    result.categories.forEach((c) => {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(100);
    });
  });

  it("computes overall score as the average of category scores", () => {
    const result = scoreDashboardFeatures(baseFeatures());
    const expected = Math.round(
      result.categories.reduce((sum, c) => sum + c.score, 0) / result.categories.length,
    );

    expect(result.overallScore).toBe(expected);
  });

  it("maps overall score to the correct letter grade", () => {
    expect(scoreDashboardFeatures(baseFeatures()).grade).toBeDefined();

    // Directly exercise grade boundaries via a hand-built high-scoring feature set.
    const strong = scoreDashboardFeatures({
      ...baseFeatures(),
      tableCount: 2,
      tablesWithHeadCount: 2,
      sortIndicatorCount: 2,
      paginationDetected: true,
      rowActionCount: 1,
      kpiCandidateCount: 4,
      searchInputCount: 1,
      filterSelectCount: 1,
      filterChipCount: 1,
      emptyStateDetected: true,
      navLinkCount: 6,
      roleKeywordCount: 4,
      maxNavDepth: 2,
    });

    expect(strong.overallScore).toBeGreaterThanOrEqual(90);
    expect(strong.grade).toBe("A");
  });
});

describe("runDashboardAudit", () => {
  it("extracts and scores in one call, matching the two-step pipeline", () => {
    const combined = runDashboardAudit(RICH_DASHBOARD_HTML);
    const twoStep = scoreDashboardFeatures(extractDashboardFeatures(RICH_DASHBOARD_HTML));

    expect(combined).toEqual(twoStep);
  });
});
