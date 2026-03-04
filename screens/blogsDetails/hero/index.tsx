"use client";

import { memo } from "react";
import GlassSurface from "@/components/GlassSurface";

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
  return (
    <div className="flex flex-row items-center justify-center py-6 w-full max-md:py-0 max-md:pt-1 relative ">
      {/* Subtle Grid Background Pattern */}
      <div
        className="absolute pointer-events-none -mt-20 "
        style={{
          backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)

            `,
          backgroundSize: "40px 40px",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginLeft: "calc(-50vw + 50%)",
        }}
      />
      {/* Layered gradient with gentle mist animation */}
      <div
        className="absolute pointer-events-none -mt-20 "
        style={{
          backgroundImage: `
              linear-gradient(to top, rgba(250, 250, 250, 1), transparent 10%),
              linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
            `,
          animation: "gentle-mist 8s ease-in-out infinite",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginLeft: "calc(-50vw + 50%)",
        }}
      />
      <div
        className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto px-32 lg:px-20 max-md:px-4  "
        style={{ overflow: "visible" }}
      >
        {" "}
        {/* Badge with GlassSurface */}
        <GlassSurface
          backgroundOpacity={0.1}
          blueOffset={20}
          blur={11}
          borderRadius={12}
          borderWidth={0.01}
          brightness={50}
          className="md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
          displace={0.5}
          distortionScale={-180}
          forceLightMode={true}
          greenOffset={10}
          height="auto"
          opacity={0.93}
          redOffset={0}
          saturation={1}
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
          width="auto"
        >
          {/* Text */}
          <p className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
            {tag}
          </p>
        </GlassSurface>
        {/* Headline */}
        <div className="relative z-10 w-full">
          <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] text-center font-[700] max-md:font-[600]  max-md:leading-[1.08] tracking-[-1.5px] leading-[1.1] relative">
            <span className="text-black">
              {title}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
});

export default BlogsDetailsHero;
