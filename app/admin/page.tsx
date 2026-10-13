import Link from "next/link";

import { requireSession } from "@/lib/auth/session";
import { can } from "@/lib/auth/roles";
import { Icon } from "@/components/admin/icons";

export const dynamic = "force-dynamic";

const CARDS = [
  {
    href: "/admin/seo-tracking",
    title: "SEO & Tracking",
    icon: "trending-up" as const,
    description:
      "Website traffic, search performance, market reach and conversions — the full analytics dashboard.",
    points: ["Traffic & channels", "Search & SEO", "Clicks, funnel, leads"],
    capability: null,
  },
  {
    href: "/admin/outreach/leads",
    title: "Marketing & Outreach",
    icon: "users" as const,
    description:
      "Upload a contact sheet, see every record on the dashboard and call straight from it.",
    points: [
      "Upload sheets (CSV)",
      "Contact records",
      "Click-to-call & call log",
    ],
    capability: "view:leads" as const,
  },
];

export default async function AdminHomePage() {
  const user = await requireSession();
  const cards = CARDS.filter(
    (c) => !c.capability || can(user.role, c.capability),
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Welcome back, {user.name.split(" ")[0] || "User"}. Choose a workspace.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c) => {
          const Glyph = Icon[c.icon];

          return (
            <Link
              key={c.href}
              className="group rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
              href={c.href}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                <Glyph className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold tracking-tight text-gray-900">
                {c.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {c.description}
              </p>
              <ul className="mt-4 space-y-1 text-xs text-gray-600">
                {c.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-gray-900">
                Open{" "}
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
