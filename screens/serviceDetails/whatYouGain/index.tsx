"use client";

import SectionHeader from "@/components/SectionHeader";
import { Reveal, RevealGroup } from "@/components/motion";

/**
 * Line-style icons (24x24, stroke, no fill) keyed by the `icon` string on each
 * `whatYouGain` card in `data/sericesDetailsList.json`. Falls back to `layout`.
 */
/**
 * Filled compound-path icons (24x24) keyed by the `icon` string on each
 * `whatYouGain` card in `data/sericesDetailsList.json`. Matches the About page
 * glossy glass bevel style exactly.
 */
const ICONS: Record<string, JSX.Element> = {
  screens: (
    <path
      clipRule="evenodd"
      d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-6v2h2.5a1 1 0 1 1 0 2h-7a1 1 0 1 1 0-2H10v-2H4a2 2 0 0 1-2-2V4zm2 0v11h16V4H4zm2 2h4v7H6V6zm6 0h6v3h-6V6zm0 5h6v2h-6v-2z"
      fillRule="evenodd"
    />
  ),
  layout: (
    <path
      clipRule="evenodd"
      d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-6v2h2.5a1 1 0 1 1 0 2h-7a1 1 0 1 1 0-2H10v-2H4a2 2 0 0 1-2-2V4zm2 0v11h16V4H4zm2 2h4v7H6V6zm6 0h6v3h-6V6zm0 5h6v2h-6v-2z"
      fillRule="evenodd"
    />
  ),
  steer: (
    <path
      clipRule="evenodd"
      d="M12 1a1.25 1.25 0 0 1 1.25 1.25v1.85a8 8 0 0 1 4.9 2.03l1.3-1.3a1.25 1.25 0 1 1 1.77 1.77l-1.3 1.3a8 8 0 0 1 2.03 4.9h1.85a1.25 1.25 0 1 1 0 2.5h-1.85a8 8 0 0 1-2.03 4.9l1.3 1.3a1.25 1.25 0 0 1-1.77 1.77l-1.3-1.3a8 8 0 0 1-4.9 2.03v1.85a1.25 1.25 0 1 1-2.5 0v-1.85a8 8 0 0 1-4.9-2.03l-1.3 1.3a1.25 1.25 0 0 1-1.77-1.77l1.3-1.3A8 8 0 0 1 3.85 13.25H2a1.25 1.25 0 1 1 0-2.5h1.85a8 8 0 0 1 2.03-4.9l-1.3-1.3a1.25 1.25 0 0 1 1.77-1.77l1.3 1.3A8 8 0 0 1 10.75 4.1V2.25A1.25 1.25 0 0 1 12 1zm0 5a6 6 0 0 0-5.196 3H9a1 1 0 0 1 1 1v1.268a2.5 2.5 0 0 1 0 1.464V14a1 1 0 0 1-1 1H6.804A6 6 0 0 0 12 18a6 6 0 0 0 5.196-3H15a1 1 0 0 1-1-1v-1.268a2.5 2.5 0 0 1 0-1.464V10a1 1 0 0 1 1-1h2.196A6 6 0 0 0 12 6zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
      fillRule="evenodd"
    />
  ),
  helm: (
    <path
      clipRule="evenodd"
      d="M12 1a1.25 1.25 0 0 1 1.25 1.25v1.85a8 8 0 0 1 4.9 2.03l1.3-1.3a1.25 1.25 0 1 1 1.77 1.77l-1.3 1.3a8 8 0 0 1 2.03 4.9h1.85a1.25 1.25 0 1 1 0 2.5h-1.85a8 8 0 0 1-2.03 4.9l1.3 1.3a1.25 1.25 0 0 1-1.77 1.77l-1.3-1.3a8 8 0 0 1-4.9 2.03v1.85a1.25 1.25 0 1 1-2.5 0v-1.85a8 8 0 0 1-4.9-2.03l-1.3 1.3a1.25 1.25 0 0 1-1.77-1.77l1.3-1.3A8 8 0 0 1 3.85 13.25H2a1.25 1.25 0 1 1 0-2.5h1.85a8 8 0 0 1 2.03-4.9l-1.3-1.3a1.25 1.25 0 0 1 1.77-1.77l1.3 1.3A8 8 0 0 1 10.75 4.1V2.25A1.25 1.25 0 0 1 12 1zm0 5a6 6 0 0 0-5.196 3H9a1 1 0 0 1 1 1v1.268a2.5 2.5 0 0 1 0 1.464V14a1 1 0 0 1-1 1H6.804A6 6 0 0 0 12 18a6 6 0 0 0 5.196-3H15a1 1 0 0 1-1-1v-1.268a2.5 2.5 0 0 1 0-1.464V10a1 1 0 0 1 1-1h2.196A6 6 0 0 0 12 6zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
      fillRule="evenodd"
    />
  ),
  "pen-tool": (
    <path
      clipRule="evenodd"
      d="M14.07 2.93a1 1 0 0 1 1.41 0l5.59 5.59a1 1 0 0 1 0 1.41l-7.07 7.07-2.83.71.71-2.83 7.07-7.07-4.17-4.17-6.09 6.09a3 3 0 0 0-.76 1.42l-1.39 5.56a1 1 0 0 0 1.21 1.21l5.56-1.39a3 3 0 0 0 1.42-.76l6.09-6.09-1.41-1.41-6.09 6.09a1 1 0 0 1-.47.25l-4.14 1.03 1.03-4.14a1 1 0 0 1 .25-.47l6.09-6.09-1.41-1.41z M8.5 14.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
      fillRule="evenodd"
    />
  ),
  compass: (
    <path
      clipRule="evenodd"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm4.5 4.5l-2.5 7-7 2.5 2.5-7 7-2.5zm-3.5 3.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
      fillRule="evenodd"
    />
  ),
  rocket: (
    <path
      clipRule="evenodd"
      d="M12 2C9.5 5.5 7.5 9.5 7.5 15h9C16.5 9.5 14.5 5.5 12 2z M12 6.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z M7.5 12.5L3.5 18l4.5-1.5v-4z M16.5 12.5v4l4.5 1.5-4-5.5z M9 16.5h6l-1 2.5H10l-1-2.5z M10.5 20.5h3L12 23.5l-1.5-3z"
      fillRule="evenodd"
    />
  ),
  send: (
    <path d="M12 2c-2.5 4-5 8-5 13h2c0-3.5 1.5-7 3-10 1.5 3 3 6.5 3 10h2c0-5-2.5-9-5-13zm0 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-6 7l-3 5 5-1.5V14H6zm12 0v1.5l5 1.5-3-5h-2zm-3 4H9l-1 2h8l-1-2zm-4 3l1 3 1-3h-2z" />
  ),
  server: (
    <path d="M4 3h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2zm0 2v4h16V5H4zm2 1.5h2v1H6v-1zm4 0h2v1h-2v-1zm-6 7.5h16c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2zm0 2v4h16v-4H4zm2 1.5h2v1H6v-1zm4 0h2v1h-2v-1z" />
  ),
  gear: (
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1-8h2l.5 2.5a7 7 0 0 1 2 .8l2.2-1.3 1.4 1.4-1.3 2.2a7 7 0 0 1 .8 2L21 11v2l-2.5.5a7 7 0 0 1-.8 2l1.3 2.2-1.4 1.4-2.2-1.3a7 7 0 0 1-2 .8L13 21h-2l-.5-2.5a7 7 0 0 1-2-.8l-2.2 1.3-1.4-1.4 1.3-2.2a7 7 0 0 1-.8-2L3 13v-2l2.5-.5a7 7 0 0 1 .8-2L5 6.3l1.4-1.4 2.2 1.3a7 7 0 0 1 2-.8L11 2z" />
  ),
  chart: (
    <path d="M3 3h2v14h16v2H3V3zm15 4h2v8h-2V7zm-5 3h2v5h-2v-5zm-5 4h2v1H8v-1z" />
  ),
  browser: (
    <path d="M4 4C2.895 4 2 4.895 2 6v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2H4zm0 2h16v3H4V6zm0 5h16v7H4v-7z" />
  ),
  target: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
  ),
  checklist: (
    <path d="M3.3 8.7a1 1 0 0 1 1.4-1.4l2.3 2.3 5.3-5.3a1 1 0 1 1 1.4 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3zm0 8a1 1 0 0 1 1.4-1.4l2.3 2.3 5.3-5.3a1 1 0 1 1 1.4 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3zM16 8h5a1 1 0 1 1 0 2h-5a1 1 0 1 1 0-2zm0 8h5a1 1 0 1 1 0 2h-5a1 1 0 1 1 0-2z" />
  ),
  search: (
    <path d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.39a1 1 0 0 1-1.42 1.42l-5.39-5.39A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
  ),
  bulb: (
    <path d="M12 2a7 7 0 0 0-7 7c0 2.6 1.4 4.8 3.5 6v2a1.5 1.5 0 0 0 1.5 1.5h4A1.5 1.5 0 0 0 15.5 17v-2c2.1-1.2 3.5-3.4 3.5-6a7 7 0 0 0-7-7zm2 15h-4v-1.2a1 1 0 0 0-.5-.9C7.8 13.9 7 12.1 7 9a5 5 0 1 1 10 0c0 3.1-.8 4.9-2.5 5.9a1 1 0 0 0-.5.9V17zm-3 3h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2z" />
  ),
};

