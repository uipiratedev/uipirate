"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { fmtDateTime } from "@/components/admin/format";
import {
  ROLES,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  type Role,
} from "@/lib/auth/roles";

interface DashUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: string;
  mustChangePassword?: boolean;
  createdAt: string;
}

export default function UsersClient({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [users, setUsers] = useState<DashUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("team-member");
  const [inviting, setInviting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/auth/users", { credentials: "same-origin" })
      .then(async (r) => {
        const j = await r.json();

        if (!r.ok) throw new Error(j.error || "Failed to load users");

        return j.users as DashUser[];
      })
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    setBanner(null);
    const res = await fetch("/api/auth/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role }),
    });
    const j = await res.json().catch(() => ({}));

    setInviting(false);

    if (!res.ok) {
      setBanner(j.error || "Could not invite user.");

      return;
    }
    setBanner(`Invited ${email}. Temporary password: ${j.tempPassword}`);
    setName("");
    setEmail("");
    load();
  }

  async function mutate(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/auth/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({}));

    if (!res.ok) {
      setBanner(j.error || "Update failed.");

      return;
    }
    if (j.tempPassword) setBanner(`New temporary password: ${j.tempPassword}`);
    load();
  }

  return (
    <div className="space-y-5">
      <PageHeader
        description="Invite teammates and control what each role can see. Access is invite-only."
        title="Users & Roles"
      />

      {banner ? (
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
          {banner}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {ROLES.map((r) => (
          <div
            key={r}
            className="rounded-xl border border-gray-200 bg-white p-3"
          >
            <div className="text-sm font-semibold text-gray-900">
              {ROLE_LABELS[r]}
            </div>
            <p className="mt-1 text-xs text-gray-500">{ROLE_DESCRIPTIONS[r]}</p>
          </div>
        ))}
      </div>

      <Card title="Invite a user">
        <form
          className="grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto] sm:items-end"
          onSubmit={invite}
        >
          <Input
            isRequired
            label="Name"
            labelPlacement="outside"
            value={name}
            variant="bordered"
            onValueChange={setName}
          />
          <Input
            isRequired
            label="Email"
            labelPlacement="outside"
            type="email"
            value={email}
            variant="bordered"
            onValueChange={setEmail}
          />
          <Select
            label="Role"
            labelPlacement="outside"
            selectedKeys={[role]}
            variant="bordered"
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <SelectItem key={r}>{ROLE_LABELS[r]}</SelectItem>
            ))}
          </Select>
          <Button color="primary" isLoading={inviting} type="submit">
            Invite
          </Button>
        </form>
      </Card>

      <StatePanel
        error={error}
        loading={loading && !users.length}
        onRetry={load}
      >
        <Card bodyClassName="p-0" title={`${users.length} users`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">User</th>
                  <th className="px-3 py-2 text-left font-medium">Role</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">
                    Last login
                  </th>
                  <th className="px-3 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-3 py-2">
                      <span className="block font-medium text-gray-900">
                        {u.name}
                      </span>
                      <span className="block text-xs text-gray-400">
                        {u.email}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        className="rounded border border-gray-200 bg-white px-2 py-1 text-xs"
                        disabled={u._id === currentUserId}
                        value={u.role}
                        onChange={(e) =>
                          mutate(u._id, { role: e.target.value })
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.isActive ? "active" : "disabled"}
                      </span>
                      {u.mustChangePassword ? (
                        <span className="ml-1 text-[11px] text-amber-600">
                          temp pw
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-gray-500">
                      {u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : "never"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                          onClick={() => mutate(u._id, { resetPassword: true })}
                        >
                          Reset pw
                        </button>
                        {u._id !== currentUserId ? (
                          <button
                            className="rounded border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                            onClick={() =>
                              mutate(u._id, { isActive: !u.isActive })
                            }
                          >
                            {u.isActive ? "Disable" : "Enable"}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </StatePanel>
    </div>
  );
}
