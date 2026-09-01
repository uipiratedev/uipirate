"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import testimonials from "@/data/testimonials.json";
import Avatar from "@/components/Avatar";
import LetsTalkButton from "@/components/LetsTalkButton";

// Smooth animation variants for testimonial cards
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function TestimonialCards() {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768); // max-md breakpoint

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // decide which testimonials to show
  const displayedTestimonials = isMobile
    ? testimonials.slice(0, 6)
    : testimonials;

  return (
    <section className="w-full pt-6 max-md:pt-4 container mx-auto px-4 sm:px-6 lg:px-20 xl:px-32">
      <div className="text-center mb-10 max-md:mb-8">
        <h2 className="text-4xl max-md:text-3xl font-bold">
          What <span className="text-brand-orange">Clients Say</span>
        </h2>
      </div>
      <div
        className={`relative transition-all duration-700 ease-in-out ${isExpanded ? "h-auto" : "h-[580px] max-md:h-[480px] overflow-hidden"
          }`}
      >
        {/* Gradient Mask for collapsed state */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-[240px] bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />
        )}

        <motion.div
          animate={isExpanded ? { y: 0 } : {}}
          className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]"
          initial={{ y: 0 }}
        >
          {displayedTestimonials.map((item, idx) => {
            // Clean occupation title
            const role = item.occupation
              ? item.occupation.split(",").slice(0, -1).join(",").trim() ||
              item.occupation
              : "";

            return (
              <motion.div
                key={idx}
                className="break-inside-avoid mb-5 inline-block w-full"
                custom={idx}
                initial="hidden"
                variants={cardVariants}
                viewport={{ once: true, amount: 0.2 }}
                whileInView="visible"
              >
                <div className="group relative bg-white border border-[#E5E7EB] rounded-[24px] p-5 px-7 pt-12 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 flex flex-col justify-start gap-3.5 overflow-hidden">
                  {/* Top Hanging Stars Badge */}
                  <div className="absolute top-0 left-6 flex flex-col items-center">
                    {/* Two suspension strings */}
                    <div className="flex justify-between w-20 h-4 border-x border-x-[2px] border-[#FFD2BC]" />
                    {/* Badge pill */}
                    <div className="bg-[#FFEFE6] border border-[#FFD8C2]/70 rounded-md px-3 py-2 flex items-center gap-1 shadow-xs">
                      {[...Array(5)].map((_, starIdx) => (
                        <svg
                          key={starIdx}
                          className="w-3.5 h-3.5 fill-[#FF5B04] text-[#FF5B04]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Review Quote Text */}
                  <p className="text-[#334155] text-[13.5px] font-normal leading-relaxed text-left pt-4">
                    {item.review}
                  </p>

                  {/* divider */}
                  <div className="border-t border-[#E5E7EB] my-2" />

                  {/* Header row: Avatar + Info + Company Logo */}
                  <div className="flex items-center justify-between gap-2.5 ">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 shadow-2xs">
                        {item.profileImage ? (
                          <img
                            alt={item.name}
                            className="w-full h-full object-cover"
                            src={item.profileImage}
                          />
                        ) : (
                          <Avatar
                            avatar={item.profileImage}
                            name={item.name}
                            size={40}
                          />
                        )}
                      </div>

                      <div className="text-left min-w-0">
                        <h4 className="text-[15px] font-bold text-[#0F172A] leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-xs font-medium text-[#94A3B8] mt-0.5 leading-tight">
                          {role}
                        </p>
                        <p className="text-xs font-medium text-[#94A3B8] leading-tight">
                          {item.company}
                        </p>
                      </div>
                    </div>

                    {/* Company Logo on Right */}
                    {item.logo && (
                      <div className="flex-shrink-0 max-w-[70px] pl-1">
                        <img
                          alt={`${item.company || item.name} company logo`}
                          className="max-h-6 w-auto object-contain"
                          src={item.logo}
                        />
                      </div>
                    )}
                  </div>


                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* See More Button */}
      {!isExpanded && (
        <div className="flex justify-center mt-10 relative z-30 pb-1">
          <LetsTalkButton variant="light" onClick={() => setIsExpanded(true)}>
            See More Testimonials
          </LetsTalkButton>
        </div>
      )}
    </section>
  );
}
