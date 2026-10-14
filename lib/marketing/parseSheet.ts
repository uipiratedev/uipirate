/**
 * CSV & TSV parser (RFC 4180 quoting) plus header/headerless mapping for
 * marketing sheet upload and direct clipboard pasting.
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

export type ContactField =
  | "name"
  | "phone"
  | "email"
  | "company"
  | "category"
  | "city"
  | "state"
  | "website"
  | "hasWebsite"
  | "pitch"
  | "skip"
  | (string & {});

export const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  phone: "Phone",
  email: "Email",
  company: "Company",
  category: "Category",
  city: "City",
  state: "State",
  website: "Website",
  hasWebsite: "Has Website / Remark",
  pitch: "Pitch",
  skip: "— Skip / Ignore —",
};

/**
 * Detect delimiter: Tab (\t) from Excel/Sheets clipboard, comma (,) from CSV,
 * or semicolon (;) from European CSVs.
 */
export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/)[0] || "";
  const tabs = (firstLine.match(/\t/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const semis = (firstLine.match(/;/g) || []).length;

  if (tabs > 0) return "\t";
  if (commas >= semis) return ",";
  if (semis > 0) return ";";

  return ",";
}

export function parseDelimited(text: string, forcedDelimiter?: string): string[][] {
  const delimiter = forcedDelimiter || detectDelimiter(text);
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
    else if (ch === delimiter) {
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

export function parseCsv(text: string): string[][] {
  return parseDelimited(text);
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
  hasWebsite: [
    "has website",
    "has web site",
    "website status",
    "status",
    "remark",
    "remarks",
    "comment",
    "comments",
  ],
  pitch: ["pitch hook angle", "pitch", "pitch hook", "angle"],
};

export function looksLikeHeader(row: string[]): boolean {
  if (!row.length) return false;
  const known = Object.values(ALIASES).flat();
  const matches = row.filter((c) => {
    const clean = c.trim().toLowerCase();

    return known.includes(clean);
  });

  return matches.length >= 2 || (matches.length >= 1 && row.length <= 3);
}

/** Guess column types from data rows (e.g. for middle lines without header) */
export function autoDetectColumns(
  grid: string[][],
  hasHeader: boolean,
): Record<number, ContactField> {
  const rows = hasHeader ? grid.slice(1) : grid;
  const colCount = Math.max(...grid.map((r) => r.length), 0);
  const mapping: Record<number, ContactField> = {};
  const used = new Set<ContactField>();

  if (hasHeader && grid[0]) {
    const header = grid[0].map((h) => h.trim().toLowerCase());

    for (let c = 0; c < colCount; c++) {
      const hName = header[c] || "";

      for (const [field, aliases] of Object.entries(ALIASES) as [
        ContactField,
        string[],
      ][]) {
        if (!used.has(field) && aliases.includes(hName)) {
          mapping[c] = field;
          used.add(field);
          break;
        }
      }
      if (!mapping[c]) mapping[c] = "skip";
    }

    return mapping;
  }

  // Headerless detection (middle lines):
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s+\-().]{7,25}$/;
  const websiteRegex =
    /^(https?:\/\/|www\.)|(\.(com|org|net|io|in|co|gov|edu|uk|us)\b)/i;

  for (let c = 0; c < colCount; c++) {
    const samples = rows
      .map((r) => (r[c] || "").trim())
      .filter(Boolean)
      .slice(0, 10);

    if (!samples.length) {
      mapping[c] = "skip";
      continue;
    }

    const emailMatches = samples.filter((s) => emailRegex.test(s)).length;
    const phoneMatches = samples.filter(
      (s) => phoneRegex.test(s) && (s.match(/\d/g) || []).length >= 7,
    ).length;
    const websiteMatches = samples.filter((s) => websiteRegex.test(s)).length;

    if (!used.has("email") && emailMatches / samples.length >= 0.5) {
      mapping[c] = "email";
      used.add("email");
    } else if (!used.has("phone") && phoneMatches / samples.length >= 0.5) {
      mapping[c] = "phone";
      used.add("phone");
    } else if (!used.has("website") && websiteMatches / samples.length >= 0.5) {
      mapping[c] = "website";
      used.add("website");
    }
  }

  // Pass 2: assign text columns (name, company, category, city, state)
  const remainingFields: ContactField[] = [
    "name",
    "company",
    "category",
    "city",
    "state",
  ];

  for (let c = 0; c < colCount; c++) {
    if (!mapping[c]) {
      const nextField = remainingFields.find((f) => !used.has(f));

      if (nextField) {
        mapping[c] = nextField;
        used.add(nextField);
      } else {
        mapping[c] = "skip";
      }
    }
  }

  return mapping;
}

export function gridToRows(
  grid: string[][],
  mapping: Record<number, ContactField>,
  hasHeader: boolean,
): SheetRow[] {
  const dataRows = hasHeader ? grid.slice(1) : grid;
  const standardFields = new Set([
    "name",
    "phone",
    "email",
    "company",
    "category",
    "city",
    "state",
    "website",
    "hasWebsite",
    "pitch",
    "skip",
  ]);

  return dataRows
    .map((row) => {
      const get = (field: string) => {
        const colIdx = Object.keys(mapping).find(
          (k) => mapping[Number(k)] === field,
        );

        return colIdx !== undefined ? (row[Number(colIdx)] || "").trim() : "";
      };

      const extra: Record<string, string> = {};
      for (const [colIdxStr, field] of Object.entries(mapping)) {
        if (!field || field === "skip") continue;
        if (field.startsWith("custom:")) {
          const headerName = field.slice("custom:".length).trim();
          const val = (row[Number(colIdxStr)] || "").trim();

          if (headerName && val) extra[headerName] = val;
        } else if (!standardFields.has(field)) {
          const val = (row[Number(colIdxStr)] || "").trim();

          if (val) extra[field] = val;
        }
      }

      return {
        name: get("name") || get("company") || get("email"),
        phone: get("phone") || undefined,
        email: get("email") || undefined,
        company: get("company") || undefined,
        category: get("category") || undefined,
        city: get("city") || undefined,
        state: get("state") || undefined,
        website: get("website") || undefined,
        hasWebsite: get("hasWebsite") || undefined,
        pitch: get("pitch") || undefined,
        extra: Object.keys(extra).length ? extra : undefined,
      };
    })
    .filter((r) => r.name && (r.phone || r.email));
}

export function sheetToRows(text: string): SheetRow[] {
  const grid = parseDelimited(text);

  if (!grid.length) return [];
  const hasHeader = looksLikeHeader(grid[0]);
  const mapping = autoDetectColumns(grid, hasHeader);

  return gridToRows(grid, mapping, hasHeader);
}
