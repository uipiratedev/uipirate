import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPostBySlug, listPostSlugs } from "@/lib/pirateCOS/public-client";
import { HELD_DRAFT_SLUGS } from "@/lib/indexing/publishable";
import BlogsDetailsHero from "@/screens/blogsDetails/hero";
import BlogContents from "@/screens/blogsDetails/blogContents";

interface PageProps {
  params: { slug: string };
}

// ISR: revalidate every 60s so newly published/edited CMS concepts show
// up without a full rebuild (matches /case-studies and /blogs).
export const revalidate = 60;

async function getConcept(slug: string) {
  const post = await getPostBySlug(slug);

  if (!post || post.postType !== "concept") return null;

  return post;
}

export async function generateStaticParams() {
  const slugs = await listPostSlugs({ postType: "concept" });

  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const concept = await getConcept(params.slug);

  if (!concept) {
    return { title: "Concept Not Found | UI Pirate" };
  }

  const url = `https://uipirate.com/concepts/${concept.slug}`;
  const description =
    concept.seo?.metaDescription || concept.excerpt || undefined;

  // Held/unreleased concepts must never be indexable, regardless of CMS SEO.
  const noIndex = HELD_DRAFT_SLUGS.has(concept.slug) || !!concept.seo?.noIndex;

  // Next does NOT auto-wire the file-based opengraph-image route once a page
  // defines its own `openGraph` object, so point at it explicitly when there's
  // no CMS photo (the route's generateImageMetadata id is the slug itself).
  const fallbackImage = `${url}/opengraph-image/${concept.slug}`;

  const ogImage = concept.featuredImage || fallbackImage;

  return {
    title: concept.seo?.metaTitle || `${concept.title} | Concept`,
    description,
    alternates: { canonical: concept.seo?.canonicalUrl || url },
    openGraph: {
      title: concept.seo?.ogTitle || concept.title,
      description,
      url,
      type: "article",
      images: [{ url: ogImage, alt: concept.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: concept.seo?.ogTitle || concept.title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function ConceptDetailPage({ params }: PageProps) {
  const concept = await getConcept(params.slug);

  if (!concept) notFound();

  return (
    <div>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: concept.title,
            description: concept.excerpt,
            image: concept.featuredImage || undefined,
            author: {
              "@type": "Organization",
              name: "UI Pirate by Vishal Anand",
              url: "https://uipirate.com",
            },
            publisher: {
              "@type": "Organization",
              name: "UI Pirate by Vishal Anand",
              url: "https://uipirate.com",
            },
            url: `https://uipirate.com/concepts/${concept.slug}`,
          }),
        }}
        type="application/ld+json"
      />
      <BlogsDetailsHero
        imageUrl={concept.bannerImage || concept.featuredImage}
        tag="Concept"
        title={concept.title}
      />
      <BlogContents blog={concept} />
    </div>
  );
}
