"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import GlassSurface from "@/components/GlassSurface";
import testimonials from "@/data/testimonials.json";
import Avatar from "@/components/Avatar";

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
        <div key={index} className="relative h-[14px] w-[14px]">
          <img
            alt="5 star rating"
            className="absolute left-0 top-0 h-[14px] w-[14px] transition-transform duration-300 hover:scale-110"
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

const OurWorksHero = () => {

  return (
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
        {/* Badge with GlassSurface */}
        <GlassSurface
          backgroundOpacity={0.1}
          blueOffset={20}
          blur={11}
          borderRadius={12}
          borderWidth={0.01}
          brightness={50}
          className="md:my-9 max-md:my-5 !flex !flex-row !items-center !gap-3 isolate overflow-visible p-2 px-4 max-md:mx-2"
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
          <p className="badge-text relative z-10 max-md:text-xs uppercase font-semibold tracking-wider">
            PORTFOLIO & CASE STUDIES
          </p>
        </GlassSurface>

        {/* Headline */}
        <div className="relative z-10 w-full">
          <h1 className="text-[40px] 3xl:text-[80px] 2xl:text-[74px] xl:text-[61px] lg:text-[48px] px-4 text-center font-[700] max-md:font-[600] max-md:leading-[1.08] max-md:px-1 tracking-[-1.5px] leading-[1.1] relative reveal-text-anim">
            <span className="text-[#FF5B04]">Real Projects.</span>{" "}
            <span className="text-black">Real Results.</span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="reveal-text-anim-1 max-w-[820px] 2xl:max-w-[1000px] text-center text-lg 2xl:text-xl max-md:text-sm mt-4 md:my-4 2xl:px-3 px-4 leading-[25.2px] 2xl:leading-[32px] text-gray-600">
          See how we’ve helped startups, SaaS teams, and global brands turn ideas
          into fully functional digital products.
        </p>

        {/* ✅ Reveal Animation for Card Section */}
        <motion.div
          className="relative flex justify-center items-center my-8 max-md:hidden z-10"
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {testimonials.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="relative transition-transform duration-700 ease-in-out hover:scale-105"
              style={{
                zIndex: 3 - index,
                marginLeft: index === 0 ? "0px" : "-75px",
                transform:
                  index === 0
                    ? "rotate(-10deg)"
                    : index === 1
                      ? "rotate(5deg)"
                      : "rotate(18deg)",
                marginTop: index === 0 ? "0px" : index === 1 ? "-50px" : "0px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card
                  className="relative overflow-hidden w-[300px] h-[200px]"
                  style={{
                    borderRadius: "40px",
                    backdropFilter: "blur(10px)",
                    position: "relative",
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Gradient Border */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "40px",
                      padding: "2px",
                      background:
                        "linear-gradient(90deg, #F7DE04 4.58%, #11C781 27.52%, #05A2FB 48.18%, #5E72E4 72.05%, #F04800 92.7%)",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />

                  {/* Card Content */}
                  <CardBody
                    className="relative z-0 flex flex-col items-center justify-center gap-4 p-4"
                    style={{
                      borderRadius: "38px",
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <Avatar
                      avatar={item.profileImage}
                      name={item.name}
                      size={48}
                    />
                    <p className="line-clamp-3 text-center text-sm ">
                      &quot;...{item.review}...&quot;
                    </p>
                    <div className="flex flex-row items-start gap-1 overflow-hidden">
                      <StarRating delay={300} />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center items-center gap-10 text-center py-10 z-10 relative">
          {[
            { num: "6+", text: "Countries Served" },
            { num: "50+", text: "Projects Completed" },
            { num: "20+", text: "Enterprise Clients" },
            { num: "9+", text: "Years of Experience" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-5xl max-md:text-2xl font-bold text-black">
                {item.num}
              </h3>
              <p className="text-lg max-md:text-xs text-[#777777]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurWorksHero;
