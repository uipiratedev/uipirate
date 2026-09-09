import { requireCapabilityPage } from "@/lib/auth/session";
import SearchAnalyticsClient from "./SearchAnalyticsClient";

export const dynamic = "force-dynamic";

export default async function SearchAnalyticsPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/search");

  return <SearchAnalyticsClient />;
}
