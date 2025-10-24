"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/servicesTopList.json";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

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
        width="100%"
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-[100%]"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
      ></video>
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
        width="100%"
        autoPlay
        loop
        muted
        className="object-cover h-[250px] w-full"
        src="https://res.cloudinary.com/damm9iwho/video/upload/v1730895565/3D_qasvie.mp4"
      ></video>
    ),
    isImage: true,
    ctaText: "Explore UX Audits",
  },
  // Add more data as needed...
];

const ServicesCard = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMobile, setIsMobile] = React.useState(false);

  useLayoutEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useLayoutEffect(() => {
    // GSAP ScrollTrigger animation for cards

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            y: 100, // Start from below
            transform: isMobile ? "scale(1)" : "scale(0.80)",
          },
          {
            y: 0, // Move to original position
            transform: "scale(1)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: isMobile ? "" : "top 110%",
              end: isMobile ? "" : "bottom center",
              toggleActions: "play none none reverse",
              scrub: 1.5,
            },
          }
        );
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Find the index of the observed element in videoRefs
          const index = videoRefs.current.findIndex(
            (video) => video === entry.target
          );

          if (index !== -1) {
            // Check if the index is valid
            const videoElement = videoRefs.current[index];
            if (videoElement) {
              // Ensure the video element is valid
              if (entry.isIntersecting) {
                // console.log(`Video ${index + 1} started playing.`);
                videoElement.play();
                videoElement.playbackRate = 0.5; // Adjust speed when in view
              } else {
                // console.log(`Video ${index + 1} paused.`);
                videoElement.pause();
                videoElement.playbackRate = 1; // Reset speed when out of view
              }
            }
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 10% of the video is in view
    );

    // Observing all video elements
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video); // Ensure video is not null before observing
    });

    return () => {
      observer.disconnect(); // Cleanup observer on unmount
    };
  }, []);

  return (
    <div className="min-h-screen ">
      <div className="grid grid-cols-2 gap-4 max-md:gap-2">
        {data.map((item, index) => (
          <div
            ref={(el) => {
              if (el && !isMobile) cardsRef.current[index] = el;
            }}
            key={index}
            // className={
            //   index === 0
            //     ? "col-span-2"
            //     : "grid-cols-2 md:col-span-1 max-md:col-span-2"
            // } // first item full width
            className="gric-cols-2"
          >
            <Card className="rounded-[48px] max-md:rounded-[38px] md:mt-12 bg-[#e9e9e9] max-md:mt-4 group shadow-none border-1 border-[#0000000f]">
              <CardBody className="p-4 max-md:p-2 max-md:gap-2">
                <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow">
                  <CardHeader className="px-0 pt-0">
                    {item.isImage ? (
                      <img
                        src={item.sideImage}
                        alt="behance Logo"
                        width="100%"
                        className="object-cover h-[350px] min-md:h-[350px] max-h-full"
                      />
                    ) : (
                      <video
                        ref={(elvideo) => {
                          if (elvideo) videoRefs.current[index] = elvideo;
                        }}
                        width="100%"
                        loop
                        muted
                        className="object-cover h-[350px] min-md:h-[350px] max-h-full"
                        src={item.video}
                      ></video>
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
                          radius="sm"
                          className="md:m-2 mr-2 max-md:mb-2 text-[14px] text-[#00000094] bg-[#51525E14]"
                          startContent={
                            <img
                              src={chipItem.icon}
                              className="mx-1 w-[16px]"
                            />
                          }
                        >
                          <p className="font-[600] max-md:font-[500]">
                            {chipItem.title}
                          </p>
                        </Chip>
                      ))}
                    </div>
                    <Link
                      href={`/services/${item.heading.replace(/\s+/g, "-")}`}
                    >
                      <button
                        color="primary"
                        className="mt-6 bg-black text-white  px-[40px]  py-[16px] rounded-[20px] group w-full"
                        style={{ width: "100%" }}
                      >
                        <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
                          <span
                            className={`text-white text-lg transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 
                                
                                 group-hover:translate-y-[50px] translate-y-3
                                
                               `}
                          >
                            {item.ctaText}
                          </span>

                          <span
                            className={`text-white text-lg  transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3
                                
                                translate-y-[50px] group-hover:-translate-y-3
                                
                               
                              
                              
                              `}
                          >
                            See More
                          </span>
                        </div>
                      </button>
                    </Link>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>

      <div
        ref={(el) => {
          if (el && !isMobile) cardsRef.current[3] = el;
        }}
        className="grid grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-2"
      >
        {data1.map((item, index) => {
          return (
            <Card className="rounded-[48px] mb-12 bg-[#e9e9e9]  mt-12 max-md:mt-4 shadow-none border-1 border-[#0000000f]">
              <CardBody className="p-4 max-md:p-2">
                <Card className="rounded-[40px] box-shadow">
                  <CardHeader className="px-0 pt-0">
                    <div className=" w-full">
                      {item.isImage && (
                        <img
                          src={item.image}
                          alt="behance Logo"
                          className="w-full h-[250px] object-cover"
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
                          radius="sm"
                          className="md:m-2 mr-2 max-md:mb-2 text-[14px] text-[#00000094] bg-[#51525E14]"
                          startContent={
                            <img
                              src={chipItem.icon}
                              className="mx-1 w-[16px]"
                            />
                          }
                        >
                          <p className="font-[600] max-md:font-[500]">
                            {chipItem.title}
                          </p>
                        </Chip>
                      ))}
                    </div>

                    <Link
                      href={`/services/${item.heading.replace(/\s+/g, "-")}`}
                    >
                      <button
                        color="primary"
                        className="mt-6 bg-black text-white  px-[40px]  py-[16px] rounded-[20px] group w-full"
                        style={{ width: "100%" }}
                      >
                        <div className="flex flex-col items-center justify-center max-h-[24px] overflow-hidden">
                          <span
                            className={`text-white text-lg transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 
                                
                                 group-hover:translate-y-[50px] translate-y-3
                                
                               `}
                          >
                            {item.ctaText}
                          </span>

                          <span
                            className={`text-white text-lg  transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3
                                
                                translate-y-[50px] group-hover:-translate-y-3
                                
                               
                              
                              
                              `}
                          >
                            See More
                          </span>
                        </div>
                      </button>
                    </Link>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesCard;
