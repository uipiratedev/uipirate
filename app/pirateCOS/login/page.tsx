"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/pirateCOS/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);

        return;
      }

      // Redirect to dashboard or callback URL
      const isSubdomain =
        typeof window !== "undefined" &&
        (window.location.hostname.startsWith("cos.") ||
          window.location.hostname === "cos.uipirate.com");
      const defaultDest = isSubdomain ? "/dashboard" : "/pirateCOS/dashboard";
      const callbackUrl = searchParams.get("callbackUrl") || defaultDest;

      router.push(callbackUrl);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex dark text-foreground"
      style={{ background: "#151514" }}
    >
      {/* Left branding panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-80 p-10 flex-shrink-0"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#FF5B04" }}
          >
            <svg fill="none" height="16" viewBox="0 0 32 32" width="16">
              <path
                clipRule="evenodd"
                d="M17.648 10.13L15.878 7.026 7.03 22.55h3.498l7.12-12.42zm2.232 3.916l-1.77 3.152 1.284 2.253h-2.549l-1.74 3.099h9.622l-4.847-8.504z"
                fill="white"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-white font-semibold font-geist text-sm">
            UI Pirate
          </span>
        </div>
        <div>
          <p
            className="text-xs font-jetbrains-mono uppercase tracking-widest mb-3"
            style={{ color: "#FF5B04" }}
          >
            pirateCOS Panel
          </p>
          <p className="text-white font-geist text-2xl font-bold leading-snug">
            Manage your content.
          </p>
          <p
            className="mt-2 text-sm font-geist"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Secure access — authorized personnel only.
          </p>
        </div>
        <p
          className="text-xs font-geist"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          © {new Date().getFullYear()} UI Pirate
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#FF5B04" }}
            >
              <svg fill="none" height="16" viewBox="0 0 32 32" width="16">
                <path
                  clipRule="evenodd"
                  d="M17.648 10.13L15.878 7.026 7.03 22.55h3.498l7.12-12.42zm2.232 3.916l-1.77 3.152 1.284 2.253h-2.549l-1.74 3.099h9.622l-4.847-8.504z"
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-white font-semibold font-geist text-sm">
              UI Pirate pirateCOS
            </span>
          </div>

          <h1 className="text-2xl font-bold font-geist text-white tracking-tight mb-1">
            Sign in
          </h1>
          <p
            className="text-sm font-geist mb-8"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Enter your credentials to continue
          </p>

          {error && (
            <div
              className="mb-6 p-3.5 rounded-xl border text-sm font-geist"
              style={{
                background: "rgba(239,68,68,0.1)",
                borderColor: "rgba(239,68,68,0.2)",
                color: "#F87171",
              }}
            >
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input
                required
                classNames={{
                  label: "text-xs font-medium font-sans !text-white/50 mb-1",
                  inputWrapper:
                    "h-12 bg-white/5 border-white/10 hover:border-white/20 data-[focused=true]:border-[#FF5B04] transition-all",
                  input:
                    "text-base font-sans !text-white placeholder:!text-white/40",
                }}
                disabled={isLoading}
                label="Email"
                labelPlacement="outside"
                placeholder="admin@uipirate.com"
                radius="lg"
                size="lg"
                type="email"
                value={email}
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                required
                classNames={{
                  label: "text-xs font-medium font-sans !text-white/50 mb-1",
                  inputWrapper:
                    "h-12 bg-white/5 border-white/10 hover:border-white/20 data-[focused=true]:border-[#FF5B04] transition-all",
                  input:
                    "text-base font-sans !text-white placeholder:!text-white/40",
                }}
                disabled={isLoading}
                label="Password"
                labelPlacement="outside"
                placeholder="••••••••"
                radius="lg"
                size="lg"
                type="password"
                value={password}
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full h-11 font-geist font-semibold text-sm text-white rounded-xl mt-2"
              disabled={isLoading}
              isLoading={isLoading}
              style={{ background: "#FF5B04" }}
              type="submit"
            >
              {isLoading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 text-center flex flex-col gap-3">
            <a
              className="text-xs font-geist text-white/50 hover:text-white transition-colors"
              href={
                typeof window !== "undefined" &&
                (window.location.hostname.startsWith("cos.") ||
                  window.location.hostname === "cos.uipirate.com")
                  ? "/register"
                  : "/pirateCOS/register"
              }
            >
              Don't have an account?{" "}
              <span className="font-semibold" style={{ color: "#FF5B04" }}>
                Sign Up
              </span>
            </a>

            <a
              className="text-xs font-geist transition-colors mt-2"
              href="/"
              style={{ color: "rgba(255,255,255,0.25)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.25)")
              }
            >
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PirateCOSLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
