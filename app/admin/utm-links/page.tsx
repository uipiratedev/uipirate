import UtmLinksClient from "./UtmLinksClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "UTM Links" };

export default async function UtmLinksPage() {
  await requireCapabilityPage("view:dashboard", "/admin/utm-links");

  return <UtmLinksClient />;
}
