"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  IconDashboard,
  IconBlogs,
  IconCreate,
  IconHome,
  IconLogout,
} from "./AdminIcons";

import { useAuth } from "@/hooks/useAuth";

const isSubdomain =
  typeof window !== "undefined" &&
  (window.location.hostname.startsWith("cos.") ||
    window.location.hostname === "cos.uipirate.com");

const getHref = (path: string) => (isSubdomain ? path : `/pirateCOS${path}`);

const navItems = [
  { label: "Dashboard", href: getHref("/dashboard"), Icon: IconDashboard },
  { label: "Posts", href: getHref("/posts"), Icon: IconBlogs },
  { label: "Create Post", href: getHref("/posts/create"), Icon: IconCreate },
  {
    label: "AI Analytics",
    href: getHref("/analytics/ai"),
    Icon: (props: any) => (
      <svg {...props} fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    )
  },
  {
    label: "Teams",
    href: getHref("/teams"),
    Icon: (props: any) => (
      <svg {...props} fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
];

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

/* ── Shared nav link helper ─────────────────────────────────────────────── */
function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
      href={href}
      style={{
        background: active ? "#FF5B04" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.background =
            "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.5)";
        }
      }}
    >
      {children}
    </Link>
  );
}

/* ── Sidebar content (shared between desktop + mobile drawer) ────────────── */
function SidebarContent({
  onClose,
}: {
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isActive = (href: string) => {
    if (href === getHref("/dashboard") || href === getHref("/posts") || href === getHref("/profile")) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const filteredNavItems = navItems.filter(({ label }) => {
    if (label === "Teams") {
      return user?.accountType === "organization";
    }
    return true;
  });

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "#151514",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Brand */}
      <div
        className="px-5 py-5 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link
          className="flex items-center gap-3 group"
          href={getHref("/dashboard")}
          onClick={onClose}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
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
          <div>
            <p className="text-sm font-semibold text-white font-geist leading-none">
              UI Pirate
            </p>
            <p
              className="text-[10px] mt-0.5 font-jetbrains-mono uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              pirateCOS
            </p>
          </div>
        </Link>

        {/* Close button — only inside mobile drawer */}
        {onClose && (
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            onClick={onClose}
          >
            <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p
          className="px-3 pb-2 text-[9px] font-jetbrains-mono uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Menu
        </p>
        {filteredNavItems.map(({ label, href, Icon }) => {
          const active = isActive(href);
          return (
            <NavLink key={href} active={active} href={href} onClick={onClose}>
              <Icon className="flex-shrink-0" />
              <span className="text-sm font-medium font-geist">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div
        className="px-3 py-4 space-y-0.5 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* AI Settings */}
        {(() => {
          const active = pathname === getHref("/ai-settings");
          return (
            <NavLink active={active} href={getHref("/ai-settings")} onClick={onClose}>
              <svg className="flex-shrink-0" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-sm font-medium font-geist">AI Settings</span>
              {!active && (
                <span className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,91,4,0.15)", color: "#FF5B04" }}>
                  AI
                </span>
              )}
            </NavLink>
          );
        })()}

        {/* Brand Brain */}
        {(() => {
          const active = pathname === getHref("/brand-brain");
          return (
            <NavLink active={active} href={getHref("/brand-brain")} onClick={onClose}>
              <svg className="flex-shrink-0" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
              </svg>
              <span className="text-sm font-medium font-geist">Brand Brain</span>
              {!active && (
                <span className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,91,4,0.15)", color: "#FF5B04" }}>
                  Brain
                </span>
              )}
            </NavLink>
          );
        })()}

        {/* Integrations */}
        {(() => {
          const active = pathname === getHref("/settings/integrations");
          return (
            <NavLink active={active} href={getHref("/settings/integrations")} onClick={onClose}>
              <svg className="flex-shrink-0" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M6 8H5a4 4 0 0 0 0 8h1" />
                <line x1="2" x2="6" y1="12" y2="12" />
                <line x1="18" x2="22" y1="12" y2="12" />
                <rect height="12" rx="2" width="10" x="7" y="6" />
              </svg>
              <span className="text-sm font-medium font-geist">Integrations</span>
              {!active && (
                <span className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,91,4,0.15)", color: "#FF5B04" }}>
                  API
                </span>
              )}
            </NavLink>
          );
        })()}

        {/* Billing & Usage */}
        {(() => {
          const active = pathname === getHref("/settings/billing");
          return (
            <NavLink active={active} href={getHref("/settings/billing")} onClick={onClose}>
              <svg className="flex-shrink-0" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
                <rect height="14" rx="2" ry="2" width="20" x="2" y="5" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span className="text-sm font-medium font-geist">Billing & Usage</span>
              {!active && (
                <span className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(255,91,4,0.15)", color: "#FF5B04" }}>
                  $
                </span>
              )}
            </NavLink>
          );
        })()}

        {/* Plan badge / user info */}
        {user && (() => {
          const isProfileActive = pathname === getHref("/profile");
          return (
            <Link
              href={getHref("/profile")}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg transition-all duration-150 cursor-pointer group text-left w-full"
              style={{
                background: isProfileActive ? "#FF5B04" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isProfileActive) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isProfileActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-white/10 flex items-center justify-center border border-white/10 font-bold text-[10px] text-white">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "?"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p 
                  className="text-xs font-medium font-geist truncate" 
                  style={{ color: isProfileActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                >
                  {user.name}
                </p>
                <p 
                  className="text-[9px] font-jetbrains-mono uppercase tracking-widest truncate" 
                  style={{ color: isProfileActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.25)" }}
                >
                  {user.email}
                </p>
                <p 
                  className="text-[9px] font-geist truncate mt-0.5" 
                  style={{ color: isProfileActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}
                >
                  {user.accountType === "organization"
                    ? `Org · ${user.orgRole === "org-admin" ? "Owner" : user.orgRole}`
                    : "Individual"}
                </p>
              </div>
              <span
                className="flex-shrink-0 text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold"
                style={
                  isProfileActive
                    ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                    : user.plan === "pro" || user.plan === "enterprise"
                      ? { background: "rgba(255,91,4,0.2)", color: "#FF5B04" }
                      : user.plan === "starter"
                        ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }
                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }
                }
              >
                {PLAN_LABEL[user.plan] ?? "Free"}
              </span>
            </Link>
          );
        })()}

        <Link
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
          href="/"
          style={{ color: "rgba(255,255,255,0.4)" }}
          target="_blank"
          onClick={onClose}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
          }}
        >
          <IconHome />
          <span className="text-sm font-medium font-geist">View Site</span>
        </Link>

        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
          style={{ color: "rgba(255,91,4,0.7)" }}
          onClick={() => { logout(); onClose?.(); }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,91,4,0.1)";
            (e.currentTarget as HTMLElement).style.color = "#FF5B04";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,91,4,0.7)";
          }}
        >
          <IconLogout />
          <span className="text-sm font-medium font-geist">Logout</span>
        </button>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-60 z-[60]">
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 h-14"
        style={{
          background: "#151514",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <Link className="flex items-center gap-2.5" href={getHref("/dashboard")}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FF5B04" }}>
            <svg fill="none" height="14" viewBox="0 0 32 32" width="14">
              <path clipRule="evenodd" d="M17.648 10.13L15.878 7.026 7.03 22.55h3.498l7.12-12.42zm2.232 3.916l-1.77 3.152 1.284 2.253h-2.549l-1.74 3.099h9.622l-4.847-8.504z" fill="white" fillRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white font-geist">UI Pirate</span>
        </Link>

        {/* Hamburger */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          style={{ color: "rgba(255,255,255,0.6)" }}
          onClick={() => setMobileOpen(true)}
        >
          <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[70] flex"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Drawer panel */}
          <div
            className="relative w-72 h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
