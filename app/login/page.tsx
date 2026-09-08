"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";

function LoginForm() {
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/admin";
  const next = rawNext.startsWith("/admin") ? rawNext : "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Sign in failed. Please try again.");
        setLoading(false);

        return;
      }

      // Full navigation so the middleware re-evaluates with the new cookie.
      window.location.assign(
        data.user?.mustChangePassword
          ? "/admin/settings/account?forceChange=1"
          : next,
      );
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">UI Pirate</h1>
          <p className="mt-1 text-sm text-gray-500">Dashboard sign in</p>
        </div>

        <form
          className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          onSubmit={onSubmit}
        >
          <Input
            isRequired
            autoComplete="email"
            label="Email"
            labelPlacement="outside"
            placeholder="you@uipirate.com"
            type="email"
            value={email}
            variant="bordered"
            onValueChange={setEmail}
          />
          <Input
            isRequired
            autoComplete="current-password"
            label="Password"
            labelPlacement="outside"
            placeholder="••••••••"
            type="password"
            value={password}
            variant="bordered"
            onValueChange={setPassword}
          />

          {error ? (
            <p
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <Button
            className="w-full"
            color="primary"
            isLoading={loading}
            type="submit"
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Access is invite-only. Contact a website admin if you need an account.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LoginForm />
    </Suspense>
  );
}
