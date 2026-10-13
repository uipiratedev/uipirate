/**
 * Server-side session access for API route handlers and server components.
 *
 * `getSession()` is the trust boundary: it verifies the cookie token AND
 * reloads the user from Mongo, so a deactivated or role-changed user loses
 * access on their next request regardless of what their token still claims.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import {
  AUTH_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
} from "./jwt";
import { can, type Capability, type Role } from "./roles";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  mustChangePassword: boolean;
}

export async function getSession(): Promise<SessionUser | null> {
  const token = cookies().get(AUTH_COOKIE)?.value;

  if (!token) return null;

  const payload = verifySession(token);

  if (!payload) return null;

  await dbConnect();
  const user = await User.findById(payload.uid).lean<{
    _id: unknown;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    avatar?: string;
    mustChangePassword?: boolean;
  }>();

  if (!user || !user.isActive) return null;

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    mustChangePassword: Boolean(user.mustChangePassword),
  };
}

/** For server components under /admin — bounce to login, preserving the target. */
export async function requireSession(
  nextPath = "/admin",
): Promise<SessionUser> {
  const user = await getSession();

  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  return user;
}

/** For server components — 404-style bounce when the user lacks a capability. */
export async function requireCapabilityPage(
  capability: Capability,
  nextPath = "/admin",
): Promise<SessionUser> {
  const user = await requireSession(nextPath);

  if (!can(user.role, capability)) redirect("/admin");

  return user;
}

type GuardResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: NextResponse };

/**
 * For API route handlers. Returns either the user or a ready-to-return JSON
 * error response:
 *
 *   const guard = await requireApi("view:leads");
 *   if (!guard.ok) return guard.response;
 *   const { user } = guard;
 */
export async function requireApi(
  capability?: Capability,
): Promise<GuardResult> {
  const user = await getSession();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 },
      ),
    };
  }

  if (capability && !can(user.role, capability)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, user };
}

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

/** Attaches a fresh session cookie to a response. */
export function setSessionCookie(
  res: NextResponse,
  payload: { uid: string; email: string; role: Role },
): void {
  res.cookies.set(AUTH_COOKIE, signSession(payload), authCookieOptions);
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(AUTH_COOKIE, "", { ...authCookieOptions, maxAge: 0 });
}
