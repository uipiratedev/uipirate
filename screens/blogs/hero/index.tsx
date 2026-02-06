"use client";

interface BlogsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BlogsHero = ({ searchQuery, onSearchChange }: BlogsHeroProps) => {
  const meteors = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${-5 - Math.random() * 10}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${2 + Math.random() * 3}s`,
    drift: `${Math.random() * 80 - 40}px`,
  }));

  return (
    <div className="flex flex-row items-center justify-center py-12 w-full max-lg:py-10 max-md:py-8 relative">
      {/* === Static Gray Grid Background === */}
      <div className="absolute -mt-8 inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* === Meteors === */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {meteors.map((meteor) => (
          <span
            key={meteor.id}
            className="meteor absolute"
            style={
              {
                top: meteor.top,
                left: meteor.left,
                animationDelay: meteor.delay,
                animationDuration: meteor.duration,
                "--drift": meteor.drift,
              } as React.CSSProperties
            }
          >
            <div className="absolute w-[3px] h-[3px] -ml-[1px] rounded-full bg-black" />
            <div className="absolute top-0 left-0 w-[1.5px] h-[50px] -translate-y-full bg-gradient-to-b from-gray-200 via-gray-900 to-black opacity-70" />
          </span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

      <section className="w-full max-w-3xl flex flex-col items-center text-center px-4">
        {/* Badge */}
        <p className="text-[11px] md:text-xs font-semibold tracking-[0.25em] text-slate-500 uppercase mb-3">
          BLOGS
        </p>

        {/* Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
          <span className="text-slate-900">
            Insights, Stories &amp; Research for{" "}
          </span>
          <span className="text-[#FF5B04]">SaaS, Tech &amp; Design</span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-slate-500 max-w-2xl">
          Fresh ideas, research-backed insights, and real stories from our work
          and the community.
        </p>

        {/* Search */}
        <div className="mt-8 md:mt-10 w-full">
          <label className="sr-only" htmlFor="blog-search">
            Search blog topics
          </label>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 md:px-5 py-3.5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
            <svg
              aria-hidden="true"
              className="hidden md:block w-5 h-5 text-slate-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <input
              aria-label="Search blog topics"
              id="blog-search"
              type="search"
              placeholder="Search by topic, problem, or keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base"
            />

            {/* Static filter pill on the right */}
            <div className="pl-3 ml-1 border-l border-slate-200 flex-shrink-0">
              <button
                type="button"
                className="bg-[#FF5B04] text-white rounded-full h-9 md:h-10 px-4 text-[10px] md:text-xs font-semibold tracking-[0.18em] uppercase whitespace-nowrap"
              >
                BY PRODUCT / FEATURE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogsHero;
