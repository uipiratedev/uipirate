"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/button";

import { useAuth } from "@/hooks/useAuth";

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: "📊",
    },
    {
      label: "Blogs",
      href: "/admin/dashboard/blogs",
      icon: "📝",
    },
    {
      label: "Create Blog",
      href: "/blogs/create",
      icon: "➕",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center gap-3" href="/admin/dashboard">
          <img
            alt="UI Pirate Logo"
            className="w-10 h-10"
            src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              UI Pirate
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            href={item.href}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <Link
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          href="/"
        >
          <span className="text-xl">🏠</span>
          <span>View Website</span>
        </Link>
        <Button
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          onClick={logout}
        >
          <span className="text-xl mr-2">🚪</span>
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
