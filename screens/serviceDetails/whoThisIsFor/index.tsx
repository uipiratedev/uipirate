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
    <section>
      {/* Header */}
      <div className="autoShow text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center mb-6">
          <GlassBadge variant="gradient">{data.badge}</GlassBadge>
        </div>
        <h2 className="heading-center">
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
              <img
                src={item.image}
                alt={item.heading}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-[150px] h-auto"
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-6 py-6 md:px-7 md:py-7">
              <h3 className="text-[17px] md:text-[19px] font-semibold text-black leading-snug uppercase tracking-[0.06em]">
                {item.heading}
              </h3>
              <p className="mt-2 text-sm md:text-[15px] text-[#64748B] leading-relaxed">
                {item.description}
              </p>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoThisIsFor;
