"use client";

import type { Capability, NavItem, Role } from "@/lib/auth/roles";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { Icon, type IconKey } from "./icons";
import { DateRangeControl } from "./DateRangeControl";

import { navForRole, ROLE_LABELS } from "@/lib/auth/roles";
import { DashboardProvider } from "@/lib/admin/DashboardContext";

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
  };
  capabilities: Capability[];
  children: React.ReactNode;
}

function NavLink({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Glyph = Icon[item.icon as IconKey] ?? Icon.grid;

  return (
    <Link
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-gray-900 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
      href={item.href}
      onClick={onNavigate}
    >
      <Glyph className="h-[18px] w-[18px] shrink-0" />
      {item.label}
    </Link>
  );
}

const LogOutIcon = Icon["log-out"];

export function DashboardShell({ user, capabilities, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = navForRole(user.role);
  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-1 p-3">
      <Link className="mb-4 flex items-center gap-2 px-2 py-1" href="/admin">
        <span className="text-base font-bold text-gray-900">UI Pirate</span>
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Dashboard
        </span>
      </Link>
      {nav.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          onNavigate={() => setMobileOpen(false)}
        />
      ))}
      <div className="mt-auto px-2 pt-4">
        <a
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600"
          href="/"
          rel="noreferrer"
          target="_blank"
        >
          <Icon.external className="h-3.5 w-3.5" /> View live site
        </a>
      </div>
    </div>
  );

  return (
    <DashboardProvider capabilities={capabilities} user={user}>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white lg:block">
          <div className="sticky top-0 h-screen">{sidebar}</div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              role="presentation"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
              {sidebar}
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur">
            <button
              aria-label="Open menu"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Icon.menu className="h-5 w-5" />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <DateRangeControl />

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-gray-100">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                      {initials}
                    </span>
                    <span className="hidden text-left sm:block">
                      <span className="block text-sm font-medium leading-tight">
                        {user.name}
                      </span>
                      <span className="block text-[11px] leading-tight text-gray-400">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </span>
                    <Icon.chevron className="h-4 w-4 text-gray-400" />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Account">
                  <DropdownItem key="role" isReadOnly className="opacity-100">
                    <div className="flex items-center gap-2">
                      Signed in as
                      <Chip size="sm" variant="flat">
                        {ROLE_LABELS[user.role]}
                      </Chip>
                    </div>
                  </DropdownItem>
                  <DropdownItem key="account" href="/admin/settings/account">
                    Account &amp; password
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-danger"
                    color="danger"
                    startContent={<LogOutIcon className="h-4 w-4" />}
                    onPress={logout}
                  >
                    Sign out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
