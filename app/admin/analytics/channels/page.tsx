import ChannelsClient from "./ChannelsClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Channels" };

export default async function ChannelsPage() {
  await requireCapabilityPage("view:dashboard", "/admin/analytics/channels");

  return <ChannelsClient />;
}
