"use client";
import Image from "next/image";
import GlassBadge from "@/components/GlassBadge";
import GlassSurface from "@/components/GlassSurface";
import { ContainerScroll } from "@/components/container-scroll-animation";

interface FeatureCardProps {
  heading: string;
  description: string;
  image?: string;
  index?: number;
}

const WhatYouGetCard = ({
  heading,
  description,
  image,
  index = 0,
}: FeatureCardProps) => {
  return (
    <div
      className="group relative h-[290px] md:h-[360px] rounded-[28px] overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.02]"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      {/* ── Soft white luminous orbs (no color) ── */}
      <div className="absolute -top-[35%] -left-[15%] w-[65%] h-[65%] rounded-full opacity-[0.06] blur-[90px] bg-white transition-all duration-[1200ms] ease-in-out group-hover:opacity-[0.1] group-hover:scale-110" />
      <div className="absolute -bottom-[25%] -right-[10%] w-[55%] h-[55%] rounded-full opacity-[0.05] blur-[80px] bg-white transition-all duration-[1400ms] ease-in-out group-hover:opacity-[0.09] group-hover:scale-125" />
      <div className="absolute top-[25%] right-[20%] w-[15%] h-[15%] rounded-full opacity-[0.04] blur-[40px] bg-white transition-all duration-[1000ms] group-hover:opacity-[0.08]" />

      {/* ── Frosted glass layer ── */}
      <div
        className="absolute inset-0 rounded-[28px]"
        style={{
          backdropFilter: "blur(28px) saturate(1.3) brightness(1.05)",
          WebkitBackdropFilter: "blur(28px) saturate(1.3) brightness(1.05)",
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
        }}
      />

      {/* ── Inner refraction border (white light edge) ── */}
      <div
        className="absolute inset-[1px] rounded-[27px] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.06) 100%)",
        }}
      />

      {/* ── Shimmer sweep on hover ── */}
      <div
        className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 65%)",
          backgroundSize: "250% 100%",
          animation: "liquidShimmer 2.5s ease-in-out infinite",
        }}
      />

      {/* ── Image area ── */}
      {image && (
        <div className="absolute inset-0 flex items-center justify-center z-[1]">
          <div className="relative w-[55%] h-[55%] -mt-6 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-1">
            <Image
              src={image}
              alt={heading}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
      )}

      {/* ── Bottom glass content bar ── */}
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 z-[5]">
        <GlassSurface
          backgroundOpacity={0.06}
          blur={18}
          borderRadius={18}
          borderWidth={0.03}
          brightness={40}
          opacity={0.96}
          saturation={1.2}
          displace={0.3}
          distortionScale={-160}
          redOffset={0}
          greenOffset={8}
          blueOffset={16}
          height="auto"
          width="auto"
          className="px-4 py-3 md:px-5 md:py-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="w-full">
            {/* Thin white accent line */}
            <div className="w-8 h-[1.5px] rounded-full mb-2 bg-white/30" />
            <h3 className="text-[15px] md:text-[17px] font-semibold text-white leading-snug tracking-tight">
              {heading}
            </h3>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-white/60 leading-relaxed">
              {description}
            </p>
          </div>
        </GlassSurface>
      </div>

      {/* ── Top-left soft white glow ── */}
      <div className="absolute top-0 left-0 w-[100px] h-[100px] rounded-br-[50px] bg-white/[0.06] pointer-events-none" />
    </div>
  );
};

const WhatYouGetAnimations = ({ data }: any) => {
  return (
    <section className="pb-20 overflow-hidden">
      {/* Shimmer keyframe */}
      <style jsx global>{`
        @keyframes liquidShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>

      {/* Cards grid with ContainerScroll */}
      <ContainerScroll
        titleComponent={
          <>
            <div className="autoShow text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center mb-3">
                <GlassBadge variant="gradient">{data.badge}</GlassBadge>
              </div>
              <h2 className="heading-center">{data.heading}</h2>
            </div>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 autoShow">
          {data.card.map((feature: any, i: number) => (
            <WhatYouGetCard key={feature.heading} {...feature} index={i} />
          ))}
        </div>
      </ContainerScroll>
    </section>
  );
};

export default WhatYouGetAnimations;
