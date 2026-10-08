/**
 * Reads and updates the Business Profile's own details (services, description).
 *
 * Unlike posts, these edits change what the public sees on the business
 * listing, so the page shows a plan first and only writes when an admin presses
 * Apply. The previous value is saved before every write.
 */
import { INFO_API, call, getGbpConfig, GbpError } from "./client";

export const DEFAULT_CATEGORY = "categories/gcid:website_designer";

export interface SiteService {
  name: string;
  description: string;
}

/**
 * The services the website itself advertises: the four service pages
 * (app/services) and the eight names on the home page
 * (screens/landing/businessHelp). Wording follows the site's own metadata.
 * Google limits: name 140 characters, description 300.
 */
export const SITE_SERVICES: SiteService[] = [
  {
    name: "UX & UI Design",
    description:
      "Product thinking, competitive analysis, information architecture and UX/UI design for SaaS and mobile apps, from vision to dev-ready screens in Angular, React and Next.js.",
  },
  {
    name: "Full Stack Development",
    description:
      "Backend architecture, database design, APIs and production deployment on Node.js, Python, AWS, GCP and Azure.",
  },
  {
    name: "SaaS Development",
    description:
      "Full-stack engineering for SaaS products, from architecture to production, including AI-generated code taken to production.",
  },
  {
    name: "AI Integrations",
    description:
      "AI and LLM integration into your product, with the APIs and backend it needs to run in production.",
  },
  {
    name: "Landing Pages",
    description:
      "High-converting landing pages built around your positioning and user journey in React, Next.js, Framer or Webflow.",
  },
  {
    name: "Business Websites",
    description:
      "Business websites that turn visitors into customers, built in React, Next.js, Framer or Webflow.",
  },
  {
    name: "UX Audits",
    description:
      "Heuristic UX audits with drop-off analysis and a prioritised, actionable roadmap. Most audits run 1 to 2 weeks.",
  },
  {
    name: "UX Consultation",
    description:
      "Find the friction blocking growth before you build more, with guidance on UX decisions for your product.",
  },
];

/** A service as Google stores it. */
export interface ServiceItem {
  structuredServiceItem?: { serviceTypeId: string; description?: string };
  freeFormServiceItem?: {
    category: string;
    label: { displayName: string; description?: string; languageCode?: string };
  };
  price?: unknown;
}

export interface ServicePlan {
  /** Google's standard services, always kept. */
  keep: string[];
  /** Free-form entries that are not on the website. */
  remove: string[];
  add: SiteService[];
  /** Already correct. */
  same: string[];
  /** The full list that would be written. */
  next: ServiceItem[];
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Pure: what changes if the profile is made to match the website. */
export function planServices(
  current: ServiceItem[],
  site: SiteService[] = SITE_SERVICES,
): ServicePlan {
  const structured = current.filter((s) => s.structuredServiceItem);
  const free = current.filter((s) => s.freeFormServiceItem);
  const category = free[0]?.freeFormServiceItem?.category ?? DEFAULT_CATEGORY;
  const wanted = new Map(site.map((s) => [norm(s.name), s]));
  const have = new Map(free.map((s) => [norm(s.freeFormServiceItem!.label.displayName), s]));

  const remove = free
    .filter((s) => !wanted.has(norm(s.freeFormServiceItem!.label.displayName)))
    .map((s) => s.freeFormServiceItem!.label.displayName);

  const same: string[] = [];
  const add: SiteService[] = [];

  for (const s of site) {
    const existing = have.get(norm(s.name));

    if (existing?.freeFormServiceItem?.label.description === s.description) same.push(s.name);
    else add.push(s);
  }

  return {
    keep: structured.map((s) => s.structuredServiceItem!.serviceTypeId.replace("job_type_id:", "")),
    remove,
    add,
    same,
    next: [
      ...structured,
      ...site.map(
        (s): ServiceItem => ({
          freeFormServiceItem: {
            category,
            label: {
              displayName: s.name.slice(0, 140),
              description: s.description.slice(0, 300),
              languageCode: "en",
            },
          },
        }),
      ),
    ],
  };
}

export interface LiveProfile {
  title: string;
  description: string;
  website: string;
  primaryCategory: string;
  additionalCategories: string[];
  services: ServiceItem[];
}

function locationPath(): string {
  const cfg = getGbpConfig();

  if (!cfg) throw new GbpError("Business Profile is not configured.", undefined, "Set GBP_ACCOUNT_ID and GBP_LOCATION_ID.");

  return `${INFO_API}/locations/${cfg.locationId}`;
}

export async function getProfile(): Promise<LiveProfile> {
  const j = await call<{
    title?: string;
    websiteUri?: string;
    profile?: { description?: string };
    categories?: {
      primaryCategory?: { displayName?: string };
      additionalCategories?: Array<{ displayName?: string }>;
    };
    serviceItems?: ServiceItem[];
  }>(`${locationPath()}?readMask=title,websiteUri,profile,categories,serviceItems`);

  return {
    title: j.title ?? "",
    description: j.profile?.description ?? "",
    website: j.websiteUri ?? "",
    primaryCategory: j.categories?.primaryCategory?.displayName ?? "",
    additionalCategories: (j.categories?.additionalCategories ?? []).map((c) => c.displayName ?? ""),
    services: j.serviceItems ?? [],
  };
}

export async function writeServices(items: ServiceItem[]): Promise<void> {
  await call(`${locationPath()}?updateMask=serviceItems`, {
    method: "PATCH",
    body: JSON.stringify({ serviceItems: items }),
  });
}

export async function writeDescription(description: string): Promise<void> {
  await call(`${locationPath()}?updateMask=profile`, {
    method: "PATCH",
    body: JSON.stringify({ profile: { description } }),
  });
}
