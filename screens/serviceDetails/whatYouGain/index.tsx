"use client";

import GlassBadge from "@/components/GlassBadge";
import { Reveal, RevealGroup } from "@/components/motion";

/**
 * Line-style icons (24x24, stroke, no fill) keyed by the `icon` string on each
 * `whatYouGain` card in `data/sericesDetailsList.json`. Falls back to `layout`.
 */
const ICONS: Record<string, JSX.Element> = {
  layout: (
    <>
      <rect height="7" rx="1" width="7" x="3" y="3" />
      <rect height="7" rx="1" width="7" x="14" y="3" />
      <rect height="7" rx="1" width="7" x="14" y="14" />
      <rect height="7" rx="1" width="7" x="3" y="14" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </>
  ),
  send: (
    <>
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4Z" />
    </>
  ),
  server: (
    <>
      <rect height="8" rx="2" width="20" x="2" y="2" />
      <rect height="8" rx="2" width="20" x="2" y="14" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </>
  ),
  gear: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </>
  ),
  browser: (
    <>
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="M2 9h20" />
      <path d="M6 6h.01" />
      <path d="M9 6h.01" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  checklist: (
    <>
      <path d="m3 17 2 2 4-4" />
      <path d="m3 7 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  bulb: (
    <>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </>
  ),
};

const GainIcon = ({ name }: { name?: string }) => {
  const shape = ICONS[name || "layout"] || ICONS.layout;

  return (
    <div className="w-[74px] h-[50px] bg-[#F3F4F6] rounded-[12px] p-[5px] mb-6 flex-shrink-0">
      <div
        className="w-full h-full bg-white rounded-[8px] flex items-center justify-center"
        style={{
          boxShadow:
            "0 1px 0 0 rgba(255,255,255,0.10) inset, 0 3px 4px 0 rgba(0,0,0,0.03), 0 1px 0 0 #FFF inset",
        }}
      >
        <div className="relative flex items-center justify-center">
          <svg
            className="w-[24px] h-[24px] absolute blur-[3px] opacity-60 translate-y-[2px]"
            fill="none"
            stroke="#ff7a2e"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {shape}
          </svg>
          <svg
            className="w-[24px] h-[24px] relative z-10"
            fill="none"
            stroke="url(#gain-orange-gloss)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient
                id="gain-orange-gloss"
                x1="0%"
                x2="0%"
                y1="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffb885" />
                <stop offset="100%" stopColor="#ff5e00" />
              </linearGradient>
            </defs>
            {shape}
          </svg>
        </div>
      </div>
    </div>
  );
};

const WhatYouGain = ({ data }: { data: any }) => {
  return (
    <section>
      {/* Header */}
      <Reveal variant="up">
        <div className="autoShow text-center mb-6 md:mb-10">
          <div className="flex items-center justify-center mb-6">
            <GlassBadge variant="gradient">{data.badge}</GlassBadge>
          </div>
          <h2 className="heading-center">{data.heading}</h2>
        </div>
      </Reveal>

      {/* Cards */}
      <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-3 autoShowBottom">
        {data.card?.map((item: any) => (
          <Reveal
            key={item.heading}
            as="article"
            className="flex h-full flex-col rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_16px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)]"
            variant="up"
          >
            <GainIcon name={item.icon} />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {item.heading}
            </h3>
            <p className="flex-1 text-sm leading-relaxed text-gray-500">
              {item.description}
            </p>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
};

export default WhatYouGain;
