/**
 * Joins the three things that were previously on three separate screens:
 * our own traffic, Search Console impressions/clicks, and index status.
 *
 * Keeping them apart hid the single most important fact about this site:
 * `/design-tokens-how-to-build-an-enterprise-grade-token-system` pulled ~229
 * visitors in 30 days while being *not indexed on Google*. Traffic alone
 * looks like a win; search data alone looks like a dead page; only the join
 * shows a page earning traffic with zero search help.
 */
import dbConnect from "@/lib/mongodb";
import AnalyticsHitDaily from "@/models/analytics/AnalyticsHitDaily";
import IndexedUrl from "@/models/IndexedUrl";
import { getSearchIntelligence } from "@/lib/analytics/searchConsole";

export type ContentFlag =
  | "traffic-not-indexed"
  | "ranks-low-ctr"
  | "impressions-no-clicks"
  | "indexed-no-traffic";

export interface ContentRow {
  path: string;
  hits: number;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number | null;
  indexed: boolean | null;
  flags: ContentFlag[];
}

export interface ContentPerformance {
  rows: ContentRow[];
  /** True when the search half is placeholder data. */
  searchMocked: boolean;
  /** False until the server-side counter has recorded a single hit. */
  hasTrafficData: boolean;
}

/** Path from an absolute or relative URL; "" when unusable. */
function toPath(input: string | null | undefined): string {
  if (!input) return "";

  try {
    const p = input.startsWith("http")
      ? new URL(input).pathname
      : input.split("?")[0];

    // Normalise: strip a trailing slash except for the root.
    return p.length > 1 ? p.replace(/\/+$/, "") : p;
  } catch {
    return "";
  }
}

/**
 * Flags are ordered by how much they should worry you; the UI shows the
 * first one as the row's headline issue.
 */
export function flagRow(r: {
  hits: number;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number | null;
  indexed: boolean | null;
}): ContentFlag[] {
  const flags: ContentFlag[] = [];

  // Earning traffic with no search presence — fix indexing first.
  if (r.hits >= 50 && r.indexed === false) flags.push("traffic-not-indexed");

  // Ranking well but nobody clicks — title/description problem.
  if (r.position !== null && r.position <= 10 && r.impressions >= 10 && r.ctr < 0.02)
    flags.push("ranks-low-ctr");

  // Shown but never chosen — intent mismatch.
  if (r.impressions >= 10 && r.clicks === 0) flags.push("impressions-no-clicks");

  // Indexed and ignored — thin or off-target.
  if (r.indexed === true && r.hits < 5) flags.push("indexed-no-traffic");

  return flags;
}

export async function getContentPerformance(range: {
  from: Date;
  to: Date;
}): Promise<ContentPerformance> {
  await dbConnect();

  const fromKey = range.from.toISOString().slice(0, 10);
  const toKey = range.to.toISOString().slice(0, 10);

  const [hitRows, indexRows, search] = await Promise.all([
    AnalyticsHitDaily.aggregate([
      { $match: { date: { $gte: fromKey, $lte: toKey } } },
      { $group: { _id: "$path", hits: { $sum: "$hits" } } },
      { $sort: { hits: -1 } },
      { $limit: 500 },
    ]) as Promise<Array<{ _id: string; hits: number }>>,

    IndexedUrl.find({}, { path: 1, "google.coverageState": 1 }).lean(),

    getSearchIntelligence({ from: fromKey, to: toKey, engine: "all" }).catch(
      () => null,
    ),
  ]);

  const byPath = new Map<string, ContentRow>();

  const row = (path: string): ContentRow => {
    let r = byPath.get(path);

    if (!r) {
      r = {
        path,
        hits: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        position: null,
        indexed: null,
        flags: [],
      };
      byPath.set(path, r);
    }

    return r;
  };

  for (const h of hitRows) {
    const p = toPath(h._id);

    if (p) row(p).hits += h.hits;
  }

  for (const s of search?.pages ?? []) {
    const p = toPath(s.page);

    if (!p) continue;

    const r = row(p);

    r.impressions += s.impressions;
    r.clicks += s.clicks;
    // Position is an average, not a sum — keep the best (lowest) seen.
    r.position =
      r.position === null ? s.position : Math.min(r.position, s.position);
  }

  for (const i of indexRows as Array<{
    path?: string;
    google?: { coverageState?: string | null };
  }>) {
    const p = toPath(i.path);

    if (!p || !byPath.has(p)) continue;

    const state = i.google?.coverageState;

    // Google's own wording — anything other than "Submitted and indexed"
    // (or the "Indexed, …" variants) means it is not serving.
    byPath.get(p)!.indexed =
      state == null ? null : /indexed/i.test(state) && !/not indexed/i.test(state);
  }

  // Until the server-side counter has recorded anything, every page looks
  // like it has zero traffic — which would flag the whole site as
  // "indexed, no traffic" on the first deploy. Withhold traffic-dependent
  // judgement rather than show a screen of false alarms.
  const hasTrafficData = hitRows.length > 0;

  const rows = [...byPath.values()].map((r) => {
    r.ctr = r.impressions > 0 ? r.clicks / r.impressions : 0;
    r.flags = hasTrafficData
      ? flagRow(r)
      : // Search-only flags still hold without traffic data.
        flagRow(r).filter(
          (f) => f === "ranks-low-ctr" || f === "impressions-no-clicks",
        );

    return r;
  });

  rows.sort((a, b) => b.hits - a.hits || b.impressions - a.impressions);

  return { rows, searchMocked: Boolean(search?.mocked), hasTrafficData };
}
