"use client";

import GlassBadge from "@/components/GlassBadge";

const BlogsNewsletter = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="max-w-3xl mx-auto text-center px-4">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <GlassBadge variant="gradient" size="sm">
            Newsletter
          </GlassBadge>
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8">
          Stay In The Loop
        </h2>

        {/* Illustration placeholder styled similar to design */}
        <div className="mx-auto mb-8 h-40 md:h-48 w-full max-w-xs rounded-[32px] bg-[radial-gradient(circle_at_top,_#FF5B04,_transparent_60%),linear-gradient(to_bottom,#ffffff,#f4f4f4)] shadow-[0_18px_45px_rgba(15,23,42,0.08)] flex items-center justify-center">
          <div className="h-24 w-20 border-[3px] border-slate-900 rounded-[32px] flex items-center justify-center relative bg-white">
            <div className="h-10 w-10 rounded-full bg-[#FF5B04]" />
          </div>
        </div>

        {/* Tagline + sparkles */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="text-xs md:text-sm">✨</span>
          <p className="tracking-[0.4em] text-[11px] md:text-xs font-semibold text-slate-900 uppercase">
            GET THE GOOD STUFF ONLY
          </p>
          <span className="text-xs md:text-sm">✨</span>
        </div>

        {/* Description */}
        <div className="space-y-1 text-xs md:text-sm text-slate-500 mb-8 leading-relaxed">
          <p>
            We don&apos;t send emails often. Only when there&apos;s something
            genuinely useful.
          </p>
          <p>
            Notes on UX, product decisions, &amp; things we&apos;ve learned the
            hard way.
          </p>
          <p className="italic">Zero marketing fluff. No spam. No filler.</p>
        </div>

        {/* Email input with button inside */}
        <form onSubmit={(e) => e.preventDefault()} className="max-w-md mx-auto">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
            <input
              type="email"
              placeholder="Email ID"
              className="flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#FF5B04] text-white text-xs md:text-sm font-semibold shadow-[0_10px_25px_rgba(255,91,4,0.45)] hover:bg-[#ff7a33] transition-colors whitespace-nowrap"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BlogsNewsletter;
