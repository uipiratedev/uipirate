import GlassBadge from "@/components/GlassBadge";

const patternBackgrounds = [
  // Soft green diagonal stripes
  "bg-[repeating-linear-gradient(135deg,#E4F7E9,#E4F7E9_12px,#F7FFF9_12px,#F7FFF9_24px)]",
  // Soft yellow diagonal stripes
  "bg-[repeating-linear-gradient(135deg,#FFF1C9,#FFF1C9_12px,#FFFBEA_12px,#FFFBEA_24px)]",
  // Soft purple diagonal stripes
  "bg-[repeating-linear-gradient(135deg,#EDE8FF,#EDE8FF_12px,#F7F5FF_12px,#F7F5FF_24px)]",
];

const WhoThisIsFor = ({ data }: any) => {
  return (
    <section className="pt-24 max-md:pt-20">
      {/* Header */}
      <div className="autoShow text-center mb-10 md:mb-14">
        <div className="flex items-center justify-center mb-4">
          <GlassBadge variant="gradient">{data.badge}</GlassBadge>
        </div>
        <h2 className="text-3xl md:text-[34px] font-bold text-black">
          {data.heading}
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
        {data.card?.map((item: any, index: number) => (
          <div
            key={index}
            className="group flex h-full flex-col overflow-hidden rounded-[20px] max-md:rounded-[12px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-[#0000000f]"
          >
            {/* Illustration / pattern area */}
            <div
              className={`relative h-44 md:h-52 ${
                patternBackgrounds[index % patternBackgrounds.length]
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0,#ffffff,transparent_55%)] opacity-60" />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-6 py-6 md:px-7 md:py-7">
              <h3 className="text-[17px] md:text-[19px] font-semibold text-black leading-snug uppercase tracking-[0.06em]">
                {item.heading}
              </h3>
              <p className="mt-2 text-sm md:text-[15px] text-[#64748B] leading-relaxed">
                {item.description}
              </p>

              {item.QuickWins && item.QuickWins.length > 0 && (
                <ul className="mt-4 space-y-1.5 text-xs md:text-sm text-[#6B7280] text-left">
                  {item.QuickWins.map((quickWin: string, qIndex: number) => (
                    <li key={qIndex} className="flex items-start gap-2">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#FF5B04]" />
                      <span>{quickWin}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoThisIsFor;
