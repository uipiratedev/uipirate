"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const data1 = [
  {
    heading: "Vishal Anand",
    designation: "Founder & CEO – UI UX Designer & Developer",
    description:
      "With 9+ years of experience in crafting intuitive SaaS and product interfaces, Vishal leads UiPirate’s vision, execution, and client partnerships. He’s the mind behind the strategy, and the hands behind the Figma and code.",
    avatar:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
    cote: "Known for: “Getting stuff done and making it look 🔥”",
  },
  {
    heading: "Syed Musuddiq",
    designation: "Lead UX Designer",
    description:
      "A creative powerhouse and decision-maker on all things design. Musaddiq has led UX across dozens of SaaS products and interfaces over the last few years at UiPirate.",
    avatar:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
    cote: "Loves football. Designs like a pro, plays like one too.",
  },
  {
    heading: "Danish Ansari",
    designation: "Lead Frontend Developer",
    description:
      "Danish works alongside the design team to bring UIs to life with responsive, high-performance code. With a sharp eye for detail and clean structure, he makes sure every build is rock-solid.",
    avatar:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
    cote: "Writes code so clean, even your future devs will thank him.",
  },
  {
    heading: "Karthik Kumar",
    designation: "Graphic, Motion & 3D Designer",
    description:
      "From scroll-stopping motion to polished branding, Karthik brings life to static visuals. He’s our go-to for 3D renders, animations, and visual consistency across projects.",
    avatar:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
    cote: "Turns pixels into art, and art into motion, with a dash of 3D magic.",
  },
  {
    heading: "Aman Kumar",
    designation: "Video Editor",
    description:
      "The wizard behind our videos, Aman handles everything from color grading and sound design to motion graphics, animations, 3D, and crisp subtitles. His edits don’t just look good, they feel good.",
    avatar:
      "https://res.cloudinary.com/damm9iwho/image/upload/v1730799889/CalendarDots_bqwpcd.svg",
    cote: "Thrives on cinematic detail and smooth transitions, the kind you’ll replay just to admire.",
  },
];

const Teams = () => {
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
    <div className="min-h-screen ">
      <div className="grid gap-4 max-md:gap-2">
        {data1.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el && !isMobile) cardsRef.current[index] = el;
            }}
            className={
              index === 0
                ? "col-span-2"
                : "grid-cols-1 md:col-span-1 max-md:col-span-2"
            } // first item full width
          >
            <Card className="rounded-[48px] max-md:rounded-[38px] md:mt-12 bg-[#e9e9e9] max-md:mt-4 group shadow-none border-1 border-[#0000000f]">
              <CardBody className="p-3 max-md:p-2 max-md:gap-2">
                <Card className="rounded-[40px] max-md:rounded-[30px] box-shadow">
                  <CardHeader className="px-0 pt-0">
                    {item.avatar && (
                      <img
                        alt="behance Logo"
                        className="object-cover h-[350px] min-md:h-[350px] max-h-full"
                        src={item.avatar}
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
                        {item.designation}
                      </p>
                      <p className="text-base max-md:text-base font-[500] text-[#777777] py-2">
                        {item.description}
                      </p>
                      <p className="text-lg max-md:text-base font-[500]">
                        {item.cote}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
