import MarketingClient from "./MarketingClient";

import { requireCapabilityPage } from "@/lib/auth/session";
import { can } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Marketing" };

export default async function MarketingPage() {
  const user = await requireCapabilityPage("view:leads", "/admin/outreach");

  return (
    <MarketingClient
      canManage={can(user.role, "manage:leads")}
      stage="outreach"
    />
  );
}
