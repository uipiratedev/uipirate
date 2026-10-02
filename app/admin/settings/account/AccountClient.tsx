"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";

function AccountInner({
  name,
  email,
  roleLabel,
  mustChange,
}: {
  name: string;
  email: string;
  roleLabel: string;
  mustChange: boolean;
}) {
  const forceChange =
    useSearchParams().get("forceChange") === "1" || mustChange;

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (next.length < 8) {
      setMsg({
        kind: "err",
        text: "New password must be at least 8 characters.",
      });

      return;
    }
    if (next !== confirm) {
      setMsg({ kind: "err", text: "New passwords do not match." });

      return;
    }

    setSaving(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json().catch(() => ({}));

    setSaving(false);

    if (!res.ok) {
      setMsg({ kind: "err", text: data.error || "Could not update password." });

      return;
    }

    setMsg({ kind: "ok", text: "Password updated." });
    setCurrent("");
    setNext("");
    setConfirm("");

    if (forceChange) setTimeout(() => window.location.assign("/admin"), 800);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold text-gray-900">Account</h1>

      <dl className="mt-4 grid grid-cols-[100px_1fr] gap-y-2 text-sm">
        <dt className="text-gray-400">Name</dt>
        <dd className="text-gray-900">{name}</dd>
        <dt className="text-gray-400">Email</dt>
        <dd className="text-gray-900">{email}</dd>
        <dt className="text-gray-400">Role</dt>
        <dd className="text-gray-900">{roleLabel}</dd>
      </dl>

      {forceChange ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          You&apos;re using a temporary password. Please set a new one to
          continue.
        </p>
      ) : null}

      <form
        className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5"
        onSubmit={submit}
      >
        <h2 className="text-sm font-semibold text-gray-900">Change password</h2>
        <Input
          autoComplete="current-password"
          label="Current password"
          labelPlacement="outside"
          type="password"
          value={current}
          variant="bordered"
          onValueChange={setCurrent}
        />
        <Input
          autoComplete="new-password"
          label="New password"
          labelPlacement="outside"
          type="password"
          value={next}
          variant="bordered"
          onValueChange={setNext}
        />
        <Input
          autoComplete="new-password"
          label="Confirm new password"
          labelPlacement="outside"
          type="password"
          value={confirm}
          variant="bordered"
          onValueChange={setConfirm}
        />

        {msg ? (
          <p
            className={`rounded-lg px-3 py-2 text-sm ${
              msg.kind === "ok"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.text}
          </p>
        ) : null}

        <Button color="primary" isLoading={saving} type="submit">
          Update password
        </Button>
      </form>
    </div>
  );
}

export default function AccountClient(props: {
  name: string;
  email: string;
  roleLabel: string;
  mustChange: boolean;
}) {
  return (
    <Suspense fallback={null}>
      <AccountInner {...props} />
    </Suspense>
  );
}
