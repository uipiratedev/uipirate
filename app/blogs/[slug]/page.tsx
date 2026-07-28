import { permanentRedirect } from "next/navigation";

interface Props {
  params: { slug: string };
}

// /blogs/[slug] merged into /[slug] (single canonical URL for blog posts).
// Permanent redirect consolidates link equity and avoids serving duplicate
// content at two live URLs for the same post.
export default function BlogsSlugRedirect({ params }: Props) {
  permanentRedirect(`/${params.slug.toLowerCase()}`);
}
