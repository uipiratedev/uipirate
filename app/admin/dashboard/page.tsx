import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { Button } from "@nextui-org/button";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  await dbConnect();

  // Get blog statistics
  const totalBlogs = await Blog.countDocuments();
  const publishedBlogs = await Blog.countDocuments({ published: true });
  const draftBlogs = await Blog.countDocuments({ published: false });

  // Get recent blogs
  const recentBlogs = await Blog.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title slug published createdAt views")
    .lean();

  // Calculate total views
  const viewsResult = await Blog.aggregate([
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const totalViews = viewsResult[0]?.totalViews || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, {user?.name || "Admin"}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Total Blogs
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {totalBlogs}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Published
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {publishedBlogs}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Drafts
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                {draftBlogs}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Total Views
              </p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                {totalViews}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/blogs/create">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              ➕ Create New Blog
            </Button>
          </Link>
          <Link href="/admin/dashboard/blogs">
            <Button variant="flat" className="bg-gray-100 dark:bg-gray-700">
              📝 Manage Blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recent Blogs
          </h2>
          <Link
            href="/admin/dashboard/blogs"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No blogs yet. Create your first blog!
            </p>
            <Link href="/blogs/create">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Create Blog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBlogs.map((blog: any) => (
              <div
                key={blog._id.toString()}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {blog.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        blog.published
                          ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      👁️ {blog.views || 0} views
                    </span>
                  </div>
                </div>
                <Link href={`/admin/dashboard/blogs?edit=${blog._id}`}>
                  <Button
                    size="sm"
                    variant="flat"
                    className="bg-gray-100 dark:bg-gray-700"
                  >
                    Edit
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

