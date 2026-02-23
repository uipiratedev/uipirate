"use client";

import GlassBadge from "@/components/GlassBadge";
import LetsTalkButton from "@/components/LetsTalkButton";

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
        <h2 className="heading-center">
          Stay In The Loop
        </h2>

        {/* Illustration placeholder styled similar to design */}
       <div className="flex item-center justify-center my-12">
        <img src="/assets/loop.svg" alt=""  className="w-[300px] h-[300px]" />
       </div>

        {/* Tagline + sparkles */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <p className="tracking-[0.2em] text-xl max-md:text-base font-semibold text-slate-900 uppercase "
          style={{fontFamily:"'JetBrains Mono', monospace"}}
          >
            ✨  Get the Good Stuff Only  ✨
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1 text-xs md:text-sm mb-8 leading-relaxed"
        style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}
        >
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
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
            <input
              type="email"
              placeholder="Email ID"
              className="flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-slate-400"
            />
            <LetsTalkButton variant="color" size="sm" children="Register" className="py-0 my-0" href="#"/>
              
          </div>
        </form>
      </div>
    </section>
  );
};

export default BlogsNewsletter;
