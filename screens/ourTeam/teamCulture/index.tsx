"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const data1 = [
  {
    heading: "Async & Autonomous",
    description:
      "We respect time zones, deadlines, and your calendar. No micromanagement, just trust and output.",

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
  },
  {
    heading: "Tools That Flow",
    description:
      "Figma, Photoshop, Git, plus a solid dev stack: React, JavaScript, CSS, Tailwind. We keep things fast and clean, front to back.",

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
  },
  {
    heading: "No Fluff, Just Work",
    description:
      "Forget bloated decks and performative meetings. We bring sharp feedback, strong opinions, and clean execution.",

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
  },
  // Add more data as needed...
];

const TeamCulture = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMobile, setIsMobile] = React.useState(false);

  useLayoutEffect(() => {
    // Set initial value
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768);
    }
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
          },
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
            (video) => video === entry.target,
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
      { threshold: 0.5 }, // Trigger when at least 10% of the video is in view
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
    <div className="min-h-screen pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="mb-6 flex flex-row items-center justify-center">
          <span className="rounded-xl border-2 border-cyan-400 bg-[#8EF1F1] px-4 py-2 font-semibold uppercase">
            Team Culture
          </span>
        </div>
        <p className="heading-center">How We Work</p>
      </div>

      <div
        ref={(el) => {
          if (el && !isMobile) cardsRef.current[3] = el;
        }}
        className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-2"
      >
        {data1.map((item, index) => {
          return (
            <Card
              key={index}
              className="rounded-[48px] mb-12 bg-[#e9e9e9]  mt-12 max-md:mt-4 shadow-none border-1 border-[#0000000f]"
            >
              <CardBody className="p-2 max-md:p-2">
                <Card className="rounded-[40px] box-shadow h-full">
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
                    <p className="text-2xl max-md:text-xl mt-0 mb-4 font-[700] pr-12 max-md:pr-4 tracking-[-0.5px] leading-[41.6px]">
                      {item.heading}
                    </p>
                    <p className="text-base max-md:text-base mb-6 font-[500] leading-[25.2px]">
                      {item.description}
                    </p>
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

export default TeamCulture;
