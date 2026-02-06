import GlassBadge from "@/components/GlassBadge";

const StreamlinedProcess = ({ data }: any) => {
  // Flatten all workflow cards into a single array with index numbers
  const allCards: { heading: string; description: string; index: number }[] =
    [];
  let cardIndex = 1;

  data.workflow.forEach((workflow: any) => {
    workflow.card.forEach((card: any) => {
      allCards.push({
        heading: card.heading,
        description: card.description,
        index: cardIndex++,
      });
    });
  });

  // Use only the first 6 steps to match the design (2 rows of 3 cards)
  const displayCards = allCards.slice(0, 6);

  // Split cards into rows of 3 for the rope effect
  const rows: (typeof allCards)[] = [];
  for (let i = 0; i < displayCards.length; i += 3) {
    rows.push(displayCards.slice(i, i + 3));
  }

  // Slight pseudo-random rotation for each card to simulate natural hanging
  const getCardRotation = (cardIndex: number): string => {
    const rotations = [
      "-2deg",
      "1.3deg",
      "-1.1deg",
      "1.7deg",
      "-1.6deg",
      "0.9deg",
    ];
    return rotations[(cardIndex - 1) % rotations.length];
  };

  // Subtle vertical offsets so cards visually follow the rope curve on large screens
  const getCardVerticalOffsetClass = (colIndex: number): string => {
    if (colIndex === 0) return "lg:-mt-2"; // left card slightly higher
    if (colIndex === 1) return "lg:mt-4"; // middle card lowest
    if (colIndex === 2) return "lg:-mt-2"; // right card slightly higher
    return "";
  };

  return (
    <div className="pt-32 max-md:pt-24 overflow-hidden">
      {/* Header */}
      <div className="autoShow text-center mb-16">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient">{data.badge}</GlassBadge>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-black">
          How We Work
        </h2>
      </div>

      {/* Cards with Rope */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-0">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative mb-8 md:mb-4">
            {/* Orange Rope */}
            <svg
              className="pointer-events-none absolute left-0 right-0 top-4 h-9 w-full z-0"
              viewBox="0 0 300 30"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="ropeGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#FF5B04" />
                  <stop offset="50%" stopColor="#FF7B3A" />
                  <stop offset="100%" stopColor="#FF5B04" />
                </linearGradient>
              </defs>
              {/* Single smooth sagging rope across the full width (deeper curve) */}
              <path
                d="M0,5 C75,16 225,16 300,5"
                stroke="url(#ropeGradient)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
              {row.map((card, cardIdx) => (
                <div
                  key={card.index}
                  className={`flex flex-col items-center ${getCardVerticalOffsetClass(
                    cardIdx,
                  )}`}
                >
                  {/* Orange Clip */}
                  <div
                    className="flex flex-col items-center -mb-3 z-20"
                    style={{
                      transform: `rotate(${getCardRotation(card.index)})`,
                      transformOrigin: "top center",
                    }}
                  >
                    <div className="w-3 h-3 bg-[#FF5B04] rounded-full shadow-md" />
                    <div className="w-[2px] h-5 bg-[#FF5B04]" />
                    {/* Card */}
                    <div className="bg-white rounded-[18px] pt-5 pb-6 px-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)] border border-gray-100 w-full hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)] transition-all duration-300 group">
                      {/* Card Number */}
                      <span className="text-[44px] md:text-[52px] font-semibold text-gray-200 leading-none mb-4 block">
                        {String(card.index).padStart(2, "0")}
                      </span>

                      {/* Card Content */}
                      <h3 className="text-[18px] md:text-[19px] font-semibold text-black mb-2 group-hover:text-[#FF5B04] transition-colors">
                        {card.heading}
                      </h3>
                      <p className="text-[13px] md:text-[14px] text-gray-500 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamlinedProcess;
