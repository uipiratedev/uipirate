import GoogleBusinessClient from "./GoogleBusinessClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Google Business Profile" };

export default async function GoogleBusinessPage() {
  await requireCapabilityPage("manage:indexing", "/admin/google-business");

  return <GoogleBusinessClient />;
}
