"use client";
import GlassSurface from "@/components/GlassSurface";
import {
  HERO_BADGE_PRESET,
  HERO_BADGE_CLASSNAME,
  HERO_BADGE_ANIMATION_STYLE
} from "@/config/glassSurfacePresets";

const TRUST_STATS = [
  { value: "50+", label: "Products Shipped" },
  { value: "5.0★", label: "Average Rating" },
  { value: "< 2hr", label: "Response Time" },
  { value: "9yr+", label: "In Business" },
];

const PricingHero = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-md:py-0 max-md:pt-1 relative">
      {/* Subtle Grid Background Pattern */}
      <div
        className="absolute pointer-events-none -mt-20"
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
        className="absolute pointer-events-none -mt-20"
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
        className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto"
        style={{ overflow: "visible" }}
      >
        {/* Badge - Same as Landing Page Hero */}
        <GlassSurface
          {...HERO_BADGE_PRESET}
          className={HERO_BADGE_CLASSNAME}
          style={HERO_BADGE_ANIMATION_STYLE}
        >
          <div className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
            PLANS & PRICING
          </div>
        </GlassSurface>

        {/* Headline */}
        <div className="relative z-10 w-full">
          <h1 className="hero-header">
            <span className="text-black">Simple, Transparent </span>
            <span className="text-brand-orange">Pricing</span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="reveal-text-anim-1 max-w-[720px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 my-4 px-4 leading-relaxed text-gray-600">
          No hidden fees. No surprise invoices. Choose the plan that fits your scope —
          from monthly retainers to one-time projects. We work the way you need.
        </p>

        {/* Trust Stats */}
        <div className="flex flex-wrap justify-center gap-8 max-md:gap-4 mt-6 mb-2 autoShow">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl max-md:text-lg font-black font-jetbrains-mono text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Pricing Anchor */}
        <div className="mt-6 flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full autoShow">
          <span className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">Save 50-70%</span> compared to US agencies
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default PricingHero;
