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

  // Rope Curve Math: Y = 10 + 120 * t * (1 - t) 
  const getRopeParam = (colIndex: number, localT: number) => {
    const cardWidthT = 1 / 3;
    return colIndex * cardWidthT + localT * cardWidthT;
  };

  const getRopeY = (t: number) => 10 + 140 * t * (1 - t);
  const getRopeSlope = (t: number) => 140 * (1 - 2 * t); // Derivative for rotation

  // Knot positions relative to card width
  const knotPositions = [0.15, 0.85]; 

  const getKnotStyle = (colIndex: number, knotIdx: number) => {
    const t = getRopeParam(colIndex, knotPositions[knotIdx]);
    const ropeY = getRopeY(t);
    const cardCenterT = getRopeParam(colIndex, 0.5);
    const cardY = getRopeY(cardCenterT);
    const slope = getRopeSlope(t);
    const angle = (Math.atan(slope / 400) * 180) / Math.PI; 
    
    return {
      top: `${ropeY - cardY - 4}px`,
      transform: `rotate(${angle}deg)`,
    };
  };

  const getCardRotationClass = (colIndex: number) => {
    if (colIndex === 0) return "lg:rotate-[3deg]";
    if (colIndex === 2) return "lg:rotate-[-4deg]";
    return "";
  };

  const getCardStyle = (colIndex: number) => {
    const t = getRopeParam(colIndex, 0.5);
    const yOffset = getRopeY(t);
    return {
      marginTop: `${yOffset - 8}px`,
    };
  };

  return (
    <div className="pt-6 overflow-hidden">
      {/* Header */}
      <div className="autoShow text-center mb-12">
        <div className="flex flex-row items-center justify-center mb-6">
          <GlassBadge variant="gradient">{data.badge}</GlassBadge>
        </div>
        <h2 className="heading-center">
          How We Work
        </h2>
      </div>

      {/* Cards Section */}
      <div className="relative mx-auto max-md:mb-4">
        
        {/* Mobile: Continuous Straight Vertical Rope on Left */}
        <div className="md:hidden absolute left-[23px] top-0 bottom-12 w-[3px] bg-[#FF5B04] z-0" />

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative mb-0 md:mb-32 last:mb-0 max-md:mt-10">
            {/* Desktop: Curved Horizontal Rope with Texture */}
            <div className="hidden md:block absolute left-0 right-0 top-[-10px] h-[100px] z-0 opacity-100 pointer-events-none">
               <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
                  {/* Outer Rope Blur */}
                  <path d="M0 15 Q 600 85 1200 15" fill="none" stroke="#FF5B04" strokeWidth="4" className="opacity-20 translate-y-1 blur-[2px]" />
                  {/* Main Rope */}
                  <path d="M0 15 Q 600 85 1200 15" fill="none" stroke="#FF5B04" strokeWidth="3" strokeLinecap="round" />
                  {/* Rope Texture (Dashed line for twisted look) */}
                  <path d="M0 15 Q 600 85 1200 15" fill="none" stroke="white" strokeWidth="1" strokeDasharray="3,6" className="opacity-30" />
               </svg>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 container gap-10 md:gap-12 relative z-10 pt-1 md:pt-0 mx-auto xl:px-24 md:mb-32">
              {row.map((card, colIdx) => (
                <div 
                  key={card.index} 
                  className="flex md:flex-col items-start md:items-center relative transition-all duration-700 h-full group/unit md:mt-[var(--rope-offset)]"
                  style={{ '--rope-offset': getCardStyle(colIdx).marginTop } as any}
                >
                  
                  {/* Swing Wrapper - Now only wraps the card to exclude knots from animation */}
                  <div className="w-full h-full relative px-4 pl-8">
                    
                    {/* Clip/Knot Section - Desktop (Fixed) */}
                    <div className="hidden md:block absolute inset-x-0 z-20 pointer-events-none">
                       {/* Left Knot */}
                       <div className="absolute left-[15%] flex flex-col items-center" style={getKnotStyle(colIdx, 0)}>
                          <div className="w-[10px] h-7 bg-[#FF5B04] rounded-full z-30 knot-shadow-orange" />
                          <div className="w-3.5 h-3.5 -mt-3 bg-[#F7F7F7] rounded-full ring-2 ring-white z-20 knot-shadow-white" />
                       </div>
                       {/* Right Knot */}
                       <div className="absolute right-[15%] flex flex-col items-center" style={getKnotStyle(colIdx, 1)}>
                          <div className="w-[10px] h-7 bg-[#FF5B04] rounded-full z-30 knot-shadow-orange" />
                          <div className="w-3.5 h-3.5 -mt-3 bg-[#F7F7F7] rounded-full ring-2 ring-white z-20 knot-shadow-white" />
                       </div>
                    </div>

                    {/* Clip/Knot Section - Mobile (Fixed - Single knot as per original) */}
                    <div className="md:hidden absolute z-20 top-[40px] left-[10px]">
                      <div className="relative flex flex-row items-center">
                         <div className="w-8 h-[11px] bg-[#FF5B04] rounded-full z-30 knot-shadow-orange" />
                         <div className="w-4 h-4 bg-[#F7F7F7] rounded-full -ml-3 ring-2 ring-white z-10 knot-shadow-white" />
                      </div>
                    </div>
                     <div className="md:hidden absolute z-20 bottom-[40px] left-[10px]">
                      <div className="relative flex flex-row items-center">
                         <div className="w-8 h-[11px] bg-[#FF5B04] rounded-full z-30 knot-shadow-orange" />
                         <div className="w-4 h-4 bg-[#F7F7F7] rounded-full -ml-3 ring-2 ring-white z-10 knot-shadow-white" />
                      </div>
                    </div>

                    {/* Static Rotation Wrapper - Handles the 5/-6 degree tilt */}
                    <div className={`w-full origin-top ${getCardRotationClass(colIdx)}`}>
                      {/* Card Container - Now sways relative to the tilted wrapper */}
                      <div className="w-full md:mt-4 h-full flex flex-col rounded-[32px] p-2 md:pt-14 max-md:pl-8 transition-transform duration-500 hover-swing-card origin-top"
                        style={{boxShadow: "0px 3px 15px 3px #FFC8DC"}}
                      >
                        <div className="bg-[#F2F3F5] rounded-[24px] pt-5 pb-6 px-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)] border border-gray-100 w-full hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)] transition-all duration-300 group relative z-10 h-full flex flex-col"
                          style={{boxShadow: "0px -1px 1px 0px #0000001A inset"}}
                        >
                          {/* Card Number */}
                          <span className="text-[44px] md:text-[52px] font-semibold text-gray-200 leading-none mb-4 block group-hover:text-orange-500 transition-colors">
                            {String(card.index).padStart(2)}
                          </span>

                          {/* Card Content */}
                          <h3 className="text-[18px] md:text-[19px] font-semibold text-black mb-2 group-hover:text-orange-500 transition-colors">
                            {card.heading}
                          </h3>
                          <p className="text-[13px] md:text-[14px] text-gray-500 group-hover:text-gray-800 transition-colors leading-relaxed flex-grow">
                            {card.description}
                          </p>
                        </div>
                      </div>
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
