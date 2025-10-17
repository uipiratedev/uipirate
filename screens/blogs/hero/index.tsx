"use client";
const BlogsHero = ({ data }: any) => {
  return (
    <div>
      <section className="relative pt-16 md:pt-20 flex flex-col items-center text-center ">
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
            BLOGS
          </p>
        </div>
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-3 reveal-text-anim ">
          Insights, Stories & Research
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          for SaaS, Tech, and Design
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-base text-gray-600 max-w-3xl reveal-text-anim ">
          Real-world lessons, research-backed insights, and opinions from our
          work and the community
        </p>

        {/* search section */}
        <div className="mt-12 flex flex-row items-center justify-center max-lg:flex-col w-full">
          <div className="w-full max-w-3xl relative">
            <input
              type="text"
              placeholder="Search a topic..."
              className="w-full px-6 py-4 rounded-full border border-gray-300 bg-[#F7F7F7] focus:outline-none focus:border-blue-500 pr-12"
            />
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-400 absolute right-6 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsHero;
