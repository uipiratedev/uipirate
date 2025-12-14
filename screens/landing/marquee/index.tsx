"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register GSAP plugin outside component
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LandingMarquee = () => {
  const headingRef = useRef<HTMLParagraphElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Plugin already registered above

    // Heading animation
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }

    // Staggered logo animations
    if (logosRef.current) {
      const logoElements = logosRef.current.querySelectorAll(".logo-item");

      gsap.fromTo(
        logoElements,
        {
          opacity: 0,
          y: 40,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: logosRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  // Curated selection of premium enterprise client logos
  const premiumLogos = [
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513137/image_1_hxpv8e.svg",
      alt: "Ipsos - Global market research and consulting firm logo",
      link: "https://www.ipsos.com/en/ipsos-acquires-xperiti-strengthen-its-b2b-research-capabilities-global",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586282/logo_qpyrhf.webp",
      alt: "Biotex Medical - Healthcare technology solutions logo",
      link: "https://biotexmedical.com/",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753093876/logo_r097ja.png",
      alt: "Khaitan & Co - APAC's largest leading law firm ",
      link: "https://www.khaitanco.com/",
    },
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Frame_1984078729_meav44.svg",
      alt: "RevUp AI - AI-powered business solutions logo",
      link: "https://revupai.com/",
    },

    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682148/Group-2_uduxpp.svg",
      alt: "Simpleo AI - Artificial intelligence platform logo",
      link: "https://www.simpleo.ai/",
    },
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1730790130/728_x_90_copy_6x_uft7ai.svg",
      alt: "Arth Alpha - Financial technology and investment platform logo",
      link: "https://www.arthalpha.in/",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1764586408/OS-logo_w1dtde.svg",
      alt: "Omnex Systems - Quality management and compliance software logo",
      link: "https://www.omnexsystems.com/",
    },
    {
      url: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760598018/healt_nvmdpw.svg",
      alt: "Awesome Health Club - Fitness and wellness platform logo",
      link: "https://awesomehealthclub.com/",
    },

    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729682150/Rings_I_eyrgog.svg",
      alt: "Rings and I - Jewelry and lifestyle brand logo",
      link: "https://ringsandi.com/",
    },
    {
      url: "https://res.cloudinary.com/damm9iwho/image/upload/v1729513139/image_2_srxkyz.svg",
      alt: "Partner company logo",
      link: "",
    },
  ];

  return (
    <div className="py-6 max-md:py-6 bg-white relative overflow-hidden">
      {/* Subtle grid background - much softer, fades at edges, almost invisible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          opacity: 0.5,
        }}
      />

      <div className="container mx-auto max-md:px-4 flex flex-col items-center justify-center relative z-10">
        {/* Section heading with enhanced styling */}
        <div className="mb-6 max-md:mb-10 text-center max-w-4xl mx-auto px-8">
          <div ref={headingRef}>
            <p className="text-2xl md:text-4xl font-jakarta font-[600] text-brand-orange leading-snug tracking-wide">
              Trusted by Teams
            </p>
            <p className="text-2xl md:text-4xl font-jakarta font-[600] text-black leading-snug tracking-wide mt-1">
              Building the Future of SaaS and AI
            </p>
          </div>
        </div>

        {/* Static logo grid - premium enterprise clients only */}
        <div className="w-full max-w-6xl">
          <div
            ref={logosRef}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center"
          >
            {premiumLogos.map((logo, index) => (
              <a
                key={index}
                href={logo.link || undefined}
                target={logo.link ? "_blank" : undefined}
                rel={logo.link ? "noopener noreferrer" : undefined}
                className={`logo-item group flex items-center justify-center w-full h-full p-6 max-md:p-4 rounded-[18px] transition-all duration-500 ease-out relative overflow-hidden ${
                  logo.link
                    ? "cursor-pointer hover:brightness-105"
                    : "cursor-default"
                }`}
                style={{
                  background:
                    "linear-gradient(142deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.55) 100%)",
                  backdropFilter: "blur(32px) saturate(120%) brightness(100%)",
                  WebkitBackdropFilter:
                    "blur(32px) saturate(120%) brightness(100%)",
                  border: "2px solid rgba(255, 255, 255, 0.12)",
                  boxShadow:
                    "0 4px 16px 0 rgba(31, 38, 135, 0.08), inset 1px 1px 2px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.05)",
                }}
                onMouseEnter={(e) => {
                  const border =
                    e.currentTarget.querySelector(".gradient-border");
                  if (border) {
                    gsap.to(border, {
                      opacity: 1,
                      duration: 0.5,
                      ease: "power2.out",
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  const border =
                    e.currentTarget.querySelector(".gradient-border");
                  if (border) {
                    gsap.to(border, {
                      opacity: 0,
                      duration: 0.5,
                      ease: "power2.out",
                    });
                  }
                }}
              >
                {/* Gradient Border - appears on hover */}
                <div
                  className="gradient-border"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0.75rem",
                    padding: "2px",
                    background:
                      "linear-gradient(90deg, #F7DE04 4.58%, #11C781 27.52%, #05A2FB 48.18%, #5E72E4 72.05%, #F04800 92.7%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                    opacity: 0,
                    zIndex: 1,
                  }}
                />

                <img
                  src={logo.url}
                  alt={logo.alt}
                  className="h-[40px] max-h-[40px] max-md:h-[32px] max-md:max-h-[32px] w-auto object-contain  transition-all duration-500 ease-out group-hover:scale-110 relative z-10"
                  loading="lazy"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.1,
                      duration: 0.4,
                      ease: "power2.out",
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      duration: 0.4,
                      ease: "power2.out",
                    });
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .logo-item,
          .logo-item img,
          .gradient-border {
            transition: none !important;
            animation: none !important;
          }
        }

        .logo-item {
          position: relative;
        }

        .logo-item::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.75rem;
          background: linear-gradient(
            135deg,
            rgba(142, 241, 241, 0.1),
            rgba(96, 165, 250, 0.1)
          );
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 0;
        }

        .logo-item:hover::before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default LandingMarquee;
