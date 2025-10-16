// import React from "react";

// const MarqueeComp = ({ items, reverse }: any) => {
//   return (
//     <div className="flex w-full overflow-hidden select-none">
//       <div
//         className={`flex animate-marquee ${reverse ? "animate-reverse" : ""}`}
//       >
//         {items.map((el: any, index: any) => (
//           <div
//             key={index}
//             className="grid place-items-center w-[clamp(10rem,1rem+30vmin,10rem)] p-[calc(clamp(10rem,1rem+30vmin,30rem)/10)]"
//           >
//             <img
//               src={el}
//               alt={`img-${index}`}
//               className=" h-[40px]  grayscale hover:grayscale-0 max-h-[40px] w-[100px] max-w-[100px]"
//             />
//           </div>
//         ))}
//       </div>
//       <div
//         className={`flex animate-marquee ${reverse ? "animate-reverse" : ""}`}
//       >
//         {items.map((el: any, index: any) => (
//           <div
//             key={index}
//             className="grid place-items-center w-[clamp(10rem,1rem+30vmin,10rem)] p-[calc(clamp(10rem,1rem+30vmin,30rem)/10)]"
//           >
//             <img
//               src={el}
//               alt={`img-${index}`}
//               className=" h-[40px]  grayscale hover:grayscale-0  max-h-[40px] w-[100px] max-w-[100px]"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MarqueeComp;

import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeComp = ({ items, reverse }: any) => {
  return (
    <>
      <Marquee speed={25} gradient gradientColor="#F5F5F5">
        <div className="flex flex-row gap-8">
          {items.map((el: any, index: any) => (
            <div
              key={index}
              className="grid place-items-center  p-[calc(clamp(10rem,1rem+30vmin,30rem)/10)]"
            >
              <img
                src={el}
                alt={`img-${index}`}
                className=" h-[32px]  grayscale hover:grayscale-0 max-h-[32px] "
              />
            </div>
          ))}
        </div>
      </Marquee>
    </>
  );
};

export default MarqueeComp;
