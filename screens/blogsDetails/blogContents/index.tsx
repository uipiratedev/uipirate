import HeaderInfo from "./headeInfo";

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
  console.log(blog);

  return (
    <div className="container mx-auto xl:px-40 2xl:px-48 max-md:px-4 max-md:pt-0  max-xl:px-4 max-2xl:px-0 pt-12">
      <HeaderInfo blog={blog} />

      {/* Blog Content */}
      <div
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="prose prose-lg max-w-none dark:prose-invert mt-8 mb-12"
      />
    </div>
  );
};

export default BlogContents;
