import type { Metadata } from "next";

import { requireSession } from "@/lib/auth/session";
import { capabilitiesFor } from "@/lib/auth/roles";
import { DashboardShell } from "@/components/admin/DashboardShell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · UI Pirate Dashboard" },
  robots: { index: false, follow: false },
};

// Session + role state is per-request; never statically render the dashboard.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();

  return (
    <DashboardShell capabilities={capabilitiesFor(user.role)} user={user}>
      {children}
    </DashboardShell>
  );
}
