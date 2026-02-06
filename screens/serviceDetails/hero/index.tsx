"use client";
import Link from "next/link";
import React, { useState } from "react";

const ServiceDetailsHero = ({ data }: any) => {
  const meteors = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${-5 - Math.random() * 10}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${2 + Math.random() * 3}s`,
    drift: `${Math.random() * 80 - 40}px`,
  }));

  const [isHoveredChat, setIsHoveredChat] = useState(false);

  return (
    <div className="relative overflow-hidden bg-white text-black -mt-[67px] md:pt-[67px] md:pb-20">
      {/* === Static Gray Grid Background === */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* === Meteors === */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {meteors.map((meteor) => (
          <span
            key={meteor.id}
            className="meteor absolute"
            style={
              {
                top: meteor.top,
                left: meteor.left,
                animationDelay: meteor.delay,
                animationDuration: meteor.duration,
                "--drift": meteor.drift,
              } as React.CSSProperties
            }
          >
            <div className="absolute w-[3px] h-[3px] -ml-[1px] rounded-full bg-black" />
            <div className="absolute top-0 left-0 w-[1.5px] h-[50px] -translate-y-full bg-gradient-to-b from-gray-200 via-gray-900 to-black opacity-70" />
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

      {/* === Hero Content === */}
      <section className="relative pt-[100px] md:pt-[120px] pb-16 flex flex-col items-center text-center z-10 px-4">
        {/* Badge */}
        <p
          className="text-center uppercase text-[11px] md:text-xs tracking-[0.2em] font-medium text-gray-600 mb-8"
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
        >
          {data.badge}
        </p>

        {/* Headings with Orange Accent */}
        <h1 className="text-3xl md:text-[52px] font-bold leading-[1.15] max-w-4xl mb-6 reveal-text-anim">
          {data.headingPrefix && (
            <span className="text-black">{data.headingPrefix} </span>
          )}
          <span className="text-[#FF5B04]">
            {data.headingHighlight || data.heading}
          </span>
          {data.headingSuffix && (
            <span className="text-black"> {data.headingSuffix}</span>
          )}
        </h1>
        {data.heading1 && (
          <h1 className="text-3xl md:text-[52px] font-bold leading-[1.15] max-w-4xl mb-6 reveal-text-anim text-black">
            {data.heading1}
          </h1>
        )}

        {/* Subheading */}
        <p className="reveal-text-anim-1 max-w-2xl text-center text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
          {data.description}
        </p>

        {/* CTA Buttons - Stacked Vertically */}
        <div className="flex flex-col items-center gap-3 button-spring-animate">
          {/* Primary CTA - Orange Button */}
          <Link href="/contact">
            <button className="group bg-[#FF5B04] hover:bg-[#E54F00] text-white font-semibold px-8 py-4 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  clipRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  fillRule="evenodd"
                />
              </svg>
              <span className="text-base">
                Book a 15-min Product Strategy Call
              </span>
            </button>
          </Link>

          {/* Secondary CTA - White Button */}
          <a href="https://wa.link/i35lma" rel="noreferrer" target="_blank">
            <button
              className="group bg-white hover:bg-gray-50 text-gray-800 font-semibold px-10 py-4 rounded-full flex items-center gap-3 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md"
              onMouseEnter={() => setIsHoveredChat(true)}
              onMouseLeave={() => setIsHoveredChat(false)}
            >
              <img
                alt="WhatsApp"
                className="w-5 h-5"
                src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
              />
              <span className="text-base">
                {isHoveredChat ? "+91 97086 36151" : "Let's Talk"}
              </span>
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailsHero;
