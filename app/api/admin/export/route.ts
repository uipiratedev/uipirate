import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import { rangeFromRequest } from "@/lib/admin/apiRange";
import { listLeads } from "@/lib/analytics/leads";
import { getPagesReport, getClicksReport } from "@/lib/analytics/queries";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toCsv(
  rows: Array<Record<string, unknown>>,
  headers: string[],
): string {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);

    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ].join("\n");
}

export async function GET(req: NextRequest) {
  const guard = await requireApi("export:data");

  if (!guard.ok) return guard.response;

  const { from, to } = rangeFromRequest(req);
  const type = req.nextUrl.searchParams.get("type") || "leads";

  let csv = "";
  let filename = "export.csv";

  if (type === "leads") {
    const { rows } = await listLeads({ from, to, pageSize: 5000, page: 1 });

    csv = toCsv(
      rows.map((r) => ({
        created: r.createdAt,
        kind: r.kind,
        name: r.name,
        email: r.email,
        status: r.status,
        source: r.source,
        detail: r.detail,
        visitorId: r.visitorId || "",
      })),
      [
        "created",
        "kind",
        "name",
        "email",
        "status",
        "source",
        "detail",
        "visitorId",
      ],
    );
    filename = "leads.csv";
  } else if (type === "pages") {
    const rows = await getPagesReport({ from, to }, 1000);

    csv = toCsv(rows as never, [
      "path",
      "views",
      "uniqueVisitors",
      "avgDwellMs",
      "avgScrollDepth",
      "entrances",
      "exits",
      "bounceRate",
    ]);
    filename = "pages.csv";
  } else if (type === "clicks") {
    const rows = await getClicksReport({ from, to }, undefined, 2000);

    csv = toCsv(rows as never, [
      "label",
      "path",
      "tag",
      "href",
      "section",
      "clicks",
      "uniqueVisitors",
      "pageViews",
      "ctr",
    ]);
    filename = "clicks.csv";
  } else {
    return NextResponse.json({ error: "Unknown export type" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
