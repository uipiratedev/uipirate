"use client";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { Tooltip } from "@nextui-org/react";
import Link from "next/link";

const StarRating = ({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <div
      className={`flex flex-row gap-1 h-[14px] ${className}`}
      style={{ overflow: "visible" }}
    >
      {[...Array(5)].map((_, index) => (
        <div key={index} className="w-[14px] h-[14px] relative">
          <img
            alt="5 star rating for UI Pirate design services"
            className="w-[14px] h-[14px] transition-transform duration-300 hover:scale-110 absolute top-0 left-0"
            src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
            style={{
              animation: `starSlideUp 0.5s ease-out forwards`,
              animationDelay: `${delay / 1000 + index * 0.12}s`,
              opacity: 0,
              transform: "translateY(40px)",
            }}
          />
        </div>
      ))}
    </div>
  );
};

const LandingHero = () => {
  const [isHoveredChat, setIsHoveredChat] = useState(false);

  return (
    <>
      <div className="flex flex-row items-center justify-center py-6 w-full max-md:py-0 max-md:pt-1 container mx-auto">
        <div
          className="flex flex-col items-center justify-center w-screen"
          style={{ overflow: "visible" }}
        >
          {" "}
          <div
            className="p-2 px-4 rounded-xl bg-[#8EF1F1] border-cyan-400 border-2"
            style={{
              animation: "trustBadgeUp 0.5s ease-out forwards",
              animationDelay: "0.1s",
              opacity: 0,
              transform: "translateY(20px) scale(0.95)",
            }}
          >
            <p className="text-center uppercase text-xs max-md:text-[10px] font-medium">
              Empowering 40+ startups across 6 countries
            </p>
          </div>
          <div className="flex flex-row items-center justify-center w-full py-6 max-md:py-4 max-md:pb-2 overflow-visible">
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
          </div>
          <h1 className="reveal-text-anim text-[68px] px-56 text-center font-[700] max-md:font-[600] max-lg:text-5xl max-md:text-[40px] max-md:leading-[1.08] max-md:px-3 max-lg:px-12 max-md:py-0 max-xl:px-12 max-2xl:px-32 tracking-[-1.5px] leading-[1.1]">
            Designing <br className="sm:hidden"></br>AI-Driven SaaS Products
            That Convert, <br className="max-md:hidden"></br>Scale & Ship Faster
          </h1>
          <p className="reveal-text-anim-1 lg:w-3/4 text-center text-lg max-md:text-sm mt-4 px-40 max-xl:px-4 max-lg:12 font-sans leading-[25.2px] ">
            We help fast-growing SaaS and enterprise teams build world-class
            dashboards, onboarding flows, and AI-powered product experiences -
            from MVP to complete design systems.
          </p>
          <div
            className=" max-xl:my-6 xl:my-8 max-md:my-3 flex items-center flex-col max-md:px-2 button-spring-animate relative gap-3"
            style={{ overflow: "visible" }}
          >
            <Link className="relative z-10" href="/contact">
              <div className=" hover:border-back/50 hover:border-4 border-4 bg-black text-white rounded-[20px] h-auto group transform transition-all duration-[600ms] ease-in-out max-md:px-4 px-6 py-3 buttonHero md:hover:pl-12 hover:bg-black flex flow-row items-center gap-3 relative">
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

                <div className="flex flex-row gap-2 items-center md:mr-11">
                  <img
                    alt="Calendar icon for booking consultation"
                    className="w-auto h-[30px] md:absolute  transform translate-x-0 transition-all duration-[580ms] ease-in-out  md:group-hover:translate-x-4 max-md:order-3  md:order-1 md:group-hover:order-3"
                    id="image"
                    src="https://res.cloudinary.com/damm9iwho/image/upload/v1730289917/Frame_1984078767_sjyim4.svg"
                  />
                  <p
                    className="text-[#5B5B5B] text-xl font-bold md:absolute order-2 -mt-1"
                    id="plus"
                  >
                    +
                  </p>
                  <img
                    alt="UI Pirate logo - Enterprise UI/UX design agency"
                    className="w-auto bg-black h-[30px] md:absolute  transform translate-x-0 transition-all duration-500 ease-in-out  md:group-hover:-translate-x-[2.1rem] max-md:order-1  md:order-3 md:group-hover:order-1"
                    id="client"
                    src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
                  />
                </div>
                <p className="font-semibold text-nowrap">
                  {" "}
                  Book a 15-min Product Strategy Call
                </p>
                <div>
                  <img
                    alt="Free consultation badge"
                    className="w-auto h-[30px]"
                    src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                  />
                </div>
              </div>
            </Link>
            <div className="w-[100%] z-10">
              <a
                className="w-[200px]"
                href="https://wa.link/i35lma"
                rel="noreferrer"
                target="_blank"
              >
                <Button
                  className=" border-gray-300 text-black font-bold w-full bg-white  hover:border-gray-200 rounded-[16px]   py-[27px]"
                  color="primary"
                  style={{ width: "100%" }}
                  variant="bordered"
                  onMouseEnter={() => setIsHoveredChat(true)}
                  onMouseLeave={() => setIsHoveredChat(false)}
                >
                  <div className="flex flex-col items-center justify-center max-h-[32px] overflow-hidden">
                    <span
                      className={`text-black transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-x-3 ${
                        isHoveredChat ? "translate-y-[50px]" : "translate-y-4"
                      }`}
                    >
                      <img
                        alt="WhatsApp Logo"
                        className="w-[30px]  h-[30px] "
                        src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                      />
                      <p className="text-base font-semibold">Lets Talk</p>
                    </span>

                    <span
                      className={`text-black w-full transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3 ${
                        isHoveredChat ? "-translate-y-4" : "translate-y-[50px]"
                      }`}
                    >
                      <img
                        alt="WhatsApp icon for instant messaging"
                        className="w-[30px]  h-[30px]"
                        src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                      />
                      <p className="text-base font-semibold">
                        {" "}
                        +91 97086 36151
                      </p>
                    </span>
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
