/**
 * Handling for CMS images stored as base64 `data:` URIs.
 *
 * A few CMS posts keep their hero images inline instead of as hosted URLs.
 * One case study alone carries ~410 KB of base64, stored twice (featured +
 * banner). Rendering that as `<img src="data:…">` puts the whole string into
 * the page HTML and again into Next's hydration payload, which is why blog
 * pages reached ~1.8 MB against Googlebot's 2 MB limit — "More to Read" embeds
 * the images of whichever posts it suggests.
 *
 * Instead the reader rewrites each such value to a short URL under
 * `/api/post-image/…`, which decodes the bytes and serves them as a real,
 * cacheable image. Pure functions only, so this is unit tested.
 */

export type ImageKind = "featured" | "banner" | "logo";

export const IMAGE_KINDS: readonly ImageKind[] = [
  "featured",
  "banner",
  "logo",
];

export function isImageKind(v: string): v is ImageKind {
  return (IMAGE_KINDS as readonly string[]).includes(v);
}

/** Raster formats only. SVG is excluded: it can carry script. */
const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export function isDataUri(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:");
}

export interface ParsedImage {
  mime: string;
  bytes: Buffer;
}

/** Decode a base64 image data URI, or `null` if it is not a safe raster image. */
export function parseImageDataUri(value: unknown): ParsedImage | null {
  if (!isDataUri(value)) return null;

  const comma = value.indexOf(",");

  if (comma < 0) return null;

  const meta = value.slice(5, comma); // after "data:"
  const parts = meta.split(";");
  const mime = (parts[0] || "").toLowerCase();

  if (!ALLOWED_MIME.has(mime)) return null;
  // Only base64 payloads; percent-encoded text data URIs are not images here.
  if (!parts.includes("base64")) return null;

  const bytes = Buffer.from(value.slice(comma + 1), "base64");

  if (bytes.length === 0) return null;

  return { mime: mime === "image/jpg" ? "image/jpeg" : mime, bytes };
}

/**
 * Short, versioned URL for a post image. The version is part of the *path*,
 * not a query string, so it is a distinct cache key everywhere and works with
 * `next/image`'s local-source handling. When the post changes, `version`
 * changes, so the URL can be cached as immutable.
 */
export function postImageUrl(
  slug: string,
  kind: ImageKind,
  version: string | number | undefined,
): string {
  const v = String(version ?? "0").replace(/[^a-zA-Z0-9]/g, "") || "0";

  return `/api/post-image/${encodeURIComponent(slug)}/${kind}/${v}`;
}

/**
 * Replaces a data-URI image with its proxy URL; passes anything else
 * (hosted URL, relative asset path, undefined) through untouched.
 */
export function proxyIfDataUri(
  value: string | undefined,
  slug: string,
  kind: ImageKind,
  version: string | number | undefined,
): string | undefined {
  return isDataUri(value) ? postImageUrl(slug, kind, version) : value;
}

/** A compact numeric version from an ISO timestamp. */
export function versionOf(updatedAt: unknown): string {
  const t = typeof updatedAt === "string" ? Date.parse(updatedAt) : NaN;

  return Number.isNaN(t) ? "0" : String(t);
}
