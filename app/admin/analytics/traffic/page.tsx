import TrafficClient from "./TrafficClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Traffic" };

export default async function TrafficPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/traffic");

  return <TrafficClient />;
}
