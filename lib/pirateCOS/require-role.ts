import { NextResponse } from "next/server";
import { User } from "./auth";

type OrgRole = "org-admin" | "admin" | "editor" | "viewer";

/**
 * Returns true if the user has one of the allowed org roles.
 * Individual account holders always pass — they own their entire tenant.
 */
export function requireOrgRole(user: User, allowed: OrgRole[]): boolean {
  if (user.accountType === "individual") return true;
  if (!user.orgRole || user.orgRole === "individual") return true;
  return allowed.includes(user.orgRole as OrgRole);
}

/**
 * Returns a 403 NextResponse if the user lacks the required role, otherwise null.
 * Usage:
 *   const denied = checkRole(user, ["org-admin", "admin"]);
 *   if (denied) return denied;
 */
export function checkRole(user: User, allowed: OrgRole[]): NextResponse | null {
  if (requireOrgRole(user, allowed)) return null;
  return NextResponse.json(
    { success: false, error: "Insufficient permissions" },
    { status: 403 }
  );
}

/**
 * Role hierarchy reference:
 *   org-admin  — full access: billing, org membership, settings, content, teams
 *   admin      — content + teams + AI config; no billing or org membership management
 *   editor     — create/edit/publish own content, upload media, use AI; no settings
 *   viewer     — read-only across all resources
 *   individual — owns their tenant; bypasses all role checks
 */
