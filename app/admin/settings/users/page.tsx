import UsersClient from "./UsersClient";

import { requireCapabilityPage } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Users & Roles" };

export default async function UsersPage() {
  const user = await requireCapabilityPage(
    "manage:users",
    "/admin/settings/users",
  );

  return <UsersClient currentUserId={user.id} />;
}
