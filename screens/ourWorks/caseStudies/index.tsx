"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Card, CardBody, CardHeader, Chip } from "@nextui-org/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const data = [
  {
    heading: "Xperiti",
    heading1: "Comprehensive Rsearch Platform",
    subtitle:
      "An integrated platform for efficient qualitative & quantitative research management.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1731155233/xperiti_psd_file_1_cvfkqh.svg",
    url: "https://www.xperiti.com/",
  },
  {
    heading: "Legaltech AI SaaS",
    heading1: "APAC’s largest law firm",
    subtitle:
      "AI-powered legal platform to streamline document analysis, automate drafting, and support legal professionals.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444013/lega_n7vqzw.svg",
    url: "https://www.xperiti.com/",
  },
  {
    heading: "ION",
    heading1: "AI Trading Platform",
    subtitle:
      "Order fulfilment SaaS platform designed to streamline medical supply chain operations",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444002/ion_xce6b5.svg",
    url: "https://arthalpha.in/",
  },

  {
    heading: "Brahmastra",
    heading1: "Diamond Ring Studio",
    subtitle:
      "A trading platform with real-time data, advanced charting, and customizable strategies to enhance trading efficiency.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443918/brahma_jvnmc9.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "Rings & I",
    heading1: "Diamond Ring Studio",
    subtitle:
      "A Shopify-powered e-commerce site for custom ring design and sales.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025333/rings_gnmm1x.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "FrytX",
    heading1: "Diamond Ring Studio",
    subtitle:
      "An all-in-one platform for business operations, customer service, verification, and financial management.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025188/frytx_mo0frx.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "Test Dynamiz",
    heading1: "Diamond Ring Studio",
    subtitle:
      "An automated software testing SaaS for efficient, high-quality releases.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444003/test_oxuysl.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "SimpleO",
    heading1: "Diamond Ring Studio",
    subtitle:
      "An AI-powered legal management system for streamlined contracts and compliance.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443926/simplo_dnrjzi.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "StayPe",
    heading1: "Diamond Ring Studio",
    subtitle:
      "A streamlined app for finding, securing, and managing rental properties throughout the entire rental lifecycle.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444021/staype_o0y07w.svg",
    url: "https://ringsandi.com/",
  },
  {
    heading: "Infinity AquaSol",
    heading1: "Diamond Ring Studio",
    subtitle:
      "A website highlighting cutting-edge water treatment and environmental solutions.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444012/infinity_aqvvse.svg",
    url: "https://ringsandi.com/",
  },

  {
    heading: "Cloud Shift",
    heading1: "Diamond Ring Studio",
    subtitle:
      "A specialized cloud migration platform to guide and support businesses transitioning to cloud infrastructure.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761444015/cloud_wawxjj.svg",
    url: "https://ringsandi.com/",
  },

  {
    heading: "StayRealtor",
    heading1: "Diamond Ring Studio",
    subtitle:
      "A property management app to optimize landlord and broker operations and improve tenant relations.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443928/stayrelater_vbxkvv.svg",
    url: "https://ringsandi.com/",
  },

  {
    heading: "OLSO",
    heading1: "Diamond Ring Studio",
    subtitle:
      "A peer-to-peer platform for local product borrowing and sharing.",
    img: "https://res.cloudinary.com/damm9iwho/image/upload/v1761443916/olso_ldpdnw.svg",
    url: "https://ringsandi.com/",
  },
  // {
  //   heading: "AMUZN",
  //   heading1: "Diamond Ring Studio",
  //   subtitle:
  //     "A peer-to-peer platform for local product borrowing and sharing.",
  //   img: "https://res.cloudinary.com/damm9iwho/image/upload/v1730025333/rings_gnmm1x.svg",
  //   url: "https://ringsandi.com/",
  // },
];

const CaseStudyCard = () => {
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
    <div className="min-h-screen pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="mb-6 flex flex-row items-center justify-center">
          <span className="rounded-xl border-2 border-cyan-400 bg-[#8EF1F1] px-4 py-2 font-semibold uppercase">
            Featured Case Studies
          </span>
        </div>
        <p className="heading-center">What happens behind the scenes</p>
      </div>

      <div
        // ref={(el) => {
        //   if (el && !isMobile) cardsRef.current[3] = el;
        // }}
        className="grid grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-4 max-md:gap-2"
      >
        {data.map((item, index) => {
          return (
            <Card className="rounded-[40px] max-md:rounded-[30px]  bg-[#e9e9e9]  max-md:mt-4 shadow-none border-1 border-[#0000000f]">
              <CardBody className="p-1.5 max-md:p-1.5">
                <Card className="rounded-[30px] max-md:rounded-[20px] box-shadow h-full">
                  <CardHeader className="px-0 pt-0">
                    <div className=" w-full">
                      {item.img && (
                        <img
                          src={item.img}
                          alt="behance Logo"
                          className="w-full h-[250px] object-cover"
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardBody className="p-6 max-md:p-6 max-lg:p-6 pt-0">
                    <p className="text-2xl max-md:text-xl mt-0 mb-3 font-[700] pr-12 max-md:pr-4 tracking-[-0.5px] leading-[41.6px]">
                      {item.heading}
                    </p>
                    <p className="text-base max-md:text-base mb-6 font-[500] leading-[25.2px] text-[#777777]">
                      {item.subtitle}
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

export default CaseStudyCard;
