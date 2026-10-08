import ContentClient from "./ContentClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content" };

export default async function ContentPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/content");

  return <ContentClient />;
}
