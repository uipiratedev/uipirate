import HeaderInfo from "./headeInfo";
import GlobalCTA from "@/components/GlobalCTA";

interface BlogData {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  publishedAt: string | null;
  views?: number;
  readTime?: number;
}

interface BlogContentsProps {
  blog: BlogData;
}

const BlogContents = ({ blog }: BlogContentsProps) => {
  return (
    <div className="container mx-auto xl:px-32 2xl:px-40 max-md:px-4 max-md:pt-0 max-xl:px-8 pt-8">
      <HeaderInfo blog={blog} />

      {/* Blog Content */}
      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="blog-prose mt-10 mb-16"
      />

      {/* CTA Banner — convert engaged readers into leads */}
      <GlobalCTA />
    </div>
  );
};

export default BlogContents;
