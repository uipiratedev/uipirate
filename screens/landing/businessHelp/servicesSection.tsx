import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NextLink from "next/link";

import data from "@/data/servicesTopList.json";
gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  useLayoutEffect(() => {
    // GSAP ScrollTrigger animation for cards

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    cardsRef.current.forEach((card) => {
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
                videoElement.play();
                videoElement.playbackRate = 0.5; // Adjust speed when in view
              } else {
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
    <div className="min-h-screen">
      <div
      // ref={(el) => {
      //   if (el && !isMobile) cardsRef.current[3] = el;
      // }}
      >
        <Card className="rounded-[48px] max-md:rounded-[38px] mb-12 bg-[#e9e9e9]  mt-12 max-md:mt-4 shadow-none border-1 border-[#0000000f]">
          <CardBody className="grid grid-cols-3 gap-4 max-md:gap-4 max-xl:grid-cols-1 p-3 max-md:p-2">
            {data.slice(0, 3).map((item, index) => {
              return (
                <Card
                  key={index}
                  className="rounded-[40px] max-md:rounded-[30px]  box-shadow"
                  // style={{ boxShadow: " inset 0 2px 4px rgba(0, 0, 0, 0.1)" }}
                >
                  <CardHeader className="px-0 pt-0 z-0">
                    <div className=" w-full">
                      {item.isImage && (
                        <img
                          alt="behance Logo"
                          className="w-full object-cover  h-[250px]"
                          src={item.sideImage}
                        />
                      )}
                      {!item.isImage && (
                        <video
                          ref={(elvideo) => {
                            if (elvideo) videoRefs.current[index] = elvideo;
                          }}
                          autoPlay
                          loop
                          muted
                          className="object-cover h-[250px] min-md:h-[250px] max-h-full"
                          src={item.video}
                          width="100%"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardBody className="p-6 max-md:p-4 max-lg:p-6 pt-0">
                    <div>
                      <p className="text-2xl max-md:text-xl mt-4 mb-4 font-[700] tracking-[-0.5px] leading-[31.6px] pr-12">
                        {item.heading}
                      </p>
                      <p className="text-base max-md:text-base font-[500]">
                        {item.subheading}
                      </p>
                      <p className="text-base max-md:text-base font-[500] text-[#777777] py-2">
                        {item.description}
                      </p>
                      <p className="text-base max-md:text-base font-[500]">
                        {item.subheading2}
                      </p>
                    </div>
                    <div className="mb-6 mt-3 flex flex-wrap gap-2 max-md:gap-2 w-full">
                      {item.chip.map((chipItem, chipIndex) => (
                        <Chip
                          key={chipIndex}
                          className="text-[12px] text-[#00000094] bg-[#51525E14] flex items-center gap-2"
                          radius="sm"
                          startContent={
                            <img
                              alt={chipItem.title}
                              className="mx-1 w-[16px]"
                              src={chipItem.icon}
                            />
                          }
                        >
                          <p className="font-[600] max-md:font-[500] text-xs">
                            {chipItem.title}
                          </p>
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
            <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow col-span-3 max-md:col-span-1 bg-white/50">
              <CardBody className="p-4 max-md:p-4 max-lg:p-4 px-0">
                <div className="w-full text-center">
                  <p className="text-3xl max-md:text-2xl mt-4 mb-4 font-semibold ">
                    Need something custom !
                  </p>

                  <div
                    className="mb-4  mt-6 flex flex-row items-center justify-center max-lg:flex-col w-full max-md:flex-col max-md:px-2 button-spring-animate relative"
                    style={{ overflow: "visible" }}
                  >
                    <a
                      className="w-[250px] max-lg:mt-3 lg:ml-3"
                      href="https://wa.me/919708636151"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="border-1 border-[#E2E2E2]  bg-black text-white rounded-[16px] h-auto transform transition-all duration-[600ms] ease-in-out px-3 py-3 flex flex-row items-center justify-center gap-3 relative">
                        <p className="text-base max-md:text-sm font-semibold text-center">
                          😀 Let’s Talk
                        </p>
                      </div>
                    </a>

                    <NextLink
                      className="w-[300px] max-md:w-[250px] max-lg:mt-3 lg:ml-3"
                      href="/services"
                    >
                      <Button
                        className="border-1 max-md:hidden border-[#E2E2E2] text-black font-bold w-full bg-white rounded-[16px] py-[25px]"
                        color="primary"
                        variant="bordered"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-base max-md:text-sm font-semibold text-center">
                            View All Services
                          </p>
                        </div>
                      </Button>
                      <Button
                        as="a"
                        className="bg-white md:hidden text-black rounded-[16px] px-8 py-6 font-bold text-base w-full md:w-auto border-3 border-[#E2E2E2] "
                        color="primary"
                        variant="bordered"
                      >
                        View All Services
                      </Button>
                    </NextLink>
                  </div>
                </div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ServicesSection;
