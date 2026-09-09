"use client";

import type { Capability, NavItem, Role } from "@/lib/auth/roles";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Chip,
  Drawer,
  DrawerBody,
  DrawerContent,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@heroui/react";

import { Icon, type IconKey } from "./icons";
import { DateRangeControl } from "./DateRangeControl";

import { navForRole, ROLE_LABELS } from "@/lib/auth/roles";
import { DashboardProvider } from "@/lib/admin/DashboardContext";
import { useDrawerScrollLock } from "@/hooks/useDrawerScrollLock";

const PAGE_META: Array<{
  prefix: string;
  exact?: boolean;
  title: string;
  description: string;
}> = [
  {
    prefix: "/admin/analytics/traffic",
    title: "Traffic Pulse",
    description:
      "Traffic volume, acquisition sources, geo distribution, and device platforms.",
  },
  {
    prefix: "/admin/analytics/pages",
    title: "Page Performance",
    description:
      "Views, dwell time, scroll depth, entry and bounce rates across all published URLs.",
  },
  {
    prefix: "/admin/analytics/clicks",
    title: "Clicks & Element Analytics",
    description:
      "Every tracked click — buttons, links, tools, and component lab sub-components.",
  },
  {
    prefix: "/admin/analytics/engagement",
    title: "Engagement Dynamics",
    description:
      "User interaction intensity, scroll depth distribution, and session dwell metrics.",
  },
  {
    prefix: "/admin/leads",
    title: "Leads Management",
    description:
      "Contact forms and project estimates with customer journey attribution.",
  },
  {
    prefix: "/admin/visitors",
    title: "Visitors Telemetry",
    description:
      "Multi-session customer journeys, geo-location attribution, and device signatures.",
  },
  {
    prefix: "/admin/analytics/search",
    title: "Search Intelligence",
    description:
      "Google Search Console and Bing Webmaster organic queries, keyword rankings, impressions, and country attribution.",
  },
  {
    prefix: "/admin/indexing/sitemap",
    title: "Sitemap Diff & Inspection",
    description:
      "Compare database URLs against sitemap.xml to spot unindexed pages or orphans.",
  },
  {
    prefix: "/admin/indexing",
    title: "Indexing Management",
    description:
      "Canonical URL submissions to Google & Bing, live coverage, and draft protection.",
  },
  {
    prefix: "/admin/settings/users",
    title: "Team & Access Control",
    description:
      "Manage admin permissions, roles, access capabilities, and user security.",
  },
  {
    prefix: "/admin/settings/account",
    title: "Account Settings",
    description:
      "Update your profile credentials, password, and security preferences.",
  },
  {
    prefix: "/admin",
    exact: true,
    title: "Executive Overview",
    description:
      "High-level performance, traffic pulse, conversion velocity, and real-time site health.",
  },
];

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
      className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-gray-900 text-white shadow-sm font-semibold"
          : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
      }`}
      href={item.href}
      onClick={onNavigate}
    >
      <Glyph
        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
          active ? "text-white" : "text-gray-400 group-hover:text-gray-700"
        }`}
      />
      <span>{item.label}</span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      )}
    </Link>
  );
}

const LogOutIcon = Icon["log-out"];

export function DashboardShell({ user, capabilities, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useDrawerScrollLock({
    enabled: mobileOpen,
    onClose: () => setMobileOpen(false),
  });

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
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link
          className="flex items-center justify-between gap-2 px-2 py-1 transition-opacity hover:opacity-90"
          href="/admin"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm ring-1 ring-black/10">
              <span className="font-mono text-sm font-bold tracking-tight">UI</span>
            </div>
            <div>
              <span className="block text-sm font-bold tracking-tight text-gray-900">
                UI Pirate
              </span>
              <span className="block text-[10px] font-medium text-gray-400">
                Management Console
              </span>
            </div>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600 ring-1 ring-gray-200">
            Admin
          </span>
        </Link>

        {/* Navigation items */}
        <nav className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Navigation
          </div>
          {nav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </div>

      {/* Footer / External link */}
      <div className="border-t border-gray-100 pt-3">
        <a
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          href="/"
          rel="noreferrer"
          target="_blank"
        >
          <span className="flex items-center gap-2">
            <Icon.external className="h-3.5 w-3.5 text-gray-400" />
            Live Marketing Site
          </span>
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            ↗
          </span>
        </a>
      </div>
    </div>
  );

  return (
    <DashboardProvider capabilities={capabilities} user={user}>
      <div className="flex min-h-screen bg-[#F8FAFC] text-gray-900 antialiased">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200/80 bg-white lg:block">
          <div className="sticky top-0 h-screen">{sidebar}</div>
        </aside>

        {/* Mobile drawer with HeroUI Drawer and isolated scroll */}
        <Drawer
          classNames={{
            base: "max-w-[280px] bg-white text-gray-900",
            body: "p-0 overflow-y-auto overscroll-contain",
            backdrop: "bg-black/50 backdrop-blur-sm",
          }}
          isOpen={mobileOpen}
          placement="left"
          size="sm"
          onOpenChange={(open) => setMobileOpen(open)}
        >
          <DrawerContent>
            {() => (
              <DrawerBody data-lenis-prevent="true">
                {sidebar}
              </DrawerBody>
            )}
          </DrawerContent>
        </Drawer>

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-gray-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <button
                aria-label="Open menu"
                className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden shrink-0"
                onClick={() => setMobileOpen(true)}
              >
                <Icon.menu className="h-5 w-5" />
              </button>

              {/* Title & Description Tooltip in Header */}
              {(() => {
                const currentMeta = PAGE_META.find((m) =>
                  m.exact ? pathname === m.prefix : pathname.startsWith(m.prefix),
                ) || {
                  title: "Admin Console",
                  description: "Management, analytics and system operations console.",
                };

                return (
                  <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-sm font-bold tracking-tight text-gray-900 sm:text-base truncate">
                      {currentMeta.title}
                    </h1>
                    {currentMeta.description ? (
                      <Tooltip
                        showArrow
                        className="max-w-sm rounded-xl border border-gray-100 bg-white p-3 text-xs font-normal leading-relaxed text-gray-700 shadow-xl"
                        content={currentMeta.description}
                        placement="bottom-start"
                      >
                        <button
                          aria-label="Page information"
                          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:outline-none"
                          type="button"
                        >
                          ?
                        </button>
                      </Tooltip>
                    ) : null}
                  </div>
                );
              })()}
            </div>

            <div className="ml-auto flex items-center gap-3 shrink-0">
              <DateRangeControl />

              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <button className="flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50/80">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 text-xs font-semibold text-white shadow-sm">
                      {initials}
                    </span>
                    <span className="hidden text-left sm:block">
                      <span className="block text-xs font-semibold text-gray-900 leading-tight">
                        {user.name}
                      </span>
                      <span className="block text-[10px] font-medium text-gray-400 leading-tight">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </span>
                    <Icon.chevron className="h-3.5 w-3.5 text-gray-400" />
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

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
