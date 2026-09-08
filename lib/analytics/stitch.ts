/**
 * Links an anonymous first-party visitor to a freshly submitted lead so the
 * dashboard can show that lead's full pre-submission journey.
 *
 * Best-effort: every failure is swallowed — a stitch problem must never fail
 * the form submission that triggered it.
 */
import type mongoose from "mongoose";

import AnalyticsEvent from "@/models/analytics/AnalyticsEvent";
import AnalyticsSession from "@/models/analytics/AnalyticsSession";
import AnalyticsVisitor from "@/models/analytics/AnalyticsVisitor";

export async function stitchVisitorToLead(params: {
  visitorId: string | undefined | null;
  leadId: mongoose.Types.ObjectId | string;
  email: string;
  path?: string;
  formName: string;
}): Promise<void> {
  const { visitorId, leadId, email, path, formName } = params;

  if (!visitorId || typeof visitorId !== "string") return;

  try {
    await Promise.all([
      AnalyticsVisitor.updateOne(
        { visitorId },
        {
          $set: {
            leadId,
            identifiedAt: new Date(),
            identifiedEmail: email.toLowerCase(),
          },
          $setOnInsert: {
            visitorId,
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
          },
        },
        { upsert: true },
      ),
      AnalyticsSession.updateMany(
        { visitorId, leadId: { $exists: false } },
        { $set: { leadId } },
      ),
      AnalyticsEvent.updateMany(
        { visitorId, leadId: { $exists: false } },
        { $set: { leadId } },
      ),
      AnalyticsEvent.create({
        type: "form_submit",
        visitorId,
        sessionId: `server-${Date.now()}`,
        ipHash: "server",
        leadId,
        path: path || "/",
        formName,
        isBot: false,
        occurredAt: new Date(),
      }),
    ]);
  } catch {
    /* best-effort */
  }
}
