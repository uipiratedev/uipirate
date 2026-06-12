import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

import dbConnect from "../mongodb";

import Admin from "@/models/pirateCOS/Admin";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  tenantId: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  accountType: "individual" | "organization";
  orgRole: "individual" | "org-admin" | "admin" | "editor" | "viewer";
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  /** The tenant boundary — equals the Admin._id string, or parentOrgId for members */
  tenantId: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  accountType: "individual" | "organization";
  orgRole: "individual" | "org-admin" | "admin" | "editor" | "viewer";
  avatar?: string;
}

/**
 * Verify JWT token and return payload
 */
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JWTPayload;

    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get token from cookies
 */
async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    return token?.value || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getToken();

    if (!token) return null;

    const payload = await verifyToken(token);

    if (!payload) return null;

    // Fetch user from database to ensure they still exist and are active.
    await dbConnect();
    const admin = await Admin.findById(payload.userId).lean();

    if (!admin || !admin.isActive) {
      return null;
    }

    // Org members inherit the plan from their org owner
    let effectivePlan: User["plan"] = (admin as any).plan ?? "free";
    const parentOrgId = (admin as any).parentOrgId;
    if (parentOrgId) {
      const orgOwner = await Admin.findById(parentOrgId).lean();
      if (orgOwner) effectivePlan = (orgOwner as any).plan ?? "free";
    }

    return {
      id: String(admin._id),
      name: (admin as any).name,
      email: (admin as any).email,
      role: (admin as any).role,
      tenantId: String(parentOrgId || admin._id), // each Admin is their own tenant unless org member
      plan: effectivePlan,
      accountType: (admin as any).accountType ?? "individual",
      orgRole: (admin as any).orgRole ?? "individual",
      avatar: (admin as any).avatar ?? "",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Require authentication - redirect to login if not authenticated
 * Use this in server components
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    const host = (await headers()).get("host") || "";
    const isSubdomain =
      host.startsWith("cos.") || hostnameEquals(host, "cos.uipirate.com");

    redirect(isSubdomain ? "/login" : "/pirateCOS/login");
  }

  return user;
}

function hostnameEquals(host: string, target: string): boolean {
  return host.split(":")[0] === target;
}

/**
 * Verify authentication for API routes
 * Returns user if authenticated, null otherwise
 */
export async function verifyAuth(): Promise<User | null> {
  return await getCurrentUser();
}
