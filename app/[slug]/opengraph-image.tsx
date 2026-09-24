import { ImageResponse } from "next/og";

import { getPostBySlug, listPosts } from "@/lib/pirateCOS/public-client";

import { OGTemplate } from "../_og/template";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Only generated as a fallback for posts without a CMS ogImage/featuredImage —
// see generateMetadata in ./page.tsx, which uses the real photo when one exists.
function truncate(str: string, max: number) {
  if (str.length <= max) return str;

  return str.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export async function generateStaticParams() {
  const posts = await listPosts({ limit: 100 });

  return posts
    .filter((p) => p.postType !== "case-study" && p.postType !== "concept")
    .map((p) => ({ slug: p.slug }));
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
      alt: post ? `${post.title} | UI Pirate Blog` : "UI Pirate Blog",
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  const title = truncate(post?.title ?? "UI Pirate Blog", 46);
  const description = truncate(
    post?.seo?.ogDescription || post?.excerpt || "UI/UX design insights, case studies, and tutorials.",
    120,
  );

  return new ImageResponse(
    (
      <OGTemplate
        badge="UI Pirate Blog"
        description={description}
        title={title}
      />
    ),
    { ...size },
  );
}
