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

  for (const l of links) {
    const name = `attributes/${l.attr}`;
    const have = current.find((a) => a.name === name)?.uriValues?.map((u) => u.uri) ?? [];

    if (have.some((u) => trimSlash(u) === trimSlash(l.uri))) {
      plan.same.push(l);
      continue;
    }

    // The booking link may hold several; keep the ones already there.
    const keep = l.attr === "url_appointment" ? have : [];

    if (have.length) plan.update.push({ ...l, was: have });
    else plan.add.push(l);

    plan.mask.push(name);
    plan.attributes.push({
      name,
      valueType: "URL",
      uriValues: [...keep, l.uri].map((uri) => ({ uri })),
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
