"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconDashboard,
  IconBlogs,
  IconCreate,
  IconHome,
  IconLogout,
} from "./AdminIcons";

import { useAuth } from "@/hooks/useAuth";

const isSubdomain = typeof window !== "undefined" && 
  (window.location.hostname.startsWith("cos.") || window.location.hostname === "cos.uipirate.com");

const getHref = (path: string) => isSubdomain ? path : `/pirateCOS${path}`;

const navItems = [
  { label: "Dashboard", href: getHref("/dashboard"), Icon: IconDashboard },
  { label: "Posts", href: getHref("/posts"), Icon: IconBlogs },
  { label: "Create Post", href: getHref("/posts/create"), Icon: IconCreate },
];

const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isActive = (href: string) => {
    if (href === getHref("/dashboard") || href === getHref("/posts")) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <aside
        className="fixed left-0 top-0 h-screen w-60 flex flex-col"
        style={{
          background: "#151514",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Brand */}
        <div
          className="px-5 py-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Link
            className="flex items-center gap-3 group"
            href={getHref("/dashboard")}
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p
            className="px-3 pb-2 text-[9px] font-jetbrains-mono uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Menu
          </p>
          {navItems.map(({ label, href, Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
                href={href}
                style={{
                  background: active ? "#FF5B04" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.5)";
                  }
                }}
              >
                <Icon className="flex-shrink-0" />
                <span className="text-sm font-medium font-geist">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div
          className="px-3 py-4 space-y-0.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* AI Settings */}
          {(() => {
            const active = pathname === getHref("/ai-settings");

            return (
              <Link
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
                href={getHref("/ai-settings")}
                style={{
                  background: active ? "#FF5B04" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.5)";
                  }
                }}
              >
                <svg
                  className="flex-shrink-0"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span className="text-sm font-medium font-geist">
                  AI Settings
                </span>
                {!active && (
                  <span
                    className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(255,91,4,0.15)",
                      color: "#FF5B04",
                    }}
                  >
                    AI
                  </span>
                )}
              </Link>
            );
          })()}

          {/* Brand Brain */}
          {(() => {
            const active = pathname === getHref("/brand-brain");

            return (
              <Link
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
                href={getHref("/brand-brain")}
                style={{
                  background: active ? "#FF5B04" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.5)";
                  }
                }}
              >
                <svg
                  className="flex-shrink-0"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
                </svg>
                <span className="text-sm font-medium font-geist">
                  Brand Brain
                </span>
                {!active && (
                  <span
                    className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(255,91,4,0.15)",
                      color: "#FF5B04",
                    }}
                  >
                    Brain
                  </span>
                )}
              </Link>
            );
          })()}

          {/* Integrations */}
          {(() => {
            const active = pathname === getHref("/settings/integrations");

            return (
              <Link
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
                href={getHref("/settings/integrations")}
                style={{
                  background: active ? "#FF5B04" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.5)";
                  }
                }}
              >
                <svg
                  className="flex-shrink-0"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M6 8H5a4 4 0 0 0 0 8h1" />
                  <line x1="2" x2="6" y1="12" y2="12" />
                  <line x1="18" x2="22" y1="12" y2="12" />
                  <rect height="12" rx="2" width="10" x="7" y="6" />
                </svg>
                <span className="text-sm font-medium font-geist">
                  Integrations
                </span>
                {!active && (
                  <span
                    className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(255,91,4,0.15)",
                      color: "#FF5B04",
                    }}
                  >
                    API
                  </span>
                )}
              </Link>
            );
          })()}

          {/* Billing & Usage */}
          {(() => {
            const active = pathname === getHref("/settings/billing");

            return (
              <Link
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
                href={getHref("/settings/billing")}
                style={{
                  background: active ? "#FF5B04" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.5)";
                  }
                }}
              >
                <svg
                  className="flex-shrink-0"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  width="16"
                >
                  <rect height="14" rx="2" ry="2" width="20" x="2" y="5" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span className="text-sm font-medium font-geist">
                  Billing & Usage
                </span>
                {!active && (
                  <span
                    className="ml-auto text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(255,91,4,0.15)",
                      color: "#FF5B04",
                    }}
                  >
                    $
                  </span>
                )}
              </Link>
            );
          })()}

          {/* Plan badge */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium font-geist truncate"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {user.name}
                </p>
                <p
                  className="text-[9px] font-jetbrains-mono uppercase tracking-widest truncate"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {user.email}
                </p>
              </div>
              <span
                className="flex-shrink-0 text-[9px] font-jetbrains-mono px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={
                  user.plan === "pro" || user.plan === "enterprise"
                    ? { background: "rgba(255,91,4,0.2)", color: "#FF5B04" }
                    : user.plan === "starter"
                      ? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }
                      : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }
                }
              >
                {PLAN_LABEL[user.plan] ?? "Free"}
              </span>
            </div>
          )}

          <Link
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
            href="/"
            style={{ color: "rgba(255,255,255,0.4)" }}
            target="_blank"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.4)";
            }}
          >
            <IconHome />
            <span className="text-sm font-medium font-geist">View Site</span>
          </Link>
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
            style={{ color: "rgba(255,91,4,0.7)" }}
            onClick={logout}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,91,4,0.1)";
              (e.currentTarget as HTMLElement).style.color = "#FF5B04";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,91,4,0.7)";
            }}
          >
            <IconLogout />
            <span className="text-sm font-medium font-geist">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
