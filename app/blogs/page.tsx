import { Metadata } from "next";

import Blogs from "@/screens/blogs";

export const metadata: Metadata = {
  title:
    "Design Blog | UI/UX Insights, SaaS Design Tips & Case Studies | UI Pirate",
  description:
    "Expert insights on UI/UX design, SaaS product design, design systems, and AI application design. Case studies, tutorials, and best practices from our Fortune 500 design work.",
  keywords:
    "UI/UX design blog, SaaS design tips, design system articles, UX case studies, enterprise design insights, AI app design, product design blog",
  openGraph: {
    title: "Design Blog | UI Pirate — UI/UX Insights & Case Studies",
    description:
      "Expert UI/UX design insights, SaaS design tips, and case studies from our Fortune 500 design work.",
    url: "https://uipirate.com/blogs",
    siteName: "UI Pirate by Vishal Anand",
    images: [
      {
        url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1779397879/Screenshot_2026-05-22_023842_sebbvi.png",
        width: 1200,
        height: 630,
        alt: "UI Pirate Design Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: "https://uipirate.com/blogs",
  },
};

const BlogsPage = () => {
  return (
    <div>
      {/* Blog Index JSON-LD for rich snippets */}
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "UI Pirate Design Blog",
            description: "Expert insights on UI/UX design, SaaS product design, design systems, and AI application design.",
            url: "https://uipirate.com/blogs",
            publisher: {
              "@type": "Organization",
              name: "UI Pirate",
              logo: {
                "@type": "ImageObject",
                url: "https://res.cloudinary.com/damm9iwho/image/upload/v1731044026/newfavicon_ibmap0.svg",
              },
            },
          }),
        }}
        type="application/ld+json"
      />
      <Blogs />
    </div>
  );
};

export default BlogsPage;
