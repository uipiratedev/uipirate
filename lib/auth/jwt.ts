/**
 * Session token signing/verification for Node runtimes (API routes, server
 * components). The Edge middleware uses `lib/auth/edge.ts` (jose) instead —
 * `jsonwebtoken` does not run on the Edge runtime.
 */
import type { Role } from "./roles";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set — required for dashboard auth.");
}

/** 7 days, in seconds — matches the auth cookie maxAge. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const AUTH_COOKIE = "up_session";

export interface SessionTokenPayload {
  uid: string;
  email: string;
  role: Role;
}

export function signSession(payload: SessionTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: SESSION_MAX_AGE,
    issuer: "uipirate",
    audience: "uipirate-admin",
  });
}

export function verifySession(token: string): SessionTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string, {
      issuer: "uipirate",
      audience: "uipirate-admin",
    }) as jwt.JwtPayload;

    if (!decoded || typeof decoded.uid !== "string") return null;

    return { uid: decoded.uid, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}
