import AccountClient from "./AccountClient";

import { requireSession } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireSession("/admin/settings/account");

  return (
    <AccountClient
      email={user.email}
      mustChange={user.mustChangePassword}
      name={user.name}
      roleLabel={ROLE_LABELS[user.role]}
    />
  );
}
