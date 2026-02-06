import Image from "next/image";
import GlassBadge from "@/components/GlassBadge";

const features = [
  {
    title: "Product UI Animations & Ads",
    description:
      "Animations that guide users through actions, states, and key moments inside your product and campaigns.",
    // Replace this with your actual card background image path/URL
    image: "",
  },
  {
    title: "Lottie & JSON Animations",
    description:
      "Lightweight vector animations exported as Lottie / JSON files so developers can drop them straight into code.",
    image: "",
  },
  {
    title: "Website Motion & Interactions",
    description:
      "Scroll, hover, and micro-interactions that make landing pages and marketing sites feel smooth and intentional.",
    image: "",
  },
  {
    title: "Developer-Ready Files",
    description:
      "Clean exports, specs, and implementation notes so your dev team knows exactly how everything should move.",
    image: "",
  },
];

interface FeatureCardProps {
  title: string;
  description: string;
  image?: string;
}

const WhatYouGetCard = ({ title, description, image }: FeatureCardProps) => {
  return (
    <div className="relative h-[190px] md:h-[210px] overflow-hidden rounded-[28px] bg-[#020617] border border-white/10 shadow-[0_22px_55px_rgba(15,23,42,0.75)]">
      {/* Background image */}
      {image ? (
        <Image src={image} alt={title} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.24),transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.85),#020617)]" />
      )}

      {/* Subtle overlay for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.35),transparent_55%)]" />

      {/* Bottom bar with text, like the reference card */}
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <div className="rounded-2xl bg-[linear-gradient(90deg,rgba(15,23,42,0.98),rgba(15,23,42,0.96))] border border-white/10 px-4 py-3 md:px-5 md:py-3.5">
          <h3 className="text-[15px] md:text-[17px] font-semibold text-white leading-snug">
            {title}
          </h3>
          <p className="mt-1 text-[12px] md:text-[14px] text-slate-200/90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const WhatYouGetAnimations = () => {
  return (
    <section className="pt-24 max-md:pt-20 pb-20">
      {/* Header */}
      <div className="autoShow text-center mb-10 md:mb-14">
        <div className="flex items-center justify-center mb-3">
          <GlassBadge variant="gradient">WHAT YOU GET</GlassBadge>
        </div>
        <h2 className="text-3xl md:text-[32px] font-bold text-[#0F172A] leading-tight">
          Everything You Need to Create Smoooooth Animations
        </h2>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 autoShow">
        {features.map((feature) => (
          <WhatYouGetCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default WhatYouGetAnimations;
