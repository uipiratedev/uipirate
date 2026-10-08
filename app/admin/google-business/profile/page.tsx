import ProfileClient from "./ProfileClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Google Business Profile details" };

export default async function GoogleBusinessProfilePage() {
  await requireCapabilityPage("manage:indexing", "/admin/google-business/profile");

  return <ProfileClient />;
}
