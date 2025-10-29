"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import testimonials from "@/data/testimonials.json";
import { Avatar } from "./Avatar";

const StarRating = ({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <div
      className={`flex flex-row gap-1 h-[14px] ${className}`}
      style={{ overflow: "visible" }}
    >
      {[...Array(5)].map((_, index) => (
        <div key={index} className="relative h-[14px] w-[14px]">
          <img
            src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
            alt="5 star rating"
            className="absolute left-0 top-0 h-[14px] w-[14px] transition-transform duration-300 hover:scale-110"
            style={{
              animation: `starSlideUp 0.5s ease-out forwards`,
              animationDelay: `${delay / 1000 + index * 0.12}s`,
              opacity: 0,
              transform: "translateY(40px)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const WhatWeProvideGlobal = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simple automatic carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="mb-6 flex flex-row items-center justify-center">
          <span className="rounded-xl border-2 border-cyan-400 bg-[#8EF1F1] px-4 py-2 font-semibold uppercase">
            What we provide
          </span>
        </div>
        <p className="heading-center">Why Clients Like Working With Us</p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {/* Left Section */}
        <div className="flex flex-col gap-3 space-y-2 pt-12 text-lg max-md:py-6 max-md:text-base">
          <p className="text-lg font-semibold">
            🕘 Fast turnarounds without compromising detail
          </p>
          <p className="text-lg font-semibold">
            🧠 A design/dev team that actually *understands SaaS*
          </p>
          <p className="text-lg font-semibold">
            🧩 Clean, scalable UI and code they don’t have to redo later
          </p>
          <p className="text-lg font-semibold">
            💬 Clear communication and zero fluff
          </p>
        </div>

        {/* Right Section (Carousel) */}
        <div className="flex items-center justify-end">
          <div className="relative flex h-[400px] min-h-[400px] w-[300px] items-center justify-center max-md:justify-center">
            {testimonials.map((item, index) => {
              const isActive = index === currentIndex;

              return (
                <div
                  key={index}
                  className="absolute left-0 top-0 h-full w-full transition-all duration-700 ease-in-out"
                  style={{
                    transform: isActive ? "scale(1)" : "scale(0.95)",
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  <Card
                    className="relative overflow-hidden"
                    style={{
                      borderRadius: "40px",
                      //   boxShadow: "0px 6px 15px 6px rgba(0, 0, 0, 0.09)",
                      backdropFilter: "blur(10px)",
                      position: "relative",
                    }}
                  >
                    {/* Gradient Border */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "40px",
                        padding: "2px",
                        background:
                          "linear-gradient(90deg, #F7DE04 4.58%, #11C781 27.52%, #05A2FB 48.18%, #5E72E4 72.05%, #F04800 92.7%)",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    />

                    {/* Card Content */}
                    <CardBody
                      className="relative z-0 flex flex-col items-center justify-center gap-4 p-6"
                      style={{
                        borderRadius: "38px",
                        background: "rgba(255,255,255,0.85)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <Avatar
                        name={item.name}
                        avatar={item.profileImage}
                        size={52}
                      />
                      <p className="line-clamp-5 text-center text-base text-gray-700">
                        {item.review}
                      </p>
                      <div className="flex h-[14px] flex-row items-start gap-1">
                        <StarRating delay={300} />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeProvideGlobal;
