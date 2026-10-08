/**
 * The "Place page URLs" on the listing: the Book button and social profiles.
 *
 * They are location attributes (attributes/url_appointment, url_linkedin, ...).
 * Only the URLs the website itself links to are used; nothing is invented, and
 * attributes already on the listing (such as WhatsApp) are never touched.
 */
import { INFO_API, call, getGbpConfig, GbpError } from "./client";

export interface SiteLink {
  /** Attribute id without the `attributes/` prefix. */
  attr: string;
  label: string;
  uri: string;
}

/**
 * From the website: the 15-minute booking link used by every call-to-action
 * (cal.com/ui-pirate/15min) and the company LinkedIn and X profiles in the
 * footer. The site has no Instagram or YouTube, so none are set.
 */
export const SITE_LINKS: SiteLink[] = [
  { attr: "url_appointment", label: "Booking link", uri: "https://cal.com/ui-pirate/15min" },
  // The booking attribute holds several links; the contact page is a second way in.
  { attr: "url_appointment", label: "Booking link", uri: "https://uipirate.com/contact" },
  {
    attr: "url_linkedin",
    label: "LinkedIn",
    uri: "https://www.linkedin.com/company/ui-pirate-by-vishal-anand/",
  },
  { attr: "url_twitter", label: "X (Twitter)", uri: "https://x.com/UI_Pirate" },
];

export interface Attribute {
  name: string;
  valueType?: string;
  uriValues?: Array<{ uri: string }>;
  values?: unknown[];
}

export interface LinkPlan {
  add: SiteLink[];
  /** Listed with a different URL: it is replaced (or, for the booking link, added alongside). */
  update: Array<SiteLink & { was: string[] }>;
  same: SiteLink[];
  /** Only the attributes to write; everything else on the listing is left alone. */
  attributes: Attribute[];
  mask: string[];
}

const trimSlash = (u: string) => u.replace(/\/+$/, "").toLowerCase();

/** Pure: what changes to put the site's links on the listing. */
export function planLinks(current: Attribute[], links: SiteLink[] = SITE_LINKS): LinkPlan {
  const plan: LinkPlan = { add: [], update: [], same: [], attributes: [], mask: [] };

  // Several links can target one attribute (the booking link); group them.
  const groups = new Map<string, { label: string; uris: string[] }>();

  for (const l of links) {
    const g = groups.get(l.attr) ?? { label: l.label, uris: [] };

    g.uris.push(l.uri);
    groups.set(l.attr, g);
  }

  for (const [attr, g] of groups) {
    const name = `attributes/${attr}`;
    const have = current.find((a) => a.name === name)?.uriValues?.map((u) => u.uri) ?? [];
    const repeatable = attr === "url_appointment";
    // A single-value attribute (a social profile) only ever holds the first link.
    const wanted = repeatable ? g.uris : g.uris.slice(0, 1);
    const missing = wanted.filter((u) => !have.some((h) => trimSlash(h) === trimSlash(u)));

    if (!missing.length) {
      plan.same.push({ attr, label: g.label, uri: wanted.join(", ") });
      continue;
    }

    const entry = { attr, label: g.label, uri: missing.join(", ") };

    if (have.length) plan.update.push({ ...entry, was: have });
    else plan.add.push(entry);

    plan.mask.push(name);
    plan.attributes.push({
      name,
      valueType: "URL",
      // The booking link keeps what is already there; others are replaced.
      uriValues: [...(repeatable ? have : []), ...missing].map((uri) => ({ uri })),
    });
  }

  return plan;
}

function path(): string {
  const cfg = getGbpConfig();

  if (!cfg) throw new GbpError("Business Profile is not configured.", undefined, "Set GBP_ACCOUNT_ID and GBP_LOCATION_ID.");

  return `${INFO_API}/locations/${cfg.locationId}/attributes`;
}

export async function getAttributes(): Promise<Attribute[]> {
  const j = await call<{ attributes?: Attribute[] }>(path());

  return j.attributes ?? [];
}

export async function writeAttributes(plan: LinkPlan): Promise<void> {
  if (!plan.attributes.length) return;

  await call(`${path()}?attributeMask=${encodeURIComponent(plan.mask.join(","))}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: path().replace(INFO_API + "/", ""),
      attributes: plan.attributes,
    }),
  });
}
