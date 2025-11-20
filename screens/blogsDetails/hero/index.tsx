"use client";
import Image from "next/image";
import React from "react";

interface BlogHeroProps {
  imageUrl: string;
  tag: string;
  title: string;
}

const BlogsDetailsHero: React.FC<BlogHeroProps> = ({
  imageUrl: _imageUrl,
  tag,
  title,
}) => {
  return (
    <section className="relative w-full h-[300px] md:h-[300px] overflow-hidden  -mt-[67px] md:pt-[67px]">
      {/* Background image */}
      <div className="absolute inset-0 ">
        <Image
          fill
          priority
          alt={title}
          className="object-cover rounded-none"
          quality={90}
          src="https://res.cloudinary.com/damm9iwho/image/upload/v1762014955/blogbanner_n7agjs.svg"
        />
        {/* Overlay for dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/50 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 pb-8 container mx-auto  xl:px-40 2xl:px-48 max-md:px-4  ">
        {/* Tag */}
        <div className="mb-3">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2 rounded-lg">
            {tag}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight max-w-3xl">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default BlogsDetailsHero;