const GainIcon = ({ name }: { name?: string }) => {
  const shape = ICONS[name || "screens"] || ICONS.screens || ICONS.layout;

  return (
    <div className="w-[74px] h-[50px] bg-[#F3F4F6] rounded-[12px] p-[5px] mb-6 flex-shrink-0">
      <div
        className="w-full h-full bg-white rounded-[8px] flex items-center justify-center"
        style={{
          boxShadow:
            "0 1px 0 0 rgba(255, 255, 255, 0.10) inset, 0 3px 4px 0 rgba(0, 0, 0, 0.03), 0 1px 0 0 #FFF inset",
        }}
      >
        <div className="relative flex items-center justify-center">
          <svg
            className="w-[24px] h-[24px] relative z-10"
            fill="url(#gain-orange-gloss)"
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

            {/* Base Shape */}
            {shape}

            {/* Inner White Highlight (Glass effect) */}
            <g
              fill="none"
              stroke="white"
              strokeOpacity="0.7"
              strokeWidth="0.8"
              style={{ transform: "translateY(0.5px)" }}
            >
              {shape}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

const WhatYouGain = ({ data }: { data: any }) => {
  return (
    <section className="section-container">
      <Reveal variant="up">
        <SectionHeader chip={data.badge}>{data.heading}</SectionHeader>
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
