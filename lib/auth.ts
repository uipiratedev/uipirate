import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import dbConnect from "./mongodb";
import Admin from "@/models/Admin";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Verify JWT token and return payload
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get token from cookies
 */
export async function getToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");
    return token?.value || null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;

  const payload = await verifyToken(token);
  return !!payload;
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

    // Fetch user from database to ensure they still exist and are active
    await dbConnect();
    const admin = await Admin.findById(payload.userId);

    if (!admin || !admin.isActive) {
      return null;
    }

    return {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
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
    redirect("/admin/login");
  }

  return user;
}

/**
 * Verify authentication for API routes
 * Returns user if authenticated, null otherwise
 */
export async function verifyAuth(): Promise<User | null> {
  return await getCurrentUser();
}
