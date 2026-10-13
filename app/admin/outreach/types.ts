export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  category: string;
  city: string;
  state: string;
  website: string;
  pitch: string;
  whatsappDraft: string;
  hasWebsite: string;
  batch: string;
  status: string;
  callCount: number;
  lastCalledAt: string | null;
  whatsappCount: number;
  lastWhatsappAt: string | null;
  emailCount: number;
  lastEmailAt: string | null;
  extra: Record<string, string>;
  touches: Array<{
    channel: "call" | "whatsapp" | "email";
    at: string;
    byName?: string;
    message?: string;
  }>;
  notes: Array<{ id: string; byName?: string; at: string; text: string }>;
  activities: Array<{
    type: "status" | "website" | "outreach" | "draft";
    at: string;
    byName?: string;
    summary: string;
  }>;
  createdAt: string;
}

export type Channel = "call" | "whatsapp" | "email";

export const digits = (v: string) => v.replace(/\D/g, "");

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const DEFAULT_WA_DRAFT =
  "Hi {{name}} team, this is UI Pirate. We build fast, modern websites for packaging companies and had an idea for you. Do you have a few minutes to chat?";

/** Fill {{name}} / {{city}} placeholders. */
export const fillDraft = (text: string, c: Contact) =>
  text
    .replace(/\{\{\s*name\s*\}\}/gi, c.name)
    .replace(/\{\{\s*city\s*\}\}/gi, c.city);

/** The WhatsApp text that will be sent (drafted, saved or default). */
export const waMessage = (c: Contact, draft?: string) =>
  fillDraft(draft?.trim() || c.whatsappDraft || DEFAULT_WA_DRAFT, c);

/** wa.me link carrying the drafted message (or the default one). */
export const waHref = (c: Contact, draft?: string) =>
  `https://wa.me/${digits(c.phone)}?text=${encodeURIComponent(waMessage(c, draft))}`;

export const mailHref = (c: Contact) =>
  `mailto:${c.email}?subject=${encodeURIComponent(`Quick idea for ${c.name}`)}`;

export const canWhatsapp = (c: Contact) => digits(c.phone).length >= 8;
