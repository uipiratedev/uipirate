"use client";

interface FaqsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FaqsHero = ({ searchQuery, onSearchChange }: FaqsHeroProps) => {
  return (
    <div>
      <section className="relative pt-16 md:pt-24 flex flex-col items-center text-center ">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Have questions?
        </h1>

        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          We've got you!
        </h1>

        {/* Search Input */}
        <div className="mt-12 flex flex-row items-center justify-center max-lg:flex-col w-full">
          <div className="w-full max-w-3xl relative">
            <input
              type="text"
              placeholder="Search an topic..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqsHero;
