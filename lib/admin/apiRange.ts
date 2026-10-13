import type { NextRequest } from "next/server";
import type { Granularity } from "@/lib/analytics/queries";

import { granularityFor, parseRangeParams } from "@/lib/admin/dateRange";

export function rangeFromRequest(req: NextRequest): {
  from: Date;
  to: Date;
  granularity: Granularity;
  preset: string;
} {
  const { from, to, preset } = parseRangeParams(req.nextUrl.searchParams);

  return { from, to, preset, granularity: granularityFor(preset) };
}
