import FunnelClient from "./FunnelClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Funnel" };

export default async function FunnelPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/funnel");

  return <FunnelClient />;
}
