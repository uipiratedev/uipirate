import OverviewClient from "./OverviewClient";

import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "SEO & Tracking" };

export default async function SeoTrackingPage() {
  const user = await requireSession();

  return <OverviewClient userName={user.name} />;
}
