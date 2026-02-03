"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";

import testimonials from "@/data/testimonials.json";
import Avatar from "@/components/Avatar";

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
      <div className="h-[400px] overflow-hidden group">
        <motion.div 
          className="flex flex-col md:flex-row gap-4 md:gap-6"
          initial={{ y: 0 }}
          whileHover={{ 
            y: `-${(Math.max(col1.length, col2.length, col3.length) * 200) - 300}px`,
            transition: {
              duration: Math.max(col1.length, col2.length, col3.length) * 2,
              ease: "linear"
            }
          }}
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
                >
                <Card
                  className="rounded-[32px] max-md:w-full bg-[#e9e9e9] shadow-none border-1 border-[#0000000f]"
                >
                  <CardBody className="p-2 max-md:p-2 max-lg:p-2">
                    <div className="w-full p-5 bg-white rounded-[24px] max-md:p-4 box-shadow">
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
    </section>
  );
}
