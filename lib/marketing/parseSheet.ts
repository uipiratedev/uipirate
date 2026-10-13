/**
 * Minimal CSV parser (RFC 4180 quoting) plus header → field mapping for the
 * marketing sheet upload. Runs in the browser; the API re-validates rows.
 */
export interface SheetRow {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  category?: string;
  city?: string;
  state?: string;
  website?: string;
  hasWebsite?: string;
  pitch?: string;
  extra?: Record<string, string>;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => c.trim()));
}

const ALIASES: Record<keyof Omit<SheetRow, "extra">, string[]> = {
  name: [
    "name",
    "full name",
    "fullname",
    "contact",
    "contact name",
    "company name",
  ],
  phone: ["phone", "phone number", "mobile", "mobile number", "tel", "number"],
  email: ["email", "email address", "e-mail", "mail"],
  company: ["company", "organization", "organisation", "business"],
  category: ["category", "category / specialty", "specialty", "industry"],
  city: ["city"],
  state: ["state"],
  website: ["website", "url", "site"],
  hasWebsite: ["has website", "has web site", "website status"],
  pitch: ["pitch hook angle", "pitch", "pitch hook", "angle"],
};

export function sheetToRows(text: string): SheetRow[] {
  const [header, ...body] = parseCsv(text);

  if (!header) return [];

  const keys = header.map((h) => h.trim().toLowerCase());
  const idx = (field: keyof typeof ALIASES) =>
    keys.findIndex((k) => ALIASES[field].includes(k));
  const cols = {
    name: idx("name"),
    phone: idx("phone"),
    email: idx("email"),
    company: idx("company"),
    category: idx("category"),
    city: idx("city"),
    state: idx("state"),
    website: idx("website"),
    hasWebsite: idx("hasWebsite"),
    pitch: idx("pitch"),
  };
  const mapped = new Set(Object.values(cols).filter((i) => i >= 0));

  return body
    .map((r): SheetRow => {
      const get = (i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
      const extra: Record<string, string> = {};

      r.forEach((v, i) => {
        if (!mapped.has(i) && v.trim() && header[i]?.trim())
          extra[header[i].trim()] = v.trim();
      });

      return {
        name: get(cols.name) || get(cols.company) || get(cols.email),
        phone: get(cols.phone) || undefined,
        email: get(cols.email) || undefined,
        company: get(cols.company) || undefined,
        category: get(cols.category) || undefined,
        city: get(cols.city) || undefined,
        state: get(cols.state) || undefined,
        website: get(cols.website) || undefined,
        hasWebsite: get(cols.hasWebsite) || undefined,
        pitch: get(cols.pitch) || undefined,
        extra: Object.keys(extra).length ? extra : undefined,
      };
    })
    .filter((r) => r.name && (r.phone || r.email));
}
