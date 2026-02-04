"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
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
      delay: i * 0.08,
      duration: 0.8,
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
    ? testimonials.slice(0, 7)
    : testimonials;

  // split into 3 columns
  const col1 = displayedTestimonials.filter((_, i) => i % 3 === 0);
  const col2 = displayedTestimonials.filter((_, i) => i % 3 === 1);
  const col3 = displayedTestimonials.filter((_, i) => i % 3 === 2);

  return (
    <section className="w-full py-12 container mx-auto px-6 md:px-12 lg:px-24">
      <div className={`relative transition-all duration-700 ease-in-out ${isExpanded ? "h-auto" : "h-[600px] overflow-hidden"}`}>
        {/* Gradient Mask for collapsed state */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
        )}

        <motion.div 
          className="flex flex-col md:flex-row gap-4 md:gap-6"
          initial={{ y: 0 }}
          animate={isExpanded ? { y: 0 } : {}}
          whileHover={!isExpanded ? { 
            y: `-${(Math.max(col1.length, col2.length, col3.length) * 250)}px`,
            transition: {
              duration: Math.max(col1.length, col2.length, col3.length) * 3,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }
          } : {}}
        >
          {[col1, col2, col3].map((col, i) => (
            <div 
              key={i} 
              className="flex flex-col gap-4 flex-1"
            >
              {col.map((item, idx) => (
                <motion.div
                  key={idx}
                  custom={idx + i * 3}
                  initial="hidden"
                  variants={cardVariants}
                  viewport={{ once: true, amount: 0.3 }}
                  whileInView="visible"
                  className="h-full"
                >
                  <Card
                    className="rounded-[32px] h-full hover:rounded-[0px] transition-all duration-500 max-md:w-full bg-[#F6F6F6] shadow-none border-1 border-[#0000000f] overflow-hidden group/card hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                  >
                    <CardBody className="p-2 h-full">
                      <div className="w-full h-full p-5 bg-white rounded-[24px] group-hover/card:rounded-[0px] transition-all duration-500 max-md:p-4 shadow-sm group-hover/card:shadow-xl flex flex-col">
                        <div className="flex flex-row items-center justify-between gap-4 max-md:gap-2">
                          <div className="flex flex-row gap-3 items-center">
                            <Avatar
                              avatar={item.profileImage}
                              name={item.name}
                              size={52}
                            />

                            <div>
                              <p className="text-xl max-md:text-lg font-semibold">
                                {item.name}
                              </p>
                              <p className="text-[#A2A2A2] text-sm -mt-1">
                                {item.occupation || "occupation"}
                              </p>
                              <p className="text-[#A2A2A2] text-sm -mt-1">
                                {item.company || "location"}
                              </p>
                            </div>
                          </div>
                          <div className="max-md:hidden block">
                            {item.logo && (
                              <img
                                alt={`${item.company || item.name} company logo`}
                                className="max-w-[80px]"
                                src={item.logo}
                              />
                            )}
                          </div>
                        </div>
                        <p className="mt-4 text-base font-[400]">
                          {item.review || ""}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* See More Button */}
      {!isExpanded && (
        <div className="flex justify-center mt-8 relative z-30">
          <LetsTalkButton 
            variant="color" 
            onClick={() => setIsExpanded(true)}
          >
            See More Testimonials
          </LetsTalkButton>
        </div>
      )}
    </section>
  );
}
