import { redirect } from "next/navigation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  accountType: "individual" | "organization";
  orgRole: "individual" | "org-admin" | "admin" | "editor" | "viewer";
  avatar?: string;
}

/**
 * Get current user from token (Mocked for public reader)
 */
export async function getCurrentUser(): Promise<User | null> {
  return null;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(): Promise<User> {
  redirect("/login");
}

/**
 * Verify authentication for API routes
 */
export async function verifyAuth(): Promise<User | null> {
  return null;
}
