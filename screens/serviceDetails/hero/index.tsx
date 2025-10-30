"use client";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";

const ServiceDetailsHero = ({ data }: any) => {
  const meteors = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${-5 - Math.random() * 10}%`, // Start from above the viewport
    delay: `${Math.random() * 8}s`,
    duration: `${2 + Math.random() * 3}s`,
    drift: `${Math.random() * 80 - 40}px`, // Horizontal drift for diagonal effect
  }));

  const [isHoveredChat, setIsHoveredChat] = useState(false);

  return (
    <div className="relative overflow-hidden bg-[#f5f5f5] text-black md:h-screen -mt-[67px] md:pt-[67px] ">
      {/* === Static Gray Grid Background === */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:80px_80px]"
        // style={{
        //   animation: "slow-rotate 120s linear infinite", // 120s for very slow rotation
        //   transformOrigin: "left right",
        // }}
      />

      {/* === Meteors === */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {meteors.map((meteor) => (
          <span
            key={meteor.id}
            className="meteor absolute"
            style={
              {
                top: meteor.top,
                left: meteor.left,
                animationDelay: meteor.delay,
                animationDuration: meteor.duration,
                "--drift": meteor.drift,
              } as React.CSSProperties
            }
          >
            {/* Meteor head - bright glowing dot */}
            <div className="absolute w-[3px] h-[3px] -ml-[1px] rounded-full bg-cyan-600 shadow-[0_0_8px_2px_rgba(0,255,255,0.8),0_0_4px_1px_rgba(255,255,255,0.9)]" />

            {/* Meteor tail - long gradient streak */}
            <div
              className="absolute top-0 left-0 w-[1.5px] h-[50px] -translate-y-full bg-gradient-to-b from-cyan-50 via-cyan-300 to-cyan-600 opacity-70"
              style={{
                boxShadow: "0 0 6px 1px rgba(0, 255, 255, 0.4)",
              }}
            />
          </span>
        ))}
      </div>

      {/* === Hero Content === */}
      <section className="relative pt-[83px] md:pt-[87px] flex flex-col items-center text-center z-10">
        {/* Badge */}
        <div
          className="p-2 px-4 rounded-xl bg-[#8EF1F1] border-cyan-400 border-2 mb-6"
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
        >
          <p className="text-center uppercase text-xs max-md:text-[10px] font-medium text-black">
            {data.badge}
          </p>
        </div>

        {/* Headings */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim">
          {data.heading}
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim">
          {data.heading1}
        </h1>

        {/* Subheading */}
        <p className="reveal-text-anim-1 lg:w-3/4 text-center text-lg max-md:text-sm mb-8 px-40 max-md:px-4 font-sans leading-[25.2px]">
          {data.description}
        </p>

        {/* CTA */}
        <div
          className="my-12 flex flex-row items-center max-md:flex-col max-md:px-2 button-spring-animate relative gap-3"
          style={{ overflow: "visible" }}
        >
          <a
            href="https://cal.com/vishal-anand/introduction-and-free-ui-ux-strategy-session"
            target="blank"
            className="relative z-10"
          >
            <div className=" hover:border-back/50 hover:border-4 border-4 bg-black text-white rounded-[20px] h-auto group transform transition-all duration-[600ms] ease-in-out max-md:px-4 px-6 py-3 buttonHero md:hover:pl-12 hover:bg-black flex flow-row items-center gap-3 relative">
              {/* Star Confetti Container - Behind button */}
              <div className="star-confetti-container">
                <div className="star-confetti-revolve">
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                  <div className="star-confetti">
                    <img
                      src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
                      alt="star"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 items-center md:mr-11">
                <img
                  src="https://res.cloudinary.com/damm9iwho/image/upload/v1730289917/Frame_1984078767_sjyim4.svg"
                  alt="Dribble Logo"
                  id="image"
                  className="w-auto h-[30px] md:absolute  transform translate-x-0 transition-all duration-[580ms] ease-in-out  md:group-hover:translate-x-4 max-md:order-3  md:order-1 md:group-hover:order-3"
                />
                <p
                  id="plus"
                  className="text-[#5B5B5B] text-xl font-bold md:absolute order-2 -mt-1"
                >
                  +
                </p>
                <img
                  src="https://res.cloudinary.com/damm9iwho/image/upload/v1729862847/Div_framer-bfl99f_v7cltn.svg"
                  alt="Dribble Logo"
                  id="client"
                  className="w-auto bg-black h-[30px] md:absolute  transform translate-x-0 transition-all duration-500 ease-in-out  md:group-hover:-translate-x-[2.1rem] max-md:order-1  md:order-3 md:group-hover:order-1"
                />
              </div>
              <p className="text-lg font-bold text-nowrap">
                {" "}
                Book a 15-min call
              </p>
              <div>
                <img
                  src="https://res.cloudinary.com/damm9iwho/image/upload/v1729594468/free_p7odqs.svg"
                  alt="Dribble Logo"
                  className="w-auto h-[30px]"
                />
              </div>
            </div>
          </a>
          <div className="w-[100%] z-10">
            <a
              href="https://wa.link/i35lma"
              target="_blank"
              className="w-[200px]"
            >
              <Button
                color="primary"
                variant="bordered"
                className=" border-gray-300 text-black font-bold w-full bg-white  hover:border-gray-200 rounded-[16px]   py-[27px]"
                style={{ width: "100%" }}
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
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                      alt="WhatsApp Logo"
                      className="w-[30px]  h-[30px] "
                    />
                    <p className="text-base font-semibold">Lets Talk</p>
                  </span>

                  <span
                    className={`text-black w-full transition-transform duration-300 ease-in-out transform flex flex-row items-center gap-3 ${
                      isHoveredChat ? "-translate-y-4" : "translate-y-[50px]"
                    }`}
                  >
                    <img
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                      alt="WhatsApp Logo"
                      className="w-[30px]  h-[30px]"
                    />
                    <p className="text-base font-semibold"> +91 97086 36151</p>
                  </span>
                </div>
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailsHero;
