"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { useAuth } from "@/hooks/useAuth";
import { IconCreate, IconEdit, IconTrash, IconBlogs, IconEye } from "@/components/admin/AdminIcons";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  totalViews?: number;
  botViews?: number;
  duplicateViews?: number;
  author: {
    name: string;
  };
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");

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
      // Error fetching blogs
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
      alert("Failed to delete blog");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filterButtons: { label: string; value: typeof filterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Published", value: "published" },
    { label: "Drafts", value: "draft" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1" style={{ color: "#FF5B04" }}>
            Content
          </p>
          <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1 font-geist">Manage all your published and draft posts</p>
        </div>
        <Link href="/admin/blogs/create">
          <Button className="font-geist font-medium text-white text-sm h-10 px-5 rounded-xl gap-2"
            style={{ background: "#FF5B04" }}>
            <IconCreate /> New Post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-black/5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              classNames={{
                inputWrapper: "bg-black/5 border-transparent shadow-none",
                input: "text-sm font-geist",
              }}
              placeholder="Search posts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {filterButtons.map(({ label, value }) => (
              <Button key={value}
                size="sm"
                variant="flat"
                className={`font-geist text-xs h-10 px-4 rounded-xl font-medium transition-all ${
                  filterStatus === value
                    ? "text-white"
                    : "bg-black/5 text-gray-600"
                }`}
                style={filterStatus === value ? { background: "#151514" } : {}}
                onClick={() => setFilterStatus(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <div className="bg-white rounded-2xl shadow-card border border-black/5 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <p className="text-sm text-gray-400 font-geist">Loading posts…</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#FFF0E8" }}>
              <IconBlogs style={{ color: "#FF5B04" }} />
            </div>
            <div>
              <p className="text-sm font-medium font-geist text-gray-900 mb-1">
                {searchQuery ? "No posts match your search" : "No posts yet"}
              </p>
              <p className="text-xs text-gray-400 font-geist">
                {searchQuery ? "Try a different keyword." : "Write your first blog post to get started."}
              </p>
            </div>
            {!searchQuery && (
              <Link href="/admin/blogs/create">
                <Button className="font-geist font-medium text-white text-sm h-10 px-5 rounded-xl gap-2 mt-1"
                  style={{ background: "#FF5B04" }}>
                  <IconCreate /> New Post
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#FAFAF9" }}>
                  <th className="px-6 py-3.5 text-left text-[10px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest w-full">Title</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest whitespace-nowrap">Views</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest whitespace-nowrap">Created</th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="group transition-colors hover:bg-black/[0.02]"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <td className="px-6 py-4">
                      <Link className="text-sm font-medium font-geist text-gray-900 hover:text-[#FF5B04] transition-colors line-clamp-1"
                        href={`/blogs/${blog.slug}`}>
                        {blog.title}
                      </Link>
                      <p className="text-xs text-gray-400 font-geist mt-0.5">by {blog.author.name}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex text-[10px] font-medium font-jetbrains-mono px-2.5 py-1 rounded-full ${
                        blog.published
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-[#FF5B04]"
                      }`}>
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <div className="text-sm font-geist font-semibold text-gray-900 flex items-center gap-1.5">
                          <IconEye style={{ width: 13, height: 13, color: "#7C3AED" }} />
                          {(blog.totalViews || blog.views || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] font-geist text-gray-400 flex items-center gap-1.5 leading-none">
                          <span title="Unique visitors (deduplicated by IP over 24h)" className="hover:text-purple-600 cursor-help font-semibold">
                            {blog.views || 0} U
                          </span>
                          <span className="text-gray-300">•</span>
                          <span title="Repeat visits (same IP within 24h)" className="hover:text-blue-500 cursor-help font-semibold">
                            {blog.duplicateViews || 0} R
                          </span>
                          <span className="text-gray-300">•</span>
                          <span title="Bot/crawler hits (search engines, indexers)" className="hover:text-gray-600 cursor-help font-semibold">
                            {blog.botViews || 0} B
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-geist text-gray-400 whitespace-nowrap">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blogs/edit/${blog._id}`}>
                          <Button size="sm" variant="flat"
                            className="font-geist text-xs h-8 px-3 rounded-lg bg-black/5 text-gray-600 gap-1.5">
                            <IconEdit style={{ width: 13, height: 13 }} /> Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="flat"
                          className="font-geist text-xs h-8 px-3 rounded-lg gap-1.5"
                          style={{ background: "rgba(239,68,68,0.08)", color: "#DC2626" }}
                          onClick={() => handleDelete(blog._id, blog.title)}>
                          <IconTrash style={{ width: 13, height: 13 }} /> Delete
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
