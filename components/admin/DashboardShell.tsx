"use client";

import { useEffect, useState } from "react";
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

import {
  navForRole,
  workspaceForPath,
  ROLE_LABELS,
  type Capability,
  type NavItem,
  type Role,
} from "@/lib/auth/roles";
import { DashboardProvider } from "@/lib/admin/DashboardContext";
import { useDrawerScrollLock } from "@/hooks/useDrawerScrollLock";

const PAGE_META: Array<{
  prefix: string;
  exact?: boolean;
  title: string;
  description: string;
}> = [
  {
    prefix: "/admin/seo-tracking",
    title: "SEO & Tracking",
    description:
      "High-level performance, traffic pulse, conversion velocity, and real-time site health.",
  },
  {
    prefix: "/admin/outreach/leads",
    title: "Outreach Leads",
    description:
      "Uploaded leads waiting for a website check. Set Has Website to move a lead into Outreach.",
  },
  {
    prefix: "/admin/outreach",
    title: "Marketing & Outreach",
    description:
      "Track outreach records and call contacts directly.",
  },
  {
    prefix: "/admin/analytics/channels",
    title: "Channels",
    description:
      "Where traffic actually comes from — counted server-side, so it includes visitors who block scripts or decline cookies.",
  },
  {
    prefix: "/admin/analytics/funnel",
    title: "Funnel",
    description:
      "How many visitors reach pricing or contact and act — by landing page, channel and contact route.",
  },
  {
    prefix: "/admin/google-business",
    title: "Google Business Profile",
    description:
      "Announce articles and case studies on your Google listing — new posts within a day, the backlog on a schedule.",
  },
  {
    prefix: "/admin/utm-links",
    title: "UTM Links",
    description:
      "Tag the links you share so traffic shows up under a named source instead of Direct.",
  },
  {
    prefix: "/admin/analytics/content",
    title: "Content Performance",
    description:
      "Traffic, Search Console and index status per page, with flags for pages that need attention.",
  },
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
    title: "Home",
    description:
      "Choose between SEO & tracking analytics and marketing outreach.",
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
  collapsed = false,
}: {
  item: NavItem;
  onNavigate: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Glyph = Icon[item.icon as IconKey] ?? Icon.grid;

  return (
    <Link
      className={`group relative flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-gray-900 text-white shadow-sm font-semibold"
          : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
      }`}
      href={item.href}
      title={collapsed ? item.label : undefined}
      onClick={onNavigate}
    >
      <Glyph
        className={`h-[18px] w-[18px] shrink-0 transition-colors ${
          active ? "text-white" : "text-gray-400 group-hover:text-gray-700"
        }`}
      />
      <span
        className={`transition-opacity duration-200 ${collapsed ? "opacity-0" : "opacity-100"}`}
      >
        {item.label}
      </span>
      {active && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      )}
    </Link>
  );
}

const LogOutIcon = Icon["log-out"];

export function DashboardShell({ user, capabilities, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("admin-sidebar-collapsed") === "1");
    } catch {}
    // Enable the width transition only after the stored state is applied.
    const id = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(id);
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      try {
        localStorage.setItem("admin-sidebar-collapsed", c ? "0" : "1");
      } catch {}

      return !c;
    });
  }

  useDrawerScrollLock({
    enabled: mobileOpen,
    onClose: () => setMobileOpen(false),
  });

  const workspace = workspaceForPath(pathname);
  const nav = navForRole(user.role, workspace);
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

  const renderSidebar = (isCollapsed: boolean) => (
    <div className="flex h-full min-h-0 flex-col p-4">
      {/* Brand Header */}
      <div
        className="flex shrink-0 items-center gap-2 whitespace-nowrap pb-4"
      >
        <Link
          className="flex items-center gap-2.5 px-1 py-1 transition-opacity hover:opacity-90"
          href="/admin"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm ring-1 ring-black/10">
            <span className="font-mono text-sm font-bold tracking-tight">
              UI
            </span>
          </div>
          <div
            className={`transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
          >
              <span className="block text-sm font-bold tracking-tight text-gray-900">
                UI Pirate
              </span>
              <span className="block text-[10px] font-medium text-gray-400">
                {workspace === "outreach"
                  ? "Marketing & Outreach"
                  : "SEO & Tracking"}
              </span>
            </div>
        </Link>
      </div>

      {/* Scrollable navigation */}
      <nav
        className="-mr-2 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-2 [scrollbar-width:thin]"
        data-lenis-prevent="true"
      >
        <div
          className={`whitespace-nowrap px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
        >
          Navigation
        </div>
        {nav.map((item) => (
          <NavLink
            key={item.href}
            collapsed={isCollapsed}
            item={item}
            onNavigate={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Sticky footer */}
      <div className="shrink-0 space-y-1 border-t border-gray-100 pt-3">
        <Link
          className="flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          href="/admin"
          title="Switch workspace"
        >
          <span aria-hidden="true">←</span>
          <span
            className={`transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
          >
            Switch workspace
          </span>
        </Link>
        <a
          className="flex items-center justify-between gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          href="/"
          rel="noreferrer"
          target="_blank"
          title="Live Marketing Site"
        >
          <span className="flex items-center gap-2">
            <Icon.external className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span
              className={`transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
            >
              Live Marketing Site
            </span>
          </span>
          <span
            className={`rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
          >
            ↗
          </span>
        </a>
      </div>
    </div>
  );

  if (pathname === "/admin") {
    return (
      <DashboardProvider capabilities={capabilities} user={user}>
        <div className="min-h-screen bg-[#F8FAFC] text-gray-900 antialiased">
          <header className="flex h-16 items-center justify-between border-b border-gray-200/80 bg-white px-4 sm:px-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-sm">
                <span className="font-mono text-sm font-bold">UI</span>
              </div>
              <span className="text-sm font-bold tracking-tight">UI Pirate</span>
            </div>
            <button
              className="rounded-xl border border-gray-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={logout}
            >
              Sign out
            </button>
          </header>
          <main className="mx-auto max-w-4xl p-4 sm:p-8">{children}</main>
        </div>
      </DashboardProvider>
    );
  }

  return (
    <DashboardProvider capabilities={capabilities} user={user}>
      <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-gray-900 antialiased">
        {/* Desktop sidebar */}
        <aside
          className={`relative z-40 hidden shrink-0 border-r border-gray-200/80 bg-white lg:block lg:h-screen ${
            mounted ? "transition-[width] duration-200 ease-in-out" : ""
          } ${collapsed ? "w-[76px]" : "w-64"}`}
        >
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-5 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
            type="button"
            onClick={toggleCollapsed}
          >
            <Icon.chevron
              className={`h-3.5 w-3.5 transition-transform ${
                collapsed ? "-rotate-90" : "rotate-90"
              }`}
            />
          </button>
          <div className="h-full overflow-hidden">{renderSidebar(collapsed)}</div>
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
            {() => <DrawerBody data-lenis-prevent="true">{renderSidebar(false)}</DrawerBody>}
          </DrawerContent>
        </Drawer>

        {/* Main Content Area */}
        <div className="flex h-screen min-w-0 flex-1 flex-col">
          <header className="z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-gray-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
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
                  m.exact
                    ? pathname === m.prefix
                    : pathname.startsWith(m.prefix),
                ) || {
                  title: "Admin Console",
                  description:
                    "Management, analytics and system operations console.",
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
              {workspace === "seo" ? <DateRangeControl /> : null}

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

          <main
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 lg:p-8"
            data-lenis-prevent="true"
          >
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
