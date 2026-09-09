/**
 * Role-based access control for the /admin dashboard.
 *
 * Three roles, defined once here. Every dashboard API route and every server
 * page re-checks capability server-side via `can()` / `requireCapability()` —
 * the filtered sidebar is a convenience, never the enforcement point.
 */

export const ROLES = ["website-admin", "team-member", "normal-user"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  "website-admin": "Website Admin",
  "team-member": "Team Member",
  "normal-user": "Normal User",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  "website-admin":
    "Full access — analytics, leads, identified visitor journeys, and user management.",
  "team-member":
    "Analytics and lead management. No PII visitor list, no user management.",
  "normal-user":
    "Read-only aggregate analytics. No leads, no personal data, no management.",
};

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}

/**
 * Every gated action in the dashboard. Keep this list flat and explicit —
 * routes reference these strings directly.
 */
export type Capability =
  | "view:dashboard" // overview, traffic, pages, engagement, clicks
  | "view:leads" // lead inbox + per-lead journey
  | "manage:leads" // status, assignee, notes
  | "view:visitors:pii" // identified visitor list + raw journeys
  | "manage:users" // invite, role change, deactivate, reset password
  | "manage:indexing" // search engine indexing, url inspection, sitemap diff
  | "export:data"; // CSV downloads

const CAPABILITIES: Record<Role, Capability[]> = {
  "website-admin": [
    "view:dashboard",
    "view:leads",
    "manage:leads",
    "view:visitors:pii",
    "manage:users",
    "manage:indexing",
    "export:data",
  ],
  "team-member": [
    "view:dashboard",
    "view:leads",
    "manage:leads",
    "export:data",
  ],
  "normal-user": ["view:dashboard"],
};

export function can(
  role: Role | null | undefined,
  capability: Capability,
): boolean {
  if (!role || !isRole(role)) return false;

  return CAPABILITIES[role].includes(capability);
}

/** All capabilities a role holds — handy for shipping to the client context. */
export function capabilitiesFor(role: Role): Capability[] {
  return [...CAPABILITIES[role]];
}

export interface NavItem {
  label: string;
  href: string;
  /** Icon key resolved by the sidebar component. */
  icon: string;
  /** Capability required to see this item. Omitted = always visible when authed. */
  capability?: Capability;
  /** Exact-match highlighting (e.g. the overview root). */
  exact?: boolean;
}

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "grid", exact: true },
  { label: "Traffic", href: "/admin/analytics/traffic", icon: "trending-up" },
  { label: "Pages", href: "/admin/analytics/pages", icon: "file-text" },
  {
    label: "Clicks & Buttons",
    href: "/admin/analytics/clicks",
    icon: "mouse-pointer",
  },
  {
    label: "Engagement",
    href: "/admin/analytics/engagement",
    icon: "activity",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: "inbox",
    capability: "view:leads",
  },
  {
    label: "Visitors",
    href: "/admin/visitors",
    icon: "users",
    capability: "view:visitors:pii",
  },
  {
    label: "Indexing",
    href: "/admin/indexing",
    icon: "search",
    capability: "manage:indexing",
  },
  {
    label: "Search & SEO",
    href: "/admin/analytics/search",
    icon: "radar",
  },
  {
    label: "Users & Roles",
    href: "/admin/settings/users",
    icon: "shield",
    capability: "manage:users",
  },
];

export function navForRole(role: Role): NavItem[] {
  return DASHBOARD_NAV.filter(
    (item) => !item.capability || can(role, item.capability),
  );
}
