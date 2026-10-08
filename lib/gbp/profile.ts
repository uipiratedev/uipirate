/**
 * Reads and updates the Business Profile's own details (services, description).
 *
 * Unlike posts, these edits change what the public sees on the business
 * listing, so the page shows a plan first and only writes when an admin presses
 * Apply. The previous value is saved before every write.
 */
import { INFO_API, call, getGbpConfig, GbpError } from "./client";
import { EXISTING_COPY, SITE_COPY, STANDARD_COPY } from "./serviceCopy";

export const DEFAULT_CATEGORY = "categories/gcid:website_designer";

export interface SiteService {
  name: string;
  description: string;
  /** A starting price shown on the listing, only where the pricing page has one. */
  price?: { currencyCode: string; units: number };
}

/**
 * The services the website itself advertises: the four service pages
 * (app/services) and the eight names on the home page
 * (screens/landing/businessHelp). Wording follows the site's own metadata.
 * Google limits: name 140 characters, description 300.
 */
/**
 * Starting prices, USD, from the pricing page: the monthly plan is $499, the
 * custom plan starts at $2K, and the pilots are $150 / $250 / $350. Only
 * services that map onto one of those plans carry a price.
 */
const PRICES: Record<string, number> = {
  "UX & UI Design": 499,
  "Full Stack Development": 499,
  "SaaS Development": 499,
  "Landing Pages": 2000,
  "Business Websites": 2000,
  "Design Subscription": 499,
  "5-Day Design Pilot": 150,
  "5-Day Development Pilot": 250,
  "5-Day Design + Dev Pilot": 350,
  "Custom Project": 2000,
};

export const SITE_SERVICES: SiteService[] = Object.entries(SITE_COPY).map(
  ([name, description]) => ({
    name,
    description,
    ...(PRICES[name] ? { price: { currencyCode: "USD", units: PRICES[name] } } : {}),
  }),
);

/** Standard services get their copy only where the listing has none. */
export const STANDARD_DESCRIPTIONS = STANDARD_COPY;

/** Custom entries already on the listing, matched by normalised name. */
export const EXISTING_DESCRIPTIONS = EXISTING_COPY;

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
  opts: { prune?: boolean; refresh?: boolean } = {},
): ServicePlan {
  const described: string[] = [];
  const structured = current
    .filter((s) => s.structuredServiceItem)
    .map((s): ServiceItem => {
      const id = s.structuredServiceItem!.serviceTypeId.replace("job_type_id:", "");
      const text = STANDARD_DESCRIPTIONS[id];

      const current = s.structuredServiceItem!.description?.trim();

      // `refresh` replaces earlier text with the current wording; otherwise only
      // an empty description is filled.
      if (!text || (current && (!opts.refresh || current === text))) return s;

      described.push(id);

      return { ...s, structuredServiceItem: { ...s.structuredServiceItem!, description: text } };
    });
  const free = current
    .filter((s) => s.freeFormServiceItem)
    .map((s): ServiceItem => {
      const label = s.freeFormServiceItem!.label;
      const text = EXISTING_DESCRIPTIONS[norm(label.displayName)];

      const current = label.description?.trim();

      if (!text || (current && (!opts.refresh || current === text))) return s;

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
    else if (
      (opts.prune || opts.refresh) &&
      existing.freeFormServiceItem?.label.description !== s.description
    )
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
          ...(s.price
            ? { price: { currencyCode: s.price.currencyCode, units: String(s.price.units) } }
            : {}),
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
