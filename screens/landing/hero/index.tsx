"use client";
import { Button } from "@heroui/button";
import { useState, useRef } from "react";
import { Tooltip } from "@heroui/react";
import Link from "next/link";
import AnimatedHeadline from "./AnimatedHeadline";
import GlassBadgeExamples from "@/components/GlassBadge.example";
import GlassSurface from "@/components/GlassSurface";

const LandingHero = () => {
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);

  // Create refs for each avatar (for z-index management)
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Testimonial data
  const testimonials = [
    {
      quote: "brought our complex AI trading vision to life",
      name: "Rohit Kumar Jha",
      title: "Co-Founder, ArthAlpha",
      image:
        "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760593621/rohit_vo3c4g.svg",
    },
    {
      quote: "Successfully overhauled the design of our entire platform",
      name: "Eden Hazani",
      title: "VP Research and Development, Ipsos",
      image:
        "https://res.cloudinary.com/dvk9ttiym/image/upload/v1753805632/eden-modified_jsf37k.png",
    },
    {
      quote: "from the 1st SaaS flow to our full design overhaul, was crisp",
      name: "Nipun Sharma",
      title: "CEO, RevUp AI",
      image:
        "https://res.cloudinary.com/dvk9ttiym/image/upload/v1760593623/nipun_tqwxmz.svg",
    },
  ];

  return (
    <>
      <div className="flex flex-row items-center justify-center py-6 w-full max-md:py-0 max-md:pt-1 relative">
        {/* Subtle Grid Background Pattern */}
        <div
          className="absolute pointer-events-none -mt-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)

            `,
            backgroundSize: "40px 40px",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginLeft: "calc(-50vw + 50%)",
          }}
        />
        {/* Layered gradient with gentle mist animation */}
        <div
          className="absolute pointer-events-none -mt-20"
          style={{
            backgroundImage: `
              linear-gradient(to top, #ffffff 0%, transparent 10%),
              linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
            `,
            animation: "gentle-mist 8s ease-in-out infinite",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginLeft: "calc(-50vw + 50%)",
          }}
        ></div>
        <div
          className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto"
          style={{ overflow: "visible" }}
        >
          {" "}
          {/* Trust Badge with GlassSurface - Inline Avatars */}
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={12}
            blur={11}
            opacity={0.93}
            borderWidth={0.01}
            brightness={50}
            backgroundOpacity={0.1}
            saturation={1}
            displace={0.5}
            distortionScale={-180}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            forceLightMode={true}
            className="md:my-9 max-md:my-5 !flex !flex-row max-md:!flex-col !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
            style={{
              animation: "trustBadgeUp 0.5s ease-out forwards",
              animationDelay: "0.1s",
              opacity: 0,
              transform: "translateY(20px) scale(0.95)",
            }}
          >
            {/* Avatar Stack */}
            <div
              className="flex flex-row items-center -space-x-2"
              style={{ position: "relative", zIndex: 999999999 }}
            >
              {testimonials.map((testimonial, index) => {
                return (
                  <Tooltip
                    key={index}
                    showArrow
                    closeDelay={100}
                    delay={200}
                    offset={12}
                    placement="bottom"
                    disableAnimation={false}
                    classNames={{
                      base: [
                        // Arrow styling - glass effect for arrow
                        "before:bg-white/70",
                        "before:backdrop-blur-md",
                        "before:shadow-sm",
                      ],
                      content: [
                        // Remove default NextUI background
                        "p-0",
                        "bg-transparent",
                        "shadow-none",
                        "backdrop-blur-none",
                      ],
                    }}
                    motionProps={{
                      variants: {
                        exit: {
                          opacity: 0,
                          y: -8,
                          scale: 0.96,
                          transition: {
                            duration: 0.15,
                            ease: "easeIn",
                          },
                        },
                        enter: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            mass: 0.8,
                          },
                        },
                      },
                    }}
                    content={
                      <div
                        className="w-[280px] p-4 rounded-xl border border-white/50 relative overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(252, 252, 253, 0.94) 100%)",
                          WebkitBackdropFilter:
                            "blur(20px) saturate(180%) brightness(105%)",
                          backdropFilter:
                            "blur(20px) saturate(180%) brightness(105%)",
                          boxShadow:
                            "0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 20px 60px -12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        {/* Frosted glass texture overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none z-0"
                          style={{
                            background:
                              "radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245, 248, 255, 0.3) 0%, transparent 50%)",
                            mixBlendMode: "soft-light",
                          }}
                        />
                        {/* Content wrapper with relative positioning */}
                        <div className="relative z-10">
                          {/* Quote */}
                          <p className="text-sm italic text-black mb-3 leading-relaxed font-semibold">
                            &quot;{testimonial.quote}&quot;
                          </p>

                          {/* Name and Title */}
                          <div className="mb-2">
                            <p className="text-xs font-bold text-black">
                              {testimonial.name}
                            </p>
                            <p className="text-xs text-gray-800 font-semibold">
                              {testimonial.title}
                            </p>
                          </div>

                          {/* Star Rating */}
                          <div className="flex flex-row gap-1">
                            {[...Array(5)].map((_, starIndex) => (
                              <img
                                key={starIndex}
                                alt="star"
                                className="w-[14px] h-[14px]"
                                src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div
                      ref={(el) => {
                        avatarRefs.current[index] = el;
                      }}
                      className="relative"
                      style={{
                        zIndex: hoveredAvatar === index ? 999999999 : "auto",
                      }}
                      onMouseEnter={() => setHoveredAvatar(index)}
                      onMouseLeave={() => setHoveredAvatar(null)}
                    >
                      {/* Avatar */}
                      <img
                        alt={`${testimonial.name} - Client testimonial`}
                        className="w-[28px] h-[28px] border-white rounded-full border-2 cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10 hover:brightness-125 hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        src={testimonial.image}
                        style={{
                          animation:
                            "testimonialImageDrop 0.4s ease-out forwards",
                          animationDelay: `${0.3 + index * 0.1}s`,
                          opacity: 0,
                          transform: "translateY(-20px)",
                        }}
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </div>

            {/* Text */}
            <p className="badge-text relative z-10 max-md:text-xs ml-2 pl-2 max-md:pl-0 max-md:ml-0">
              EMPOWERING 40+ Business ACROSS 6 COUNTRIES
            </p>
          </GlassSurface>
          {/* <div className="flex flex-row items-center justify-center w-full py-6 max-md:py-4 max-md:pb-2 overflow-visible">
            <div className="flex flex-row gap-2 overflow-visible">
              <div className="items-center flex flex-col max-w-[200px] gap-2 max-md:hidden overflow-visible">
                <div className="w-[32px] h-[32px] relative overflow-visible group hover:-translate-y-1 transition-transform duration-300">
                  <Tooltip
                    color="foreground"
                    content="Rohit Kumar Jha - Co-Founder , ArthAlpha"
                    showArrow={true}
                  >
                    <img
                      alt="Rohit Kumar Jha - Client testimonial for UI Pirate enterprise UI/UX design services"
                      className="w-[32px] h-[32px] border-white rounded-full border-2 cursor-pointer transition-all  duration-300 hover:animate-[imageLift_0.3s_ease-out_forwards] hover:brightness-125 hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1760593621/rohit_vo3c4g.svg"
                      style={{
                        animation:
                          "testimonialImageDrop 0.4s ease-out forwards",
                        animationDelay: "0.3s",
                        opacity: 0,
                        transform: "translateY(-40px)",
                      }}
                    />
                  </Tooltip>
                </div>
                <div className="min-h-[32px] flex items-center overflow-hidden">
                  <p
                    className="text-center italic text-xs"
                    style={{
                      animation: "testimonialTextUp 0.4s ease-out forwards",
                      animationDelay: "0.4s",
                      opacity: 0,
                      transform: "translateY(25px)",
                    }}
                  >
                    &quot;...brought our complex AI trading vision to
                    life...&quot;
                  </p>
                </div>
                <div className="flex flex-row gap-1 h-[14px] items-start">
                  <StarRating delay={300} />
                </div>
              </div>
              <div className="items-center flex flex-col max-w-[200px] gap-2 max-md:gap-1  overflow-visible ">
                <div className="w-[32px] h-[32px] relative overflow-visible group hover:-translate-y-1 transition-transform duration-300">
                  <Tooltip
                    color="foreground"
                    content="Eden Hazani - VP Research and Development ,Ipsos"
                    showArrow={true}
                  >
                    <img
                      alt="Eden Hazani - Client testimonial for SaaS platform design overhaul"
                      className="w-[32px] h-[32px] border-white rounded-full border-2  cursor-pointer transition-transform duration-300 hover:animate-[imageLift_0.3s_ease-out_forwards]"
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753805632/eden-modified_jsf37k.png"
                      style={{
                        animation:
                          "testimonialImageDrop 0.4s ease-out forwards",
                        animationDelay: "0.45s",
                        opacity: 0,
                        transform: "translateY(-40px)",
                      }}
                    />
                  </Tooltip>
                </div>
                <div className="min-h-[32px] flex items-center overflow-hidden">
                  <p
                    className="text-center italic text-xs font-medium"
                    style={{
                      animation: "testimonialTextUp 0.4s ease-out forwards",
                      animationDelay: "0.55s",
                      opacity: 0,
                      transform: "translateY(25px)",
                    }}
                  >
                    &quot;Successfully overhauled the design of our entire
                    platform...&quot;
                  </p>
                </div>
                <div className="flex flex-row gap-1 h-[14px] items-start">
                  <StarRating delay={350} />
                </div>
              </div>
              <div className="items-center flex flex-col max-w-[200px] gap-2 max-md:hidden overflow-visible">
                <div className="w-[32px] h-[32px] relative overflow-visible group hover:-translate-y-1 transition-transform duration-300">
                  <Tooltip
                    color="foreground"
                    content=" Nipun Sharma - CEO, RevUp AI"
                    showArrow={true}
                  >
                    <img
                      alt="Nipun Sharma - Client testimonial for brand identity and mobile app design"
                      className="w-[32px] h-[32px] border-white rounded-full border-2  cursor-pointer transition-all duration-300 hover:animate-[imageLift_0.3s_ease-out_forwards] hover:brightness-125 hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1760593623/nipun_tqwxmz.svg"
                      style={{
                        animation:
                          "testimonialImageDrop 0.4s ease-out forwards",
                        animationDelay: "0.6s",
                        opacity: 0,
                        transform: "translateY(-40px)",
                      }}
                    />
                  </Tooltip>
                </div>
                <div className="min-h-[32px] flex items-center overflow-hidden">
                  <p
                    className="text-center italic text-xs font-medium"
                    style={{
                      animation: "testimonialTextUp 0.4s ease-out forwards",
                      animationDelay: "0.7s",
                      opacity: 0,
                      transform: "translateY(25px)",
                    }}
                  >
                    &quot;...from the 1st SaaS flow to our full design overhaul,
                    was crisp...&quot;
                  </p>
                </div>
                <div className="flex flex-row gap-1 h-[14px] items-start">
                  <StarRating delay={400} />
                </div>
              </div>
            </div>
          </div> */}
          {/* Animated Headline */}
          <div className="relative z-10">
            <AnimatedHeadline />
          </div>
          <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-2xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 font-sans leading-[25.2px] 2xl:leading-[32px]">
            We help fast-growing SaaS and enterprise teams build world-class
            dashboards, onboarding flows, and AI-powered product experiences -
            from MVP to complete enterprise applications.
          </p>
          <div
            className=" max-xl:my-6 xl:my-8 max-md:my-6 flex items-center flex-col max-md:px-2 button-spring-animate relative gap-3"
            style={{ overflow: "visible" }}
          >
            <Link className="relative z-10" href="/contact">
              <div
                className="bg-black text-white h-auto group transform transition-all duration-[600ms] ease-in-out max-md:px-4 px-6 py-[18px] buttonHero hover:bg-black flex flow-row items-center gap-3 relative"
                style={{
                  borderRadius: "11.889px",
                  background: "#000",
                  boxShadow:
                    "0 2.122px 2.97px 0 rgba(255, 255, 255, 0.65) inset, 0 2.386px 6.365px 0 rgba(0, 0, 0, 0.16), 0 0 0 1.734px #2F2F37 inset, 0 1.591px 4.971px 0 rgba(0, 0, 0, 0.12), 0 11.134px 39.765px 0 rgba(15, 15, 15, 0.03), 0 11.134px 25.458px 0 rgba(15, 15, 15, 0.02), 0 11.134px 15.906px 0 rgba(15, 15, 15, 0.02)",
                }}
              >
                {/* Star Confetti Container - Behind button */}
                <div className="star-confetti-container">
                  <div className="star-confetti-revolve">
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                    <div className="star-confetti">
                      <img
                        alt=""
                        aria-hidden="true"
                        src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <img
                    alt="Free consultation badge"
                    className="w-auto h-[30px]"
                    src="/assets/free.svg"
                  />
                </div>
                <p className="font-semibold text-nowrap max-md:text-medium">
                  {" "}
                  Book a 15-min Product Strategy Call
                </p>
              </div>
            </Link>
            <div className="w-[100%] z-10">
              <a
                className="w-full"
                href="https://wa.link/i35lma"
                rel="noreferrer"
                target="_blank"
              >
                <Button
                  className="text-black font-bold w-full py-[27px]"
                  color="primary"
                  style={{
                    width: "100%",
                    borderRadius: "9.908px",
                    border: "3.979px solid #FFF",
                    background:
                      "linear-gradient(180deg, #F4F4F4 0%, #FEFEFE 100%)",
                    boxShadow:
                      "0 0 0.295px 0.295px rgba(0, 0, 0, 0.07), 0 0 0.295px 0.884px rgba(0, 0, 0, 0.05), 0 3.536px 3.831px -1.768px rgba(0, 0, 0, 0.25), 0 1.179px 4.715px 1.179px rgba(0, 0, 0, 0.12)",
                  }}
                  variant="bordered"
                >
                  <div className="flex flex-row items-center gap-3">
                    <img
                      alt="WhatsApp Logo"
                      className="w-[30px] h-[30px]"
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                    />
                    <p className="text-base font-semibold max-md:text-medium">
                      Lets Talk via Whatsapp
                    </p>
                  </div>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHero;
