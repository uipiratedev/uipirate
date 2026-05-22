import BlogsDetailsHero from "./hero";
import BlogContents from "./blogContents";
import SuggestedReads from "./suggestedReads";

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
}

interface BlogsDetailsProps {
  blog: BlogData;
}

const BlogsDetails = ({ blog }: BlogsDetailsProps) => {
  const tag = blog.tags?.[0] ?? "Blog";
  const banner = blog.bannerImage || blog.featuredImage || "";

  return (
    <div>
      <BlogsDetailsHero
        imageUrl={banner}
        tag={tag}
        title={blog.title}
      />
      <BlogContents blog={blog} />
      <SuggestedReads />
    </div>
  );
};

export default BlogsDetails;
