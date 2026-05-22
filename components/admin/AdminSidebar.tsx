"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import {
  IconDashboard,
  IconBlogs,
  IconCreate,
  IconHome,
  IconLogout,
} from "./AdminIcons";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: IconDashboard },
  { label: "Blogs",     href: "/admin/blogs",     Icon: IconBlogs    },
  { label: "Create",    href: "/admin/blogs/create", Icon: IconCreate },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard" || href === "/admin/blogs") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col"
      style={{ background: "#151514", borderRight: "1px solid rgba(255,255,255,0.06)" }}>

      {/* Brand */}
      <div className="px-5 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "#FF5B04" }}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path clipRule="evenodd" fillRule="evenodd"
                d="M17.648 10.13L15.878 7.026 7.03 22.55h3.498l7.12-12.42zm2.232 3.916l-1.77 3.152 1.284 2.253h-2.549l-1.74 3.099h9.622l-4.847-8.504z"
                fill="white" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white font-geist leading-none">UI Pirate</p>
            <p className="text-[10px] mt-0.5 font-jetbrains-mono uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.35)" }}>Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[9px] font-jetbrains-mono uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.25)" }}>Menu</p>
        {navItems.map(({ label, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
              style={{
                background: active ? "#FF5B04" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.5)",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; } }}
            >
              <Icon className="flex-shrink-0" />
              <span className="text-sm font-medium font-geist">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
        >
          <IconHome />
          <span className="text-sm font-medium font-geist">View Site</span>
        </Link>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
          style={{ color: "rgba(255,91,4,0.7)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,91,4,0.1)"; (e.currentTarget as HTMLElement).style.color = "#FF5B04"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,91,4,0.7)"; }}
        >
          <IconLogout />
          <span className="text-sm font-medium font-geist">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
