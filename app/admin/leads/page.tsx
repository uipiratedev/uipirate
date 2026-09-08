import LeadsClient from "./LeadsClient";

import { requireCapabilityPage } from "@/lib/auth/session";
import { can } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Leads" };

export default async function LeadsPage() {
  const user = await requireCapabilityPage("view:leads", "/admin/leads");

  return (
    <LeadsClient
      canExport={can(user.role, "export:data")}
      canManage={can(user.role, "manage:leads")}
    />
  );
}
