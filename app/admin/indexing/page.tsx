import { requireCapabilityPage } from "@/lib/auth/session";
import IndexingClient from "./IndexingClient";

export const metadata = {
  title: "Indexing Management | UI Pirate Admin",
};

export default async function IndexingPage() {
  const user = await requireCapabilityPage("manage:indexing", "/admin/indexing");

  return <IndexingClient user={user} />;
}
