"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import { getGradientById } from "@/utils/gradientService";

const data = [
  {
    gradientId: 1, // Pink Blush
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760610137/rocket_pk7ci5.svg",
    data: [
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Research & Community Insights",
        description:
          "Crowdsourced opinions, Reddit research, and user behavior analysis.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Frontend Development & Code",
        description:
          "React, JS, CSS tips, dev workflows, and code optimization.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Graphic Design & Print",
        description:
          "Posters, brochures, print assets, and cross-media brand consistency.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "UX Mistakes & Misconceptions",
        description:
          "Debunking bad practices, myths, and misunderstood design “rules.”",
      },
    ],
  },
  {
    gradientId: 2, // Lime Fresh
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760610137/reserch_hl7lpt.svg",
    data: [
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "UX & Product Design",
        description:
          "Principles, best practices, and strategies for intuitive digital products.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Design Systems & Components",
        description:
          "Scalable design tokens, UI kits, and cross-team consistency tips.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Motion Graphics & Video Editing",
        description:
          "Animations, transitions, editing workflows, and video-based engagement.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Consultation & Strategy",
        description:
          "Product audits, growth planning, and actionable expert advice.",
      },
    ],
  },
  {
    gradientId: 3, // Cyan Sky
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760610137/design_loqtac.svg",
    data: [
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "UI Design & Visual Trends",
        description:
          "Interface patterns, style explorations, and modern design aesthetics.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Branding & Storytelling",
        description:
          "Identity building, narrative-driven design, and brand strategy.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "3D Animation & Rendering",
        description: "Modeling, rendering, and cinematic visual techniques.",
      },
      {
        image:
          "https://res.cloudinary.com/damm9iwho/image/upload/v1760506407/motionicon_uwwkm4.svg",
        heading: "Career Growth & Industry Insights",
        description:
          "Freelance tips, agency life, and staying ahead in design & dev careers.",
      },
    ],
  },
];

const LookingFor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true to trigger animations
    setMounted(true);

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const imageVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="mt-16">
      <p className="heading-center mb-6">Find What You’re Looking For</p>

      {/* ✅ Equal height fix: grid with items-stretch */}
      <div className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-6 max-md:gap-4 items-stretch">
        {mounted &&
          data.map((itemMain, colIndex) => {
            const itemsToShow = isMobile ? [itemMain.data[0]] : itemMain.data;

            return (
              <div key={colIndex} className="flex flex-col gap-6 h-full">
                {itemsToShow.map((item, rowIndex) => (
                  <motion.div
                    key={rowIndex}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    custom={rowIndex + colIndex * 0.2}
                    className="flex h-full"
                  >
                    <Card
                      className="rounded-[32px] max-md:rounded-[24px] bg-white shadow-none border border-[#0000000f] flex flex-col h-full"
                      style={{
                        boxShadow: "0px 3px 7px 3px rgba(0, 0, 0, 0.09)",
                      }}
                    >
                      <CardBody className="p-1.5 flex flex-col h-full">
                        <Card
                          className="rounded-[28px] max-md:rounded-[18px] flex flex-col flex-grow overflow-hidden"
                          style={{
                            background: getGradientById(itemMain.gradientId)
                              ?.value,
                          }}
                        >
                          <CardBody className="p-7 max-md:p-5 max-lg:p-6 flex flex-col justify-between h-full">
                            <motion.div
                              variants={imageVariants}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0.4 }}
                            />
                            <div className="flex flex-col flex-grow justify-between">
                              <p className="text-xl max-md:text-base font-[700]">
                                {item.heading}
                              </p>
                              <p className="text-base max-md:text-base font-[500] py-2 text-[#555] flex-grow">
                                {item.description}
                              </p>
                            </div>
                          </CardBody>
                        </Card>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LookingFor;
