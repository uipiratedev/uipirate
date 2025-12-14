import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeComp = ({ items }: any) => {
  return (
    <>
      <Marquee gradient gradientColor="#F7F7F7" speed={25}>
        <div className="flex flex-row gap-8">
          {items.map((el: any, index: any) => (
            <div
              key={index}
              className="grid place-items-center  p-[calc(clamp(10rem,1rem+30vmin,30rem)/10)]"
            >
              <img
                alt={`img-${index}`}
                className=" h-[32px]  grayscale hover:grayscale-0 max-h-[32px] "
                loading="lazy"
                src={el}
              />
            </div>
          ))}
        </div>
      </Marquee>
    </>
  );
};

export default MarqueeComp;
