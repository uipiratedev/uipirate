"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useAuth } from "@/hooks/useAuth";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  author: {
    name: string;
  };
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  
  useAuth(true); // Require authentication

  useEffect(() => {
    fetchBlogs();
  }, [filterStatus]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = "/api/blogs?limit=100";
      
      if (filterStatus === "published") {
        url += "&published=true";
      } else if (filterStatus === "draft") {
        url += "&published=false";
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("Blog deleted successfully!");
        fetchBlogs(); // Refresh the list
      } else {
        alert(data.error || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Manage Blogs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View, edit, and delete your blog posts
          </p>
        </div>
        <Link href="/blogs/create">
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            ➕ Create New Blog
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              classNames={{
                input: "text-base",
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "solid" : "flat"}
              className={
                filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "published" ? "solid" : "flat"}
              className={
                filterStatus === "published"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }
              onClick={() => setFilterStatus("published")}
            >
              Published
            </Button>
            <Button
              variant={filterStatus === "draft" ? "solid" : "flat"}
              className={
                filterStatus === "draft"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }
              onClick={() => setFilterStatus("draft")}
            >
              Drafts
            </Button>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading blogs...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery
                ? "No blogs found matching your search"
                : "No blogs yet. Create your first blog!"}
            </p>
            {!searchQuery && (
              <Link href="/blogs/create">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  Create Blog
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {blog.title}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          by {blog.author.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          blog.published
                            ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {blog.views || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/blogs/edit/${blog._id}`}>
                          <Button
                            size="sm"
                            variant="flat"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="flat"
                          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                          onClick={() => handleDelete(blog._id, blog.title)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

