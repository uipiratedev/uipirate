"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks";

const data = [
  {
    heading: "9+",
    subHeading: "From MVPs to complex dashboards, shipped across 6 countries",
    subtitle1: "Years of",
    subtitle2: "Experience",
    hoverBg: "#FF5B04",
    textHover: "#fff",
    img: "/assets/img/cal.svg",
  },
  {
    heading: "50+",
    subHeading:
      "Including AI tools, HR platforms, fintech apps, and B2B SaaS products",
    subtitle1: "projects",
    subtitle2: "completed",
    hoverBg: "#00C17A",
    textHover: "#fff",
    img: "/assets/img/box.svg",
  },
  {
    heading: "$150M+",
    subHeading:
      "SaaS, EdTech, FinTech, HealthTech, LegalTech, Creator Economy, and more",
    subtitle1: "Made by",
    subtitle2: "our clients",
    hoverBg: "#008DE4",
    textHover: "#fff",
    img: "/assets/img/badge.svg",
  },
  {
    heading: "6",
    subHeading: "Built for scale, speed, and seamless handoff to developers",
    subtitle1: " Client",
    subtitle2: "Locations",
    subtitle3: "Worldwide",
    hoverBg: "#E40063",
    textHover: "#fff",
    img: "/assets/img/location.svg",
  },
];

interface AboutCardItemProps {
  item: (typeof data)[0];
  index: number;
  hoveredIndex: number | null;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  isMobile: boolean;
}

const AboutCardItem = ({
  item,
  index,
  hoveredIndex,
  onHoverStart,
  onHoverEnd,
  isMobile,
}: AboutCardItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;
  const isHovered = hoveredIndex === index;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: isMobile ? ["start 160%", "end 120%"] : ["start 99%", "end 100%"],
  });

  // Transform scroll progress to animation values
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [isEven ? "-30%" : "30%", "0%"]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [isEven ? -15 : 15, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    [isMobile ? 0 : 0.2, 1]
  );

  return (
    <motion.div
      ref={cardRef}
      className={`bg-[#ffffff] shadow-lg border-1 rounded-[40px] max-md:rounded-[20px] p-8 max-md:px-6 w-full h-[350px] max-md:h-[250px] ${
        isEven ? "lg:-mt-32" : "lg:mt-0"
      } hover:ease-in-out`}
      style={{
        x,
        rotate,
        opacity,
        backgroundColor: isHovered ? item.hoverBg : "#ffffff",
        color: isHovered ? item.textHover : "#000",
        transition: "background-color 0.6s ease, color 0.6s ease",
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-8xl max-md:text-6xl overflow-hidden font-[500] max-md:font-[500]">
            {item.heading.split("").map((letter, i) => (
              <motion.span
                key={`${index}-${i}`}
                className="inline-block"
                style={{
                  color: isHovered ? item.textHover : "#FF5B04",
                }}
                initial={{ y: 0 }}
                animate={isHovered ? { y: [0, -10, 0] } : { y: 0 }}
                transition={{
                  delay: i * 0.03,
                  duration: 0.4,
                  ease: [0.33, 1, 0.68, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </p>
        </div>
        <div className="flex flex-row items-end justify-between">
          <p className="text-3xl max-md:text-2xl font-semibold uppercase font-jetbrains-mono">
            {item.subtitle1}
            <br />
            {item.subtitle2}
            <br/>
            {item.subtitle3 && item.subtitle3}
          </p>
          {item.img && (
            <img
              alt={`${item.subtitle1} ${item.subtitle2}`}
              className="h-32 max-md:h-16 object-contain"
              src={item.img}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AboutCardAnimation = () => {
  const isMobile = useIsMobile();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 pb-20 max-md:pb-12 max-md:pt-12 ">
      <div className="grid grid-cols-2 gap-6 max-md:gap-4 lg:mt-48 max-lg:grid-cols-1">
        {data.map((item, index) => (
          <AboutCardItem
            key={index}
            item={item}
            index={index}
            hoveredIndex={hoveredIndex}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutCardAnimation;
