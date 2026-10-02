import EngagementClient from "./EngagementClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Engagement" };

export default async function EngagementReportPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/engagement");

  return <EngagementClient />;
}
