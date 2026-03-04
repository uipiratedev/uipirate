"use client";
import React, { useRef } from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { motion } from "framer-motion";

import data from "@/data/servicesTopList.json";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useFramerScrollAnimation } from "@/hooks/useFramerScrollAnimation";
import { useVideoIntersection } from "@/hooks/useVideoIntersection";
import { AnimatedButton } from "@/components/AnimatedButton";

const data1 = [
  {
    heading: "3D Animation & Rendering",
    description: "Create immersive visuals that stand out.",
    chip: [
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
        title: "1–4 weeks",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/DeviceMobile_rfsexm.svg",
        title: "3D rendering",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Code_qedbxu.svg",
        title: "3D motion graphics",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/ShoppingCart_pirfab.svg",
        title: "Modeling & Animation",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Sparkle_qf0yru.svg",
        title: "Development-ready exports",
      },
    ],

    video: (
      <video
        // ref={(elvideo) => {
        //   if (elvideo) videoRefs.current[index] = elvideo;
        // }}
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-[100%]"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
        width="100%"
      />
    ),
    isImage: false,
    ctaText: "Explore 3D Animation",
  },
  {
    heading: "UX Audits & Consultation",
    description: "Fix user friction before it becomes churn.",
    chip: [
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
        title: "Usability analysis",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/DeviceMobile_rfsexm.svg",
        title: "Heuristic Evaluation",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Code_qedbxu.svg",
        title: "UX  Report",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730801507/ShoppingCart_pirfab.svg",
        title: "Wireframe suggestions",
      },
      {
        icon: "https://res.cloudinary.com/damm9iwho/image/upload/v1730799888/Sparkle_qf0yru.svg",
        title: "Design improvement plan",
      },
    ],
    image:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1730808993/image_39_e9ciky.svg",
    video: (
      <video
        // ref={(elvideo) => {
        //   if (elvideo) videoRefs.current[index] = elvideo;
        // }}
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-full"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
        width="100%"
      />
    ),
    isImage: true,
    ctaText: "Explore UX Audits",
  },
  // Add more data as needed...
];

const ServicesCard = () => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isMobile = useIsMobile();

  // Get Framer Motion animation props
  const scrollAnimationProps = useFramerScrollAnimation(isMobile);

  // Use video intersection hook
  useVideoIntersection(videoRefs);

  return (
    <div className="min-h-screen ">
      <div className="grid grid-cols-2 gap-4 max-md:gap-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            // className={
            //   index === 0
            //     ? "col-span-2"
            //     : "grid-cols-2 md:col-span-1 max-md:col-span-2"
            // } // first item full width
            className="gric-cols-2"
            {...(isMobile ? {} : scrollAnimationProps)}
          >
            <Card className="rounded-[48px] max-md:rounded-[38px] md:mt-12 bg-[#e9e9e9] max-md:mt-4 group shadow-none border-1 border-[#0000000f]">
              <CardBody className="p-4 max-md:p-2 max-md:gap-2">
                <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow">
                  <CardHeader className="px-0 pt-0">
                    {item.isImage ? (
                      <img
                        alt="behance Logo"
                        className="object-cover h-[350px] min-md:h-[350px] max-h-full"
                        src={item.sideImage}
                        width="100%"
                      />
                    ) : (
                      <video
                        ref={(elvideo) => {
                          if (elvideo) videoRefs.current[index] = elvideo;
                        }}
                        loop
                        muted
                        className="object-cover h-[350px] min-md:h-[350px] max-h-full"
                        src={item.video}
                        width="100%"
                      />
                    )}
                  </CardHeader>
                  <CardBody className="p-8 max-md:p-5 max-lg:p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-3xl max-md:text-3xl mt-4 mb-4 font-[700] tracking-[-0.5px] leading-[41.6px]">
                        {item.heading}
                      </p>
                      <p className="text-lg max-md:text-base font-[500]">
                        {item.subheading}
                      </p>
                      <p className="text-base max-md:text-base font-[500] text-[#777777] py-2">
                        {item.description}
                      </p>
                      <p className="text-lg max-md:text-base font-[500]">
                        {item.subheading2}
                      </p>
                    </div>

                    <div className="mt-6 grid-rows-3 w-full gap-4 max-md:gap-x-3">
                      {item.chip.map((chipItem, chipIndex) => (
                        <Chip
                          key={chipIndex}
                          className="md:m-2 mr-2 max-md:mb-2 text-[14px] text-[#00000094] bg-[#51525E14]"
                          radius="sm"
                          startContent={
                            <img
                              alt={chipItem.title}
                              className="mx-1 w-[16px]"
                              src={chipItem.icon}
                            />
                          }
                        >
                          <p className="font-[600] max-md:font-[500]">
                            {chipItem.title}
                          </p>
                        </Chip>
                      ))}
                    </div>
                    <AnimatedButton
                      href={`/services/${item.heading.replace(/\s+/g, "-")}`}
                      primaryText={item.ctaText}
                    />
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="grid grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-2"
        {...(isMobile ? {} : scrollAnimationProps)}
      >
        {data1.map((item, index) => {
          return (
            <Card
              key={index}
              className="rounded-[48px] mb-12 bg-[#e9e9e9]  mt-12 max-md:mt-4 shadow-none border-1 border-[#0000000f]"
            >
              <CardBody className="p-4 max-md:p-2">
                <Card className="rounded-[40px] box-shadow">
                  <CardHeader className="px-0 pt-0">
                    <div className=" w-full">
                      {item.isImage && (
                        <img
                          alt="behance Logo"
                          className="w-full h-[250px] object-cover"
                          src={item.image}
                        />
                      )}
                      {!item.isImage && item.video}
                    </div>
                  </CardHeader>
                  <CardBody className="p-8 max-md:p-6 max-lg:p-6">
                    <p className="text-3xl max-md:text-3xl mt-0 mb-4 font-[700] pr-12 max-md:pr-4 tracking-[-0.5px] leading-[41.6px]">
                      {item.heading}
                    </p>
                    <p className="text-lg max-md:text-base mb-6 font-[500] leading-[25.2px]">
                      {item.description}
                    </p>

                    <div className="mb-6 grid-rows-3 w-full gap-4 max-md:gap-x-3">
                      {item.chip.map((chipItem, chipIndex) => (
                        <Chip
                          key={chipIndex}
                          className="md:m-2 mr-2 max-md:mb-2 text-[14px] text-[00000094] bg-[#51525E14]"
                          radius="sm"
                          startContent={
                            <img
                              alt={chipItem.title}
                              className="mx-1 w-[16px]"
                              src={chipItem.icon}
                            />
                          }
                        >
                          <p className="font-[600] max-md:font-[500]">
                            {chipItem.title}
                          </p>
                        </Chip>
                      ))}
                    </div>
                    <AnimatedButton
                      href={`/services/${item.heading.replace(/\s+/g, "-")}`}
                      primaryText={item.ctaText}
                    />
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          );
        })}
      </motion.div>
    </div>
  );
};

export default ServicesCard;
