import BlogsDetailsHero from "./hero";
import BlogContents from "./blogContents";
import SuggestedReads from "./suggestedReads";

import type { ReaderPost } from "@/lib/pirateCOS/public-client";

interface PostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterHandle?: string;
  twitterCard?: "summary" | "summary_large_image";
  focusKeyword?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

interface BlogData {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  bannerImage?: string;
  tags?: string[];
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  publishedAt: string | null;
  views?: number;
  readTime?: number;
  seo?: PostSEO;
}

interface BlogsDetailsProps {
  blog: BlogData;
  suggested: ReaderPost[];
}

const BlogsDetails = ({ blog, suggested }: BlogsDetailsProps) => {
  const tag = blog.tags?.[0] ?? "Blog";
  const banner = blog.bannerImage || blog.featuredImage || "";

  return (
    <div>
      <BlogsDetailsHero imageUrl={banner} tag={tag} title={blog.title} />
      <BlogContents blog={blog} />
      <SuggestedReads posts={suggested} />
    </div>
  );
};

export default BlogsDetails;
