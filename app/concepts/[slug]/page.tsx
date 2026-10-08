import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPostBySlug, listPostSlugs } from "@/lib/cometCOS/public-client";
import { HELD_DRAFT_SLUGS } from "@/lib/indexing/publishable";
import BlogsDetailsHero from "@/screens/blogsDetails/hero";
import BlogContents from "@/screens/blogsDetails/blogContents";
import ConceptDetailScreen from "@/screens/concepts/detail";
import { CONCEPT_DETAILS } from "@/screens/concepts/details";

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
  const cmsSlugs = await listPostSlugs({ postType: "concept" });
  const slugs = new Set([...Object.keys(CONCEPT_DETAILS), ...cmsSlugs]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const detail = CONCEPT_DETAILS[params.slug];

  if (detail) {
    const url = `https://uipirate.com/concepts/${detail.slug}`;
    const ogImage = `${url}/opengraph-image/${detail.slug}`;

    return {
      title: detail.metaTitle,
      description: detail.metaDescription,
      alternates: { canonical: url },
      openGraph: {
        title: detail.metaTitle,
        description: detail.metaDescription,
        url,
        type: "article",
        images: [{ url: ogImage, alt: detail.headline }],
      },
      twitter: {
        card: "summary_large_image",
        title: detail.metaTitle,
        description: detail.metaDescription,
        images: [ogImage],
      },
    };
  }

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
  const detail = CONCEPT_DETAILS[params.slug];

  if (detail) return <ConceptDetailScreen detail={detail} />;

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
      <section className="section-container pb-16 max-md:pb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Have something like this in mind?
        </h2>
        <p className="text-gray-600 mb-6">
          Bring a half-formed idea or a working demo. Typical response under 2
          hours.
        </p>
        <Link
          className="inline-block px-8 py-4 bg-[#FF5B04] text-white font-bold rounded-full hover:bg-[#e04e00] transition-colors"
          href="/contact"
        >
          Start a Conversation →
        </Link>
      </section>
    </div>
  );
}
