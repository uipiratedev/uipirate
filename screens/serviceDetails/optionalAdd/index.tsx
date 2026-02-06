"use client";

import { memo } from "react";
import Image from "next/image";
import GlassBadge from "@/components/GlassBadge";

interface OptionalAddCard {
  heading: string;
}

interface OptionalAddData {
  badge: string;
  heading: string;
  card: OptionalAddCard[];
  rightImg: string;
}

interface OptionalAddProps {
  data: OptionalAddData;
}

const OptionalAdd = memo<OptionalAddProps>(function OptionalAdd({ data }) {
  return (
    <div className="pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="flex items-center justify-center mb-6">
          <GlassBadge variant="gradient">{data.badge}</GlassBadge>
        </div>
        <p className="heading-center">{data.heading}</p>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 items-center">
        {/* Left Section */}
        <div className="flex flex-col gap-5 text-lg max-md:text-base max-md:py-6">
          {data.card.map((item, index) => (
            <p key={index} className="text-xl font-medium">
              {item.heading}
            </p>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex justify-end items-center">
          <div className="flex justify-center items-center relative w-[300px] h-[400px]">
            <Image
              alt={data.badge}
              fill
              className="object-contain"
              src={data.rightImg}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default OptionalAdd;
