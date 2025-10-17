"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import testimonials from "@/data/testimonials.json";
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
        <div key={index} className="w-[14px] h-[14px] relative">
          <img
            src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
            alt="5 star rating"
            className="w-[14px] h-[14px] transition-transform duration-300 hover:scale-110 absolute top-0 left-0"
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
const OptionalAdd = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simple automatic carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <div className=" pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            What we provide
          </span>
        </div>
        <p className="heading-center">Why Work With UiPirate?</p>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 items-center">
        {/* Left Section */}
        <div className="flex flex-col gap-3 text-lg max-md:text-base space-y-2 pt-12 max-md:py-6">
          <p className="text-lg font-semibold">
            🏆 50+ successful projects delivered
          </p>
          <p className="text-lg font-semibold">
            🌍 Clients across 6+ countries
          </p>
          <p className="text-lg font-semibold">
            💬 Direct access to your design/dev team
          </p>
          <p className="text-lg font-semibold">
            📈 Design that scales with your product
          </p>
        </div>

        {/* Right Section (Carousel) */}

        <div className=" flex justify-end items-center">
          <div className="flex justify-center max-md:justify-center items-center relative w-[300px] h-[400px] min-h-[400px]">
            <img
              src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1760686353/Web_Template_bwbaey.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionalAdd;
