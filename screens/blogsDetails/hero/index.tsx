"use client";

import { memo } from "react";
import Image from "next/image";

const DEFAULT_BANNER = "/assets/blog-banner-default.svg";

interface BlogHeroProps {
  imageUrl?: string;
  tag: string;
  title: string;
}

const BlogsDetailsHero = memo<BlogHeroProps>(function BlogsDetailsHero({
  imageUrl,
  tag,
  title,
}) {
  const banner = imageUrl || DEFAULT_BANNER;

  return (
    /* Full-width banner with tag + title overlaid on top */
    <div className="relative w-full overflow-hidden" style={{ height: 380 }}>
      {/* Banner image */}
      <Image
        fill
        priority
        alt="Blog banner"
        className="object-cover"
        src={banner}
      />

      {/* Dark gradient — stronger at bottom-left so text is readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.10) 100%)",
        }}
      />

      {/* Tag badge + Title — bottom-left aligned */}
      <div className="absolute inset-0 flex flex-col justify-end pb-10 max-md:pb-7 z-10">
        <div className="container mx-auto xl:px-32 2xl:px-40 max-xl:px-8 max-md:px-4 w-full">
          {/* Tag pill */}
          <span
            className="inline-flex items-center self-start mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
            style={{
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            {tag}
          </span>

          {/* Title */}
          <h1
            className="text-white font-[700] leading-[1.15] tracking-[-0.5px] max-w-2xl
          text-[22px] md:text-[28px] lg:text-[32px] xl:text-[40px]"
          >
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
});

export default BlogsDetailsHero;
