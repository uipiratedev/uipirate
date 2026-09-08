import OverviewClient from "./OverviewClient";

import { requireSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const user = await requireSession();

  return <OverviewClient userName={user.name} />;
}
