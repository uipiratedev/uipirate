"use client";

import { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import { Button } from "@heroui/button";

interface BlogData {
  author: {
    name: string;
  };
  publishedAt: string | null;
  createdAt: string;
  views?: number;
  readTime?: number;
}

interface HeaderInfoProps {
  blog: BlogData;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;

  return `${Math.floor(diffInDays / 365)} years ago`;
};

const HeaderInfo = memo<HeaderInfoProps>(function HeaderInfo({ blog }) {
  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }, []);

  const publishDate = useMemo(
    () => blog.publishedAt || blog.createdAt,
    [blog.publishedAt, blog.createdAt]
  );

  const formattedDate = useMemo(() => formatDate(publishDate), [publishDate]);
  const timeAgo = useMemo(() => getTimeAgo(publishDate), [publishDate]);

  return (
    <div className="flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
      <div className="flex items-center gap-3">
        <Image
          alt="UI Pirates Logo"
          className="w-10 h-10"
          height={40}
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
          width={40}
        />
        <div>
          <p className="text-base font-semibold">{blog.author.name}</p>
          <p className="text-sm text-gray-500">
            {blog.views || 0} views • {blog.readTime || 5} min read
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-base font-medium text-gray-500 uppercase max-md:text-sm">
          {formattedDate} | {timeAgo}
        </p>
        <Button
          className="bg-black text-white rounded-2xl px-8 py-6 font-bold text-base max-md:text-sm w-full md:w-auto"
          startContent={
            <Image
              alt="Share"
              className="w-6 h-6"
              height={24}
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1761922123/tabler-icon-share-2_qequdd.svg"
              width={24}
            />
          }
          onClick={handleShare}
        >
          Share
        </Button>
      </div>
    </div>
  );
});

export default HeaderInfo;
