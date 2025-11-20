import { notFound } from "next/navigation";

import BlogsDetails from "@/screens/blogsDetails";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

const BlogsDetailsPage = async ({ params }: any) => {
  await dbConnect();

  // Fetch blog by slug
  const blog = await Blog.findOne({
    slug: params.slug,
    published: true,
  }).lean();

  if (!blog) {
    notFound();
  }

  // Increment view count (don't await to avoid blocking)
  Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();

  // Convert MongoDB document to plain object
  const blogData = {
    ...blog,
    _id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    publishedAt: blog.publishedAt?.toISOString() || null,
  };

  return (
    <div>
      <BlogsDetails blog={blogData} />
    </div>
  );
};

export default BlogsDetailsPage;
