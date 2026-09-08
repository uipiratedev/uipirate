import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPostBySlug, listPostSlugs } from "@/lib/pirateCOS/public-client";
import { HELD_DRAFT_SLUGS } from "@/lib/indexing/publishable";
import BlogsDetailsHero from "@/screens/blogsDetails/hero";
import BlogContents from "@/screens/blogsDetails/blogContents";

interface PageProps {
  params: { slug: string };
}

// ISR: revalidate every 60s so newly published/edited CMS case studies show
// up without a full rebuild (matches /case-studies and /blogs).
export const revalidate = 60;

async function getCaseStudy(slug: string) {
  const post = await getPostBySlug(slug);

  if (!post || post.postType !== "case-study") return null;

  return post;
}

export async function generateStaticParams() {
  const slugs = await listPostSlugs({ postType: "case-study" });

  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const study = await getCaseStudy(params.slug);

  if (!study) {
    return { title: "Case Study Not Found | UI Pirate" };
  }

  const url = `https://uipirate.com/case-studies/${study.slug}`;
  const description = study.seo?.metaDescription || study.excerpt || undefined;

  // Held/unreleased case studies must never be indexable, regardless of CMS SEO.
  const noIndex = HELD_DRAFT_SLUGS.has(study.slug) || !!study.seo?.noIndex;

  return {
    title: study.seo?.metaTitle || `${study.title} | Case Study`,
    description,
    alternates: { canonical: study.seo?.canonicalUrl || url },
    openGraph: {
      title: study.seo?.ogTitle || study.title,
      description,
      url,
      type: "article",
      images: study.featuredImage
        ? [{ url: study.featuredImage, alt: study.title }]
        : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const study = await getCaseStudy(params.slug);

  if (!study) notFound();

  return (
    <div>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: study.title,
            description: study.excerpt,
            image: study.featuredImage || undefined,
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
            url: `https://uipirate.com/case-studies/${study.slug}`,
          }),
        }}
        type="application/ld+json"
      />
      <BlogsDetailsHero
        imageUrl={study.bannerImage || study.featuredImage}
        tag="Case Study"
        title={study.title}
      />
      <BlogContents blog={study} />
    </div>
  );
}
