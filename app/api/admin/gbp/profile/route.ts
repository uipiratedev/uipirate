import { NextRequest, NextResponse } from "next/server";

import { requireApi } from "@/lib/auth/session";
import dbConnect from "@/lib/mongodb";
import GbpProfileChange from "@/models/GbpProfileChange";
import { GbpError } from "@/lib/gbp/client";
import { getAttributes, planLinks, writeAttributes } from "@/lib/gbp/attributes";
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
    const linkPlan = planLinks(await getAttributes());

    return NextResponse.json({
      ok: true,
      profile,
      // `refresh` so the page offers the current wording, not just empty slots.
      servicePlan: planServices(profile.services, SITE_SERVICES, { refresh: true }),
      siteServices: SITE_SERVICES,
      linkPlan: { add: linkPlan.add, update: linkPlan.update, same: linkPlan.same },
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
      const plan = planServices(live.services, SITE_SERVICES, { refresh: true });

      await GbpProfileChange.create({
        field: "services",
        before: live.services,
        after: plan.next,
        by: guard.user.email,
      });
      await writeServices(plan.next);

      return NextResponse.json({ ok: true, profile: await getProfile() });
    }

    if (body.action === "apply-links") {
      const before = await getAttributes();
      const plan = planLinks(before);

      if (!plan.attributes.length) return NextResponse.json({ ok: true, profile: live });

      await GbpProfileChange.create({
        field: "links",
        before: before.filter((a) => plan.mask.includes(a.name)),
        after: plan.attributes,
        by: guard.user.email,
      });
      await writeAttributes(plan);

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
