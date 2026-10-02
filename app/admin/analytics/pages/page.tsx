import PagesClient from "./PagesClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pages" };

export default async function PagesReportPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/pages");

  return <PagesClient />;
}
