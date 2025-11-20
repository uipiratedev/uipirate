import BlogsDetailsHero from "./hero";
import BlogContents from "./blogContents";
import SuggestedReads from "./suggestedReads";

interface BlogData {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
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
  console.log(blog);
  return (
    <div>
      <BlogsDetailsHero
        imageUrl={blog.featuredImage || ""}
        tag={blog.tags?.[0] ? `🏷️ ${blog.tags[0]}` : "📝 Blog"}
        title={blog.title}
      />
      <BlogContents blog={blog} />
      <SuggestedReads />
    </div>
  );
};

export default BlogsDetails;
