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
  {
    // From the pricing page and its FAQ: a monthly retainer you can pause, with
    // a paid pilot first. No price is quoted; the site shows more than one.
    name: "Design Subscription",
    description:
      "A monthly design retainer for SaaS teams: a dedicated design team without full-time headcount. Pause anytime with no lock-ins, and start with a 5-day pilot to try us first.",
  },
];

/**
 * Descriptions for Google's standard services that match what the website
 * offers. Only written where the listing has none, so wording an admin already
 * set is never overwritten. HTML and graphic design are not on the website, so
 * they get none.
 */
export const STANDARD_DESCRIPTIONS: Record<string, string> = {
  web_design:
    "Conversion-focused website and landing page design built around your positioning and user journey.",
  web_development:
    "Fast, responsive websites and web apps built with React, Next.js and Angular, with Node.js and Python back ends.",
  responsive_design:
    "Interfaces that work properly on phones, tablets and desktops, designed and built mobile-first.",
  mobile_app_development:
    "UX/UI design for mobile apps and the engineering to build them, from vision to dev-ready screens and production.",
  software_development:
    "Full-stack engineering for SaaS and AI products: architecture, databases, APIs and production deployment.",
  html: "Clean, semantic HTML and CSS builds for fast, accessible, responsive pages.",
  graphic_design:
    "Interface and visual graphics for digital products: UI kits, illustrations and marketing visuals.",
};

/**
 * Descriptions for the custom entries already on the listing, matched by name.
 * Like the standard ones they only fill an empty description.
 */
export const EXISTING_DESCRIPTIONS: Record<string, string> = {
  "visual design":
    "Brand-aligned visual design for web and mobile products: UI kits, components and polished screens.",
  "next js developer":
    "Next.js development for fast, search-friendly websites and web apps with server rendering and clean, maintainable code.",
  "website development":
    "Fast, responsive websites built with React and Next.js, from landing pages to full business sites.",
  "frontend developer":
    "Production-ready front ends in React, Next.js and Angular, built to match the design.",
  "react js developer":
    "React.js interfaces and web apps: reusable components, clean state management and responsive layouts.",
  "ui developement":
    "Turning UI designs into pixel-accurate, responsive and accessible front-end code.",
  "ui designer":
    "User interface design for SaaS and mobile products: screens, components and design systems.",
  "ux designer":
    "User experience design: flows, wireframes and prototypes that reduce friction and move people toward action.",
};

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
  /** Standard services that get a description because they have none. */
  described: string[];
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
  opts: { prune?: boolean } = {},
): ServicePlan {
  const described: string[] = [];
  const structured = current
    .filter((s) => s.structuredServiceItem)
    .map((s): ServiceItem => {
      const id = s.structuredServiceItem!.serviceTypeId.replace("job_type_id:", "");
      const text = STANDARD_DESCRIPTIONS[id];

      if (!text || s.structuredServiceItem!.description?.trim()) return s;

      described.push(id);

      return { ...s, structuredServiceItem: { ...s.structuredServiceItem!, description: text } };
    });
  const free = current
    .filter((s) => s.freeFormServiceItem)
    .map((s): ServiceItem => {
      const label = s.freeFormServiceItem!.label;
      const text = EXISTING_DESCRIPTIONS[norm(label.displayName)];

      if (!text || label.description?.trim()) return s;

      described.push(label.displayName);

      return {
        ...s,
        freeFormServiceItem: {
          ...s.freeFormServiceItem!,
          label: { ...label, description: text, languageCode: label.languageCode ?? "en" },
        },
      };
    });
  const category = free[0]?.freeFormServiceItem?.category ?? DEFAULT_CATEGORY;
  const wanted = new Map(site.map((s) => [norm(s.name), s]));
  const have = new Map(free.map((s) => [norm(s.freeFormServiceItem!.label.displayName), s]));

  // By default nothing the owner has already listed is removed or reworded;
  // `prune` also drops entries that are not on the website.
  const remove = opts.prune
    ? free
        .filter((s) => !wanted.has(norm(s.freeFormServiceItem!.label.displayName)))
        .map((s) => s.freeFormServiceItem!.label.displayName)
    : [];
  const kept = opts.prune
    ? free.filter((s) => wanted.has(norm(s.freeFormServiceItem!.label.displayName)))
    : free;

  const same: string[] = [];
  const add: SiteService[] = [];

  for (const s of site) {
    const existing = have.get(norm(s.name));

    if (!existing) add.push(s);
    else if (opts.prune && existing.freeFormServiceItem?.label.description !== s.description)
      add.push(s);
    else same.push(s.name);
  }

  // Under prune an entry being reworded is replaced, not duplicated.
  const reworded = new Set(add.map((s) => norm(s.name)));

  return {
    described,
    keep: structured.map((s) => s.structuredServiceItem!.serviceTypeId.replace("job_type_id:", "")),
    remove,
    add,
    same,
    next: [
      ...structured,
      ...kept.filter((s) => !reworded.has(norm(s.freeFormServiceItem!.label.displayName))),
      ...add.map(
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
