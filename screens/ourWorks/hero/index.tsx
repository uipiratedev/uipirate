"use client";

import { Card, CardBody } from "@nextui-org/react";
import testimonials from "@/data/testimonials.json";
import Avatar from "@/components/Avatar";
import { motion } from "framer-motion";

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
            src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1753806991/tabler-icon-star-filled_oymrgq.svg"
            alt="5 star rating"
            className="absolute left-0 top-0 h-[14px] w-[14px] transition-transform duration-300 hover:scale-110"
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
    <div className="flex flex-row items-center justify-center py-12 w-full max-lg:py-10 max-md:py-6 container mx-auto">
      <section className="relative flex flex-col items-center text-center">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Real Projects. Real Results.
        </h1>

        {/* Subheading */}
        <p className="reveal-text-anim-1 lg:w-3/4 text-center text-lg max-md:text-sm mb-8 px-40 max-md:px-4 font-sans leading-[25.2px]">
          See how we’ve helped startups, SaaS teams, and global brands turn
          ideas into fully functional digital products.
        </p>

        {/* ✅ Reveal Animation for Card Section */}
        <motion.div
          className="relative flex justify-center items-center my-8 max-md:hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.6,
                  ease: "easeOut",
                }}
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
                      name={item.name}
                      avatar={item.profileImage}
                      size={48}
                    />
                    <p className="line-clamp-3 text-center text-sm ">
                      "...{item.review}..."
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
        <div className="flex flex-wrap justify-center items-center gap-10 text-center py-10">
          {[
            { num: "6+", text: "Countries Served" },
            { num: "50+", text: "Projects Completed" },
            { num: "20+", text: "Projects Completed" },
            { num: "20+", text: "Enterprise Clients" },

            { num: "9+", text: "Years of Experience" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
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
      </section>
    </div>
  );
};

export default OurWorksHero;
