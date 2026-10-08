import { NextResponse } from "next/server";

import { getRawPostImage } from "@/lib/pirateCOS/public-client";
import { isImageKind, parseImageDataUri } from "@/lib/pirateCOS/images";

export const runtime = "nodejs";

/**
 * Serves a CMS image that is stored as a base64 `data:` URI as a real image.
 *
 * `version` is part of the URL (the post's `updatedAt`), so a changed post gets
 * a new URL and a given URL's bytes never change — which is what makes
 * `immutable` safe. The CDN and browsers fetch each image once, instead of
 * every page embedding it.
 */
export async function GET(
  _req: Request,
  { params }: { params: { slug: string; kind: string; version: string } },
) {
  const { slug, kind } = params;

  if (!isImageKind(kind) || !/^[a-z0-9-]{1,200}$/i.test(slug)) {
    return new NextResponse(null, { status: 404 });
  }

  const raw = await getRawPostImage(slug.toLowerCase(), kind);
  const image = parseImageDataUri(raw);

  // Either the post is gone, the field was replaced with a hosted URL, or the
  // value is not a safe raster image. A 404 is the honest answer in all three.
  if (!image) return new NextResponse(null, { status: 404 });

  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      "Content-Type": image.mime,
      "Content-Length": String(image.bytes.length),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      // Stop a browser from reinterpreting the bytes as something executable.
      "X-Content-Type-Options": "nosniff",
    },
  });
}
