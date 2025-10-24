"use client";

import { Card, CardBody } from "@nextui-org/react";
import testimonials from "@/data/testimonials.json";
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
    <div>
      <section className="relative pt-16 md:pt-24 flex flex-col items-center text-center ">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Real Projects. Real Results.
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-gray-600 max-w-2xl reveal-text-anim ">
          See how we’ve helped startups, SaaS teams, and global brands turn
          ideas into fully functional digital products.
        </p>

        {/* Card Section */}
        <div className="relative flex justify-center items-center py-10 max-md:hidden">
          {testimonials.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className={`relative transition-transform duration-700 ease-in-out hover:scale-105`}
              style={{
                zIndex: 3 - index, // ensures first card stays on top
                marginLeft: index === 0 ? "0px" : "-75px", // ~25% overlap for 300px width
                transform:
                  index === 0
                    ? "rotate(-10deg)"
                    : index === 1
                    ? "rotate(10deg)"
                    : "rotate(20deg)",
                marginTop: index === 0 ? "0px" : index === 1 ? "-50px" : "50px",
              }}
            >
              <Card
                className="relative overflow-hidden w-[300px] h-[300px]"
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
                  className="relative z-0 flex flex-col items-center justify-center gap-4 p-6"
                  style={{
                    borderRadius: "38px",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <img
                    src={item.profileImage}
                    alt="testimonial"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <p className="line-clamp-5 text-center text-base text-[#777777]">
                    {item.review}
                  </p>
                  <div className="flex flex-row items-start gap-1">
                    <StarRating delay={300} />
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap justify-center items-center gap-10 text-center py-10">
          {/* Item 0 */}
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-bold text-black">6+</h3>
            <p className="text-lg  text-[#777777] w-fit text-center">
              countries served
            </p>
          </div>
          {/* Item 1 */}
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-bold text-black">50+</h3>
            <p className="text-lg  text-[#777777]">Countries Served</p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-bold text-black">20+</h3>
            <p className="text-lg  text-[#777777]">Projects Completed</p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-bold text-black">20+</h3>
            <p className="text-lg  text-[#777777]">Enterprise Clients</p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center">
            <h3 className="text-5xl font-bold text-black">9+</h3>
            <p className="text-lg  text-[#777777]">Years of Experience</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-start text-lg font-[500]">
            🧑‍💻 Direct access to your design + dev team
          </p>
          <p className="text-lg  font-[500]">
            💬 Clear communication and fast delivery cycles
          </p>
          <p className="text-start text-lg  font-[500]">
            🧩 Pixel-perfect execution that scales
          </p>
        </div>
      </section>
    </div>
  );
};

export default OurWorksHero;
