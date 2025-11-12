"use client";

import { Button } from "@nextui-org/button";

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

const HeaderInfo = ({ blog }: HeaderInfoProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const publishDate = blog.publishedAt || blog.createdAt;

  return (
    <div className="flex flex-row items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
      <div className="flex flex-row items-center gap-3">
        <img
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
          alt="UI Pirates Logo"
          className="w-10 h-10"
        />
        <div>
          <p className="text-base font-semibold">{blog.author.name}</p>
          <p className="text-sm text-gray-500">
            {blog.views || 0} views • {blog.readTime || 5} min read
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-3">
        <p className="text-base font-medium text-[#777777] uppercase max-md:text-sm">
          {formatDate(publishDate)} | {getTimeAgo(publishDate)}
        </p>
        <Button
          onClick={handleShare}
          className="bg-black text-white rounded-[16px] px-8 py-6 font-bold text-base max-md:text-sm w-full md:w-auto"
          startContent={
            <img
              src="https://res.cloudinary.com/damm9iwho/image/upload/v1761922123/tabler-icon-share-2_qequdd.svg"
              alt="Share"
              className="w-6 h-6 start-6"
            />
          }
        >
          Share
        </Button>
      </div>
    </div>
  );
};

export default HeaderInfo;
