import { requireCapabilityPage } from "@/lib/auth/session";
import SitemapDiffClient from "./SitemapDiffClient";

export const metadata = {
  title: "Sitemap Reconciliation Diff | UI Pirate Admin",
};

export default async function SitemapDiffPage() {
  const user = await requireCapabilityPage("manage:indexing", "/admin/indexing/sitemap");

  return <SitemapDiffClient user={user} />;
}
