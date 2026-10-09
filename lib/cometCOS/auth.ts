import { redirect } from "next/navigation";

import { getSession, type SessionUser } from "@/lib/auth/session";

/**
 * Legacy shim. The real auth now lives in `@/lib/auth/*`. This file is kept
 * only because `app/[slug]/page.tsx` imports `verifyAuth` to decide whether a
 * blog view came from a signed-in staff member (those views are not counted).
 */
export type User = SessionUser;

export async function getCurrentUser(): Promise<User | null> {
  return getSession();
}

export async function requireAuth(): Promise<User> {
  const user = await getSession();

  if (!user) redirect("/login");

  return user;
}

/** Used by the public blog reader to skip view-tracking for staff. */
export async function verifyAuth(): Promise<User | null> {
  return getSession();
}
