// lib/pirateCOS/require-role.ts
import { User } from "./auth";

/**
 * Checks if the user has one of the allowed roles.
 * Individual account roles are not governed by org hierarchy, so this returns false for 'individual'.
 */
export function requireOrgRole(
  user: User,
  allowed: Array<"org-admin" | "admin" | "editor" | "viewer">
): boolean {
  if (user.orgRole === "individual") return false;
  return allowed.includes(user.orgRole as any);
}
