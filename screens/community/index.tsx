"use client";

import GlassSurface from "@/components/GlassSurface";
import Link from "next/link";

const Community = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative overflow-hidden px-4">
      {/* Dynamic Animated Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
              linear-gradient(to right, rgba(0, 122, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 122, 255, 0.03) 1px, transparent 1px)
            `,
          backgroundSize: "60px 60px",
        }}
      />
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#FF5B04]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl">
        {/* Status Badge */}
        <GlassSurface
          backgroundOpacity={0.15}
          blur={12}
          borderRadius={100}
          borderWidth={0.01}
          brightness={60}
          className="px-6 py-2 mb-8 border border-white/20 shadow-xl"
          width="auto"
          height="auto"
        >
          <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-orange-500 uppercase">
            Growing our circle
          </span>
        </GlassSurface>

        {/* Headline */}
        <h1 className="text-[48px] md:text-[84px] font-bold leading-[1.05] tracking-[-3px] text-zinc-900 mb-6">
          Community <br />
          <span className="text-zinc-400">Insights</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-zinc-500 leading-relaxed mb-12 max-w-xl mx-auto">
          We&apos;re building a space for creators, designers, and tech enthusiasts to share knowledge. 
          Our community platform is currently under development.
        </p>

        {/* CTA */}
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="https://linkedin.com/uipirate" target="_blank">
            <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20">
              Follow our Journey
            </button>
          </Link>
          <Link href="/">
            <button className="glass-button bg-white/50 backdrop-blur-md border border-zinc-200 text-zinc-900 px-8 py-4 rounded-full font-semibold hover:bg-white transition-all transform hover:scale-105">
              Back to Home
            </button>
          </Link>
        </div>
      </div>

      {/* Subtle Bottom Mist */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default Community;
