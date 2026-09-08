import VisitorsClient from "./VisitorsClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Visitors" };

export default async function VisitorsPage() {
  await requireCapabilityPage("view:visitors:pii", "/admin/visitors");

  return <VisitorsClient />;
}
