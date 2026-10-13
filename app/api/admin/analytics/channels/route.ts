import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import {
  getAnonymousTotal,
  getBotBreakdown,
  getBotTotal,
  getChannelBreakdown,
  getCountryBreakdown,
  getHitSeries,
  getTopSources,
} from "@/lib/analytics/anonymous";
import { getSummary } from "@/lib/analytics/queries";
import { getSnapshots } from "@/lib/analytics/snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Powers the Channels screen. Everything here comes from the consent-free
 * counter except `consented`, which comes from the session table — the two
 * side by side are what expose the tracking gap instead of hiding it.
 */
export async function GET(req: NextRequest) {
  const guard = await requireApi("view:dashboard");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);
  const range = { from, to };

  const [total, channels, sources, series, countries, bots, botTotal, consented] =
    await Promise.all([
      getAnonymousTotal(range),
      getChannelBreakdown(range),
      getTopSources(range),
      getHitSeries(range),
      getCountryBreakdown(range),
      getBotBreakdown(range),
      getBotTotal(range),
      getSummary(range).catch(() => null),
    ]);

  const consentedViews = consented?.pageviews ?? 0;
  const snapshots = await getSnapshots(12).catch(() => []);

  return NextResponse.json({
    range: { from, to },
    total,
    consentedViews,
    // What share of real traffic the consented tracker actually sees.
    consentRate: total > 0 ? consentedViews / total : null,
    channels,
    sources,
    series,
    countries,
    bots,
    botTotal,
    snapshots,
  });
}
