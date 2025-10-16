"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import testimonials from "@/data/testimonials.json";

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
    ? testimonials.slice(0, 6)
    : testimonials;

  // split into 3 columns
  const col1 = displayedTestimonials.filter((_, i) => i % 3 === 0);
  const col2 = displayedTestimonials.filter((_, i) => i % 3 === 1);
  const col3 = displayedTestimonials.filter((_, i) => i % 3 === 2);

  return (
    <section className="w-full py-12 container mx-auto lg:px-12 max-md:px-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {[col1, col2, col3].map((col, i) => (
          <div key={i} className="flex flex-col gap-4 flex-1">
            {col.map((item, idx) => (
              <Card
                key={idx}
                className="rounded-[32px] max-md:w-full bg-[#e9e9e9] shadow-none border-1 border-[#0000000f]"
              >
                <CardBody className="p-3 max-md:p-2 max-lg:p-3">
                  <div className="w-full p-5 bg-white rounded-[24px] max-md:p-4 box-shadow">
                    <div className="flex flex-row items-center justify-between gap-4 max-md:gap-2">
                      <div className="flex flex-row gap-3 items-center">
                        <img
                          src={
                            item.profileImage
                              ? item.profileImage
                              : "https://res.cloudinary.com/damm9iwho/image/upload/v1731065510/Ellipse_1388_od4ab3.svg"
                          }
                          alt="Profile"
                          className="w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full"
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
                            src={item.logo}
                            alt="Logo"
                            className="max-w-[80px]"
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
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
