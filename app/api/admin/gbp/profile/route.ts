import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import dbConnect from "@/lib/mongodb";
import GbpProfileChange from "@/models/GbpProfileChange";
import { GbpError } from "@/lib/gbp/client";
import {
  SITE_SERVICES,
  getProfile,
  planServices,
  writeDescription,
  writeServices,
} from "@/lib/gbp/profile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The live profile and what would change to match the website. */
export async function GET() {
  const guard = await requireApi("manage:indexing");

  if (!guard.ok) return guard.response;

  try {
    const profile = await getProfile();

    return NextResponse.json({
      ok: true,
      profile,
      servicePlan: planServices(profile.services),
      siteServices: SITE_SERVICES,
    });
  } catch (err) {
    return fail(err);
  }
}

/**
 * Writes to the public profile. The plan is recomputed here from the live
 * profile — the browser only says which change to make, never what to write.
 */
export async function POST(req: NextRequest) {
  const guard = await requireApi("manage:indexing");

  if (!guard.ok) return guard.response;

  const body = (await req.json().catch(() => ({}))) as { action?: string; description?: string };

  try {
    await dbConnect();

    const live = await getProfile();

    if (body.action === "apply-services") {
      const plan = planServices(live.services);

      await GbpProfileChange.create({
        field: "services",
        before: live.services,
        after: plan.next,
        by: guard.user.email,
      });
      await writeServices(plan.next);

      return NextResponse.json({ ok: true, profile: await getProfile() });
    }

    if (body.action === "apply-description") {
      const text = String(body.description ?? "").trim();

      if (text.length < 50 || text.length > 750)
        return NextResponse.json(
          { ok: false, error: "The description must be 50–750 characters." },
          { status: 400 },
        );

      await GbpProfileChange.create({
        field: "description",
        before: live.description,
        after: text,
        by: guard.user.email,
      });
      await writeDescription(text);

      return NextResponse.json({ ok: true, profile: await getProfile() });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return fail(err);
  }
}

function fail(err: unknown) {
  const e = err instanceof GbpError ? err : null;

  return NextResponse.json(
    {
      ok: false,
      error: e?.message ?? (err instanceof Error ? err.message : "Request failed"),
      hint: e?.hint,
    },
    { status: e?.status && e.status >= 400 && e.status < 500 ? 400 : 500 },
  );
}
