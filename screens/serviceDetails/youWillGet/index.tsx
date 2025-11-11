"use client";
import Image from "next/image";

export default function YouWillGet({ data }: any) {
  return (
    <section className="relative flex flex-col items-center justify-center pt-32 max-md:pt-24">
      {/* Header */}
      <div className="autoShow mb-12 text-center">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            {data.badge}
          </span>
        </div>
        <p className="heading-center">{data.heading}</p>
      </div>

      {/* Main layout */}
      <div className="relative flex items-center justify-center w-full max-w-6xl gap-6">
        {/* LEFT side */}
        <div className="hidden md:flex flex-col justify-between h-[450px] w-1/3 relative">
          {data.leftBadges.map((badge: any, i: number) => (
            <div
              key={i}
              className="absolute left-0 flex items-center"
              style={{ top: `${i * 100}px` }}
            >
              {/* Badge */}
              <div
                className="px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap flex items-center"
                style={{
                  background: badge.color,
                  transform: `rotate(${badge.rotation}deg)`,
                  transformOrigin: "right center",
                }}
              >
                <span className="bg-white p-1 rounded-[6px] my-1 mr-2">
                  {badge.icon}
                </span>
                {badge.text}
              </div>

              {/* Connector */}
              <div
                style={{
                  width: "280px",
                  height: "4px",
                  borderRadius: "9999px",
                  background: badge.color,
                  transform: `rotate(${badge.rotation}deg)`,
                  transformOrigin: "left center",
                }}
              />
            </div>
          ))}
        </div>

        {/* CENTER mockup - height matches left/right */}
        <div className="relative flex justify-center items-center h-[450px]">
          <Image
            src={data.mockup}
            alt="App Mockup"
            width={320}
            height={450}
            className="rounded-[1rem] object-cover h-[450px] w-auto z-50 bg-white"
          />
        </div>

        {/* RIGHT side */}
        <div className="hidden md:flex flex-col justify-between h-[450px] w-1/3 relative z-0">
          {data.rightBadges.map((badge: any, i: number) => (
            <div
              key={i}
              className="absolute right-0 flex items-center justify-end"
              style={{ top: `${i * 100}px` }}
            >
              {/* Connector */}
              <div
                style={{
                  width: "280px",
                  height: "4px",
                  borderRadius: "9999px",
                  background: badge.color,
                  transform: `rotate(${badge.rotation}deg)`,
                  transformOrigin: "right center",
                }}
              />
              {/* Badge */}
              <div
                className="px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap flex items-center"
                style={{
                  background: badge.color,
                  transform: `rotate(${badge.rotation}deg)`,
                  transformOrigin: "left center",
                }}
              >
                <span className="bg-white p-1 rounded-[6px] my-1 mr-2">
                  {badge.icon}
                </span>
                {badge.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOBILE layout */}
      <div className="md:hidden flex flex-col items-center gap-3 mt-10">
        {[...data.leftBadges, ...data.rightBadges].map((b, i) => (
          <div
            key={i}
            className="px-4 py-2 text-sm font-semibold rounded-full shadow"
            style={{ background: b.color }}
          >
            {b.text}
          </div>
        ))}
      </div>
    </section>
  );
}
