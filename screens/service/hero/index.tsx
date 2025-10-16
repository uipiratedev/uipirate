"use client";

const ServiceHero = () => {
  return (
    <div>
      <section className="relative pt-16 md:pt-24 flex flex-col items-center text-center ">
        {/* Floating Icons */}
        <div className="flex justify-center items-center gap-6 mb-6 relative z-10">
          <img
            src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1760602433/heroimg1_mhagbz.svg"
            alt="icon1"
            className="w-16 md:w-32"
          />
          <img src="/icons/icon2.png" alt="icon2" className="w-16 md:w-32" />
          <img src="/icons/icon3.png" alt="icon3" className="w-16 md:w-32" />
          <img
            src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1760602434/heroimg4_ffm4ip.svg"
            alt="icon4"
            className="w-16 md:w-32"
          />
          <img
            src="https://res.cloudinary.com/dvk9ttiym/image/upload/v1760602415/heroimg5_dolrel.svg"
            alt="icon5"
            className="w-16 md:w-32"
          />
        </div>

        {/* Badge Text */}

        <div
          className="p-2 px-4 rounded-xl bg-[#8EF1F1] border-cyan-400 border-2 mb-6"
          style={{
            animation: "trustBadgeUp 0.5s ease-out forwards",
            animationDelay: "0.1s",
            opacity: 0,
            transform: "translateY(20px) scale(0.95)",
          }}
        >
          <p className="text-center uppercase text-xs max-md:text-[10px] font-medium">
            7 CORE SERVICES. 1 SEAMLESS WORKFLOW
          </p>
        </div>
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Design + Development Services for SaaS, Tech & AI Products
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-gray-600 max-w-2xl reveal-text-anim ">
          Scalable design, clean code, and polished visuals, all under one roof.
        </p>
      </section>
    </div>
  );
};

export default ServiceHero;
