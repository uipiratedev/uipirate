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

      {/* Cards with Straight Rope */}
      <div className="relative mx-auto px-4 md:px-0">
        
        {/* Mobile: Continuous Straight Vertical Rope on Left */}
        {/* Placed outside the row loop to be continuous across all items */}
        <div className="md:hidden absolute left-[23px] top-0 bottom-12 w-[3px] bg-[#FF5B04] z-0" />

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative mb-0 md:mb-12 last:mb-0">
            {/* Desktop: Straight Horizontal Rope */}
            <div className="hidden md:block absolute left-0 right-0 top-[6px] h-[3px] bg-[#FF5B04] z-0 rounded-full" />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 relative z-10 pt-1 md:pt-0 pb-4 md:pb-0">
              {row.map((card, cardIdx) => (
                <div key={card.index} className="flex md:flex-col items-start md:items-center relative">
                  
                  {/* Clip/Knot Section - Desktop (Two Knots) */}
                  <div className="hidden md:flex justify-between w-full px-12 absolute -top-1 z-20">
                     {/* Left Knot */}
                     <div className="flex flex-col items-center">
                        <div className="w-[11px] h-8 bg-[#FF5B04] rounded-full z-30 knot-shadow-orange" />
                        <div className="w-4 h-4 -mt-3 bg-[#F7F7F7] rounded-full ring-2 ring-white z-20 knot-shadow-white" />
                     </div>
                     {/* Right Knot */}
                     <div className="flex flex-col items-center">
                         <div className="w-[11px] h-8 bg-[#FF5B04] rounded-full z-30 knot-shadow-orange" />
                         <div className="w-4 h-4 -mt-3 bg-[#F7F7F7] rounded-full ring-2 ring-white z-20 knot-shadow-white" />
                     </div>
                  </div>

                  {/* Clip/Knot Section - Mobile (Two Knots on Left) */}
                  <div className="md:hidden">
                    {/* Top Knot */}
                    <div className="absolute z-20 top-[35px] left-[5px]">
                      <div className="relative flex flex-row items-center">
                         <div className="w-8 h-[11px] bg-[#FF5B04] rounded-full z-30 knot-shadow-orange" />
                         <div className="w-4 h-4 bg-[#F7F7F7] rounded-full -ml-3 ring-2 ring-white z-10 knot-shadow-white" />
                      </div>
                      <div className="h-[2px] w-6 bg-[#FF5B04] absolute left-4 top-1/2 -translate-y-1/2 -z-10" />
                    </div>
                    {/* Bottom Knot */}
                    <div className="absolute z-20 bottom-[35px] left-[5px]">
                      <div className="relative flex flex-row items-center">
                         <div className="w-8 h-[11px] bg-[#FF5B04] rounded-full z-40 knot-shadow-orange" />
                         <div className="w-4 h-4 bg-[#F7F7F7] -ml-3 rounded-full ring-2 ring-white z-20 knot-shadow-white" />
                      </div>
                      <div className="h-[2px] w-6 bg-[#FF5B04] absolute left-4 top-1/2 -translate-y-1/2 -z-10" />
                    </div>
                  </div>

                  {/* Card Container */}
                  <div className="w-full pl-7 md:pl-0 md:mt-4">
                    <div className="bg-white rounded-[18px] pt-5 pb-6 px-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)] border border-gray-100 w-full hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)] transition-all duration-300 group relative z-10">
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
