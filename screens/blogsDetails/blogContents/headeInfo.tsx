"use client";

import { memo, useCallback, useMemo } from "react";

interface BlogData {
  author: { name: string };
  publishedAt: string | null;
  createdAt: string;
  views?: number;          // unique human views
  totalViews?: number;     // all hits combined (biggest number)
  readTime?: number;
}

const getTimeAgo = (dateString: string): string => {
  const diffInDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86_400_000
  );
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

const HeaderInfo = memo<{ blog: BlogData }>(function HeaderInfo({ blog }) {
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // user cancelled or clipboard unavailable
    }
  }, []);

  const publishDate = useMemo(
    () => blog.publishedAt || blog.createdAt,
    [blog.publishedAt, blog.createdAt]
  );
  const timeAgo = useMemo(() => getTimeAgo(publishDate), [publishDate]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
        {/* Author */}
        <div className="flex items-center gap-3">
          {/* Branded avatar — orange circle with initials */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: "#FF5B04" }}>
            UI
          </div>
          <div>
            <p className="text-sm font-bold text-[#111] uppercase tracking-wide">
              {blog.author.name}
            </p>
            <p className="text-xs text-gray-400">
              {(blog.totalViews || blog.views || 0).toLocaleString()} views · {blog.readTime || 5} min read
            </p>
          </div>
        </div>

        {/* Meta + Share */}
        <div className="flex items-center gap-4 max-md:w-full max-md:justify-between">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
            {blog.readTime || 5} min read &nbsp;|&nbsp; {timeAgo}
          </p>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111] text-white text-xs font-semibold hover:bg-[#333] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-6 mb-0 border-gray-100" />
    </>
  );
});

export default HeaderInfo;
