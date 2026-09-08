import ClicksClient from "./ClicksClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clicks & Buttons" };

export default async function ClicksReportPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/clicks");

  return <ClicksClient />;
}
