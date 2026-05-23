"use client";

import { useState, useEffect, useRef } from "react";
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
  postType?: "blog" | "tutorial" | "case-study" | "community-insight";
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
  const [filterType, setFilterType] = useState<
    "all" | "blog" | "tutorial" | "case-study" | "community-insight"
  >("all");

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useAuth(true); // Require authentication

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [filterStatus, filterType]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let url = "/api/blogs?limit=100";

      if (filterStatus === "published") {
        url += "&published=true";
      } else if (filterStatus === "draft") {
        url += "&published=false";
      }

      if (filterType !== "all") {
        url += `&postType=${filterType}`;
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
        alert("Post deleted successfully!");
        fetchBlogs(); // Refresh the list
      } else {
        alert(data.error || "Failed to delete post");
      }
    } catch (error) {
      alert("Failed to delete post");
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean, title: string) => {
    const action = currentStatus ? "unpublish" : "publish";
    if (!confirm(`Are you sure you want to ${action} "${title}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Post ${currentStatus ? "unpublished" : "published"} successfully!`);
        fetchBlogs(); // Refresh the list
      } else {
        alert(data.error || `Failed to ${action} post`);
      }
    } catch (error) {
      alert(`Failed to ${action} post`);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || (blog.postType || "blog") === filterType;
    return matchesSearch && matchesType;
  });

  const filterButtons: { label: string; value: typeof filterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Published", value: "published" },
    { label: "Drafts", value: "draft" },
  ];

  return (
    <div className="space-y-6 px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1" style={{ color: "#FF5B04" }}>
            Content
          </p>
          <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">Posts</h1>
          <p className="text-sm text-gray-500 mt-1 font-geist">Manage all your published and draft posts</p>
        </div>
        <Link href="/admin/posts/create">
          <Button className="font-geist font-medium text-white text-sm h-10 px-5 rounded-xl gap-2"
            style={{ background: "#FF5B04" }}>
            <IconCreate /> New Post
          </Button>
        </Link>
      </div>

      {/* Search & Filters in One Row */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-black/5">
        <div className="flex flex-col lg:flex-row gap-3 items-center w-full">
          {/* Search Field */}
          <div className="flex-1 w-full">
            <Input
              classNames={{
                inputWrapper: "bg-black/5 border-transparent shadow-none h-11 rounded-xl focus-within:bg-black/[0.08] transition-all",
                input: "text-sm font-geist text-gray-900",
              }}
              placeholder="Search posts by title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={
                <svg className="w-4 h-4 text-gray-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Dropdowns Container */}
          <div className="flex w-full lg:w-auto items-center gap-3">
            {/* Status Dropdown */}
            <div ref={statusRef} className="relative w-full lg:w-44 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen);
                  setTypeDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-black/5 hover:bg-black/[0.08] transition-all font-geist text-sm text-gray-700 font-medium focus:outline-none"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider flex-shrink-0">Status:</span>
                  <span className="truncate">
                    {filterStatus === "all" ? "All" : filterStatus === "published" ? "Published" : "Drafts"}
                  </span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-1 ${statusDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {statusDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[176px] bg-white rounded-xl border border-black/5 shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {[
                    { label: "All Statuses", value: "all" as const },
                    { label: "Published Only", value: "published" as const },
                    { label: "Drafts Only", value: "draft" as const },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setFilterStatus(value);
                        setStatusDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left font-geist text-sm transition-colors ${
                        filterStatus === value
                          ? "text-[#FF5B04] bg-[#FF5B04]/[0.04] font-semibold"
                          : "text-gray-600 hover:bg-black/[0.02]"
                      }`}
                    >
                      <span>{label}</span>
                      {filterStatus === value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Type Dropdown */}
            <div ref={typeRef} className="relative w-full lg:w-56 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setTypeDropdownOpen(!typeDropdownOpen);
                  setStatusDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between h-11 px-4 rounded-xl bg-black/5 hover:bg-black/[0.08] transition-all font-geist text-sm text-gray-700 font-medium focus:outline-none"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <span className="text-[10px] font-bold font-jetbrains-mono text-gray-400 uppercase tracking-wider flex-shrink-0">Type:</span>
                  <span className="truncate">
                    {[
                      { label: "All Types", value: "all" },
                      { label: "Blogs", value: "blog" },
                      { label: "Tutorials", value: "tutorial" },
                      { label: "Case Studies", value: "case-study" },
                      { label: "Community Insights", value: "community-insight" },
                    ].find((o) => o.value === filterType)?.label || "All Types"}
                  </span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-1 ${typeDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {typeDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[220px] bg-white rounded-xl border border-black/5 shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {[
                    { label: "All Types", value: "all" },
                    { label: "Blogs", value: "blog" },
                    { label: "Tutorials", value: "tutorial" },
                    { label: "Case Studies", value: "case-study" },
                    { label: "Community Insights", value: "community-insight" },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setFilterType(value as any);
                        setTypeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left font-geist text-sm transition-colors ${
                        filterType === value
                          ? "text-[#FF5B04] bg-[#FF5B04]/[0.04] font-semibold"
                          : "text-gray-600 hover:bg-black/[0.02]"
                      }`}
                    >
                      <span>{label}</span>
                      {filterType === value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                {searchQuery ? "Try a different keyword." : "Write your first post to get started."}
              </p>
            </div>
            {!searchQuery && (
              <Link href="/admin/posts/create">
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
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 font-geist">by {blog.author.name}</span>
                        {(() => {
                          const type = blog.postType || "blog";
                          const typeMap: Record<string, { label: string; color: string; bg: string }> = {
                            blog:                { label: "Blog",              color: "#E24A00", bg: "#FFEFE6" },
                            tutorial:           { label: "Tutorial",         color: "#6D28D9", bg: "#EDE9FE" },
                            "case-study":       { label: "Case Study",       color: "#0369A1", bg: "#E0F2FE" },
                            "community-insight": { label: "Community Insight", color: "#065F46", bg: "#D1FAE5" },
                          };
                          const t = typeMap[type];
                          return t ? (
                            <span className="inline-flex text-[9px] font-semibold font-jetbrains-mono px-2 py-0.5 rounded-full"
                              style={{ color: t.color, background: t.bg }}>
                              {t.label}
                            </span>
                          ) : null;
                        })()}
                      </div>
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
                        <Link href={`/admin/posts/edit/${blog._id}`}>
                          <Button size="sm" variant="flat"
                            className="font-geist text-xs h-8 px-3 rounded-lg bg-black/5 text-gray-600 gap-1.5">
                            <IconEdit style={{ width: 13, height: 13 }} /> Edit
                          </Button>
                        </Link>
                        <Button size="sm" variant="flat"
                          className="font-geist text-xs h-8 px-3 rounded-lg gap-1.5 font-medium transition-colors"
                          style={
                            blog.published
                              ? { background: "rgba(249,115,22,0.08)", color: "#EA580C" }
                              : { background: "rgba(22,163,74,0.08)", color: "#16A34A" }
                          }
                          onClick={() => handleTogglePublish(blog._id, blog.published, blog.title)}
                        >
                          {blog.published ? "Unpublish" : "Publish"}
                        </Button>
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
