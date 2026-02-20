"use client";
import { Button } from "@heroui/button";
import Link from "next/link";
import GlassSurface from "@/components/GlassSurface";

const ServiceDetailsHero = ({ data }: any) => {



  return (
    <>
      <div className="flex flex-row items-center justify-center py-6 w-full max-md:py-0 max-md:pt-1 relative ">
        {/* Subtle Grid Background Pattern */}
        <div
          className="absolute pointer-events-none -mt-20 "
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
          className="absolute pointer-events-none -mt-20 "
          style={{
            backgroundImage: `
              linear-gradient(to top, rgba(250, 250, 250, 1), transparent 10%),
              linear-gradient(to top, rgba(250, 250, 250, 1) 0%, transparent 35%)
            `,
            animation: "gentle-mist 8s ease-in-out infinite",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            marginLeft: "calc(-50vw + 50%)",
          }}
        />
        <div
          className="flex flex-col items-center justify-center w-full relative z-10 container mx-auto "
          style={{ overflow: "visible" }}
        >
          {" "}
          {/* Trust Badge with GlassSurface - Inline Avatars */}
          <GlassSurface
            backgroundOpacity={0.1}
            blueOffset={20}
            blur={11}
            borderRadius={12}
            borderWidth={0.01}
            brightness={50}
            className="md:my-9 max-md:my-5 !flex !flex-row max-md:!flex-col !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
            displace={0.5}
            distortionScale={-180}
            forceLightMode={true}
            greenOffset={10}
            height="auto"
            opacity={0.93}
            redOffset={0}
            saturation={1}
            style={{
              animation: "trustBadgeUp 0.5s ease-out forwards",
              animationDelay: "0.1s",
              opacity: 0,
              transform: "translateY(20px) scale(0.95)",
            }}
            width="auto"
          >
            

            {/* Text */}
            <p className="badge-text relative z-10 max-md:text-xs uppercase">
              {data.badge || "EMPOWERING 40+ Business ACROSS 6 COUNTRIES"}
            </p>
          </GlassSurface>

          {/* Animated Headline Replacement using Data Props */}
          <div className="relative z-10 w-full">
          
            {data.heading && (
              <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] px-4 text-center font-[700] max-md:font-[600] max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative reveal-text-anim">
                {data.heading.map((line: any, lineIndex: number) => (
                  <div key={lineIndex} className="flex flex-wrap justify-center gap-x-[0.2em]">
                    {line.map((word: any, wordIndex: number) => (
                      <span
                        key={wordIndex}
                        className={`inline-block ${word.highlight ? "text-[#FF5B04]" : "text-black"
                          }`}
                      >
                        {word.text}
                        {/* Add space after each word except the last one in the line */}
                        {wordIndex < line.length - 1 && " "}
                      </span>
                      
                    ))}
                    {"  "}
                  </div>
                ))} {" "}
              </h1>
            )}
          </div>

          <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 leading-[25.2px] 2xl:leading-[32px] text-gray-600">
            {data.description}
          </p>

          <div
            className=" max-xl:my-6 xl:my-8 max-md:my-6 flex items-center flex-col max-md:px-2 button-spring-animate relative gap-3"
            style={{ overflow: "visible" }}
          >
            <Link className="relative z-10" href="/contact">
              <div
                className="bg-black text-white h-auto group transform transition-all duration-[600ms] ease-in-out max-md:px-4 px-6 py-[18px] max-md:py-[14px] buttonHero hover:bg-black flex flow-row items-center gap-3 relative"
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
                    className="w-auto h-[30px] max-md:h-[20px]"
                    src="/assets/free.svg"
                  />
                </div>
                <p className="font-semibold text-nowrap max-md:text-sm max-md:font-regular">
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
                  className="text-black font-bold w-full py-[27px] max-md:py-[20px]"
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
                      className="w-[30px] h-[30px] max-md:w-[20px] max-md:h-[20px]"
                      src="https://res.cloudinary.com/damm9iwho/image/upload/v1729511358/whatsapp_zssebt.svg"
                    />
                    <p className="text-base font-semibold max-md:text-sm max-md:font-regular">
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

export default ServiceDetailsHero;
