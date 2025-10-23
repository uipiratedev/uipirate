"use client";
import React from "react";

const ServiceDetailsHero = ({ data }: any) => {
  const meteors = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 9}s`,
    duration: `${4 + Math.random() * 3}s`,
    drift: `${Math.random() * 50 - 25}px`, // small horizontal drift
  }));

  return (
    <div className="relative overflow-hidden bg-[#f5f5f5] text-black md:h-screen">
      {/* === Static Gray Grid Background === */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* === Meteors === */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {meteors.map((meteor) => (
          <span
            key={meteor.id}
            className="meteor absolute size-0.5 rounded-full bg-cyan-400 shadow-[0_0_6px_2px_rgba(0,255,255,0.3)]"
            style={
              {
                // top: "-10%",
                left: meteor.left,
                animationDelay: meteor.delay,
                animationDuration: meteor.duration,
                "--drift": meteor.drift,
              } as React.CSSProperties
            }
          >
            <div className="pointer-events-none absolute top-0 -z-10 h-[80px] w-px -translate-y-1/2 bg-gradient-to-b from-cyan-400 to-transparent" />
          </span>
        ))}
      </div>

      {/* === Hero Content === */}
      <section className="relative pt-16 md:pt-20 flex flex-col items-center text-center z-10">
        {/* Badge */}
        <div
          className="p-2 px-4 rounded-xl bg-[#8EF1F1] border-cyan-400 border-2 mb-6"
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
        >
          <p className="text-center uppercase text-xs max-md:text-[10px] font-medium text-black">
            {data.badge}
          </p>
        </div>

        {/* Headings */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim">
          {data.heading}
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim">
          {data.heading1}
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-base text-gray-600 max-w-3xl reveal-text-anim">
          {data.description}
        </p>

        {/* CTA */}
        <a
          href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-6"
        >
          {/* your button content here */}
        </a>
      </section>
    </div>
  );
};

export default ServiceDetailsHero;
