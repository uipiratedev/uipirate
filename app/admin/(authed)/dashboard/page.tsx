import Link from "next/link";
import { Button } from "@heroui/button";

import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import {
  IconBlogs,
  IconCheck,
  IconDraft,
  IconEye,
  IconCreate,
  IconEdit,
} from "@/components/admin/AdminIcons";

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
    .select("title slug published createdAt views totalViews botViews duplicateViews")
    .lean();

  // Aggregate all view counters across all blog posts
  const viewsResult = await Blog.aggregate([
    {
      $group: {
        _id: null,
        totalViews:     { $sum: "$totalViews" },
        uniqueViews:    { $sum: "$views" },
        botViews:       { $sum: "$botViews" },
        duplicateViews: { $sum: "$duplicateViews" },
      },
    },
  ]);
  const aggViews = viewsResult[0] || {};
  const totalViewsAll     = aggViews.totalViews     || 0;
  const uniqueViewsAll    = aggViews.uniqueViews    || 0;
  const botViewsAll       = aggViews.botViews       || 0;
  const duplicateViewsAll = aggViews.duplicateViews || 0;

  const stats = [
    { label: "Total Blogs",     value: totalBlogs,      Icon: IconBlogs, color: "#151514", bg: "#F0EDE8" },
    { label: "Published",       value: publishedBlogs,  Icon: IconCheck, color: "#16A34A", bg: "#DCFCE7" },
    { label: "Drafts",          value: draftBlogs,      Icon: IconDraft, color: "#FF5B04", bg: "#FFF0E8" },
    { label: "Total Views",     value: totalViewsAll.toLocaleString(),   Icon: IconEye,   color: "#7C3AED", bg: "#EDE9FE" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pt-2">
        <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1" style={{ color: "#FF5B04" }}>
          Admin
        </p>
        <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-geist">
          Welcome back, {user?.name || "Admin"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-card border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-medium text-gray-500 font-geist">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold font-geist tracking-tight" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* View Breakdown Strip */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-black/5">
        <p className="text-xs font-semibold font-jetbrains-mono text-gray-400 uppercase tracking-widest mb-4">View Breakdown</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Unique Visitors", value: uniqueViewsAll,    color: "#7C3AED", note: "Deduplicated, 24h window" },
            { label: "Repeat Visits",   value: duplicateViewsAll, color: "#0EA5E9", note: "Same IP, within 24h" },
            { label: "Bot / Crawler",   value: botViewsAll,       color: "#94A3B8", note: "Googlebot, Bingbot, etc." },
            { label: "Raw Total",       value: totalViewsAll,     color: "#FF5B04", note: "All hits combined" },
          ].map(({ label, value, color, note }) => (
            <div key={label} className="flex flex-col gap-1">
              <p className="text-2xl font-bold font-geist tracking-tight" style={{ color }}>
                {value.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-gray-700 font-geist">{label}</p>
              <p className="text-[10px] text-gray-400 font-geist">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
        <h2 className="text-sm font-semibold font-geist text-gray-900 mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/blogs/create">
            <Button className="font-geist font-medium text-white text-sm h-10 px-5 rounded-xl gap-2"
              style={{ background: "#FF5B04" }}>
              <IconCreate /> New Blog Post
            </Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="flat" className="font-geist font-medium text-sm h-10 px-5 rounded-xl gap-2 bg-black/5 text-gray-700">
              <IconBlogs /> Manage Blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold font-geist text-gray-900 uppercase tracking-wider">Recent Posts</h2>
          <Link className="text-xs font-medium font-geist flex items-center gap-1 transition-colors"
            style={{ color: "#FF5B04" }} href="/admin/blogs">
            View all →
          </Link>
        </div>

        {recentBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400 font-geist mb-4">No posts yet. Write your first one.</p>
            <Link href="/admin/blogs/create">
              <Button className="font-geist font-medium text-white text-sm h-10 px-5 rounded-xl gap-2"
                style={{ background: "#FF5B04" }}>
                <IconCreate /> Create Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {recentBlogs.map((blog: any) => (
              <div key={blog._id.toString()}
                className="flex items-center justify-between py-3.5 group">
                <div className="flex-1 min-w-0">
                  <Link className="text-sm font-medium font-geist text-gray-900 hover:text-[#FF5B04] transition-colors truncate block"
                    href={`/blogs/${blog.slug}`}>
                    {blog.title}
                  </Link>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-jetbrains-mono font-medium px-2 py-0.5 rounded-full ${
                      blog.published
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-[#FF5B04]"
                    }`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-gray-400 font-geist">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400 font-geist flex items-center gap-1">
                      <IconEye className="opacity-50" style={{ width: 12, height: 12 }} />
                      {((blog as any).totalViews || (blog as any).views || 0).toLocaleString()}
                      {(blog as any).views !== undefined && (
                        <span className="text-[9px] text-gray-300 ml-0.5">
                          ({((blog as any).views || 0)} unique)
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <Link href={`/admin/blogs?edit=${blog._id}`}>
                  <Button size="sm" variant="flat"
                    className="font-geist text-xs h-8 px-3 rounded-lg bg-black/5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconEdit style={{ width: 14, height: 14 }} /> Edit
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
