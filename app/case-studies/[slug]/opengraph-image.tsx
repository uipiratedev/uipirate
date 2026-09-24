import { ImageResponse } from "next/og";

import { getPostBySlug, listPostSlugs } from "@/lib/pirateCOS/public-client";

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
  const slugs = await listPostSlugs({ postType: "case-study" });

  return slugs.map((slug) => ({ slug }));
}

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  return [
    {
      id: params.slug,
      alt: post ? `${post.title} | Case Study` : "Case Study | UI Pirate",
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  const badge = post?.client ? `Case Study — ${post.client}` : "Case Study";
  const title = truncate(post?.title ?? "Case Study", 46);
  const description = truncate(
    post?.seo?.ogDescription || post?.excerpt || "A product & UX case study by UI Pirate.",
    120,
  );

  return new ImageResponse(
    (
      <OGTemplate
        badge={badge}
        description={description}
        title={title}
      />
    ),
    { ...size },
  );
}
