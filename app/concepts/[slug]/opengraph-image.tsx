import { ImageResponse } from "next/og";

import { getPostBySlug, listPostSlugs } from "@/lib/cometCOS/public-client";

import { CONCEPT_DETAILS } from "@/screens/concepts/details";

import { OGTemplate } from "../../_og/template";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Only generated as a fallback for posts without a CMS featuredImage — see
// generateMetadata in ../page.tsx, which uses the real photo when one exists.
function truncate(str: string, max: number) {
  if (str.length <= max) return str;

  return str.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export async function generateStaticParams() {
  const cmsSlugs = await listPostSlugs({ postType: "concept" });
  const slugs = new Set([...Object.keys(CONCEPT_DETAILS), ...cmsSlugs]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const detail = CONCEPT_DETAILS[params.slug];

  if (detail) {
    return [{ id: params.slug, alt: `${detail.headline} | Concept` }];
  }

  const post = await getPostBySlug(params.slug);

  return [
    {
      id: params.slug,
      alt: post ? `${post.title} | Concept` : "Concept | UI Pirate",
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const detail = CONCEPT_DETAILS[params.slug];
  const post = detail ? null : await getPostBySlug(params.slug);

  const title = truncate(detail?.headline ?? post?.title ?? "Concept", 46);
  const description = truncate(
    detail?.metaDescription ||
      post?.seo?.ogDescription ||
      post?.excerpt ||
      "A product concept by UI Pirate.",
    120,
  );

  return new ImageResponse(
    <OGTemplate badge="Concept" description={description} title={title} />,
    { ...size },
  );
}
