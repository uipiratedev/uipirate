"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  /** The tenant boundary — equals the Admin._id string */
  tenantId: string;
  plan: "free" | "starter" | "pro" | "enterprise";
}

export function useAuth(requireAuth: boolean = false) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  const isSubdomain =
    typeof window !== "undefined" &&
    (window.location.hostname.startsWith("cos.") ||
      window.location.hostname === "cos.uipirate.com");
  const loginUrl = isSubdomain ? "/login" : "/pirateCOS/login";

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/pirateCOS/auth/me");
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
        if (requireAuth) {
          router.push(loginUrl);
        }
      }
    } catch (error) {
      setUser(null);
      if (requireAuth) {
        router.push(loginUrl);
      }
    } finally {
      setIsLoading(false);
    }
  }, [requireAuth, router, loginUrl]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/pirateCOS/auth/logout", { method: "POST" });
      setUser(null);
      router.push(loginUrl);
    } catch (error) {
      // Logout failed
    }
  }, [router, loginUrl]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshAuth: checkAuth,
  };
}
