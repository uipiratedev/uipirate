import MarketingClient from "../MarketingClient";

import { requireCapabilityPage } from "@/lib/auth/session";
import { can } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

export default async function OutreachLeadsPage() {
  const user = await requireCapabilityPage(
    "view:leads",
    "/admin/outreach/leads",
  );

  return (
    <MarketingClient canManage={can(user.role, "manage:leads")} stage="leads" />
  );
}
