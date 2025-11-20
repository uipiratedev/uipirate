"use client";
import { Card, CardBody } from "@nextui-org/react";
const WhatWeProvide = ({ data }: any) => {
  return (
    <div className=" pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-4">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            {data.badge}
          </span>
        </div>
        <p className="heading-center"> {data.heading}</p>
      </div>

      {/* card  */}
      <div className="grid grid-cols-3 max-md:grid-cols-1 max-lg:grid-cols-2 gap-4 max-md:gap-4 mt-12">
        {data.card.map((item: any, index: number) => {
          return (
            <div key={index}>
              <Card className="rounded-[32px] max-md:w-full bg-[#e9e9e9] shadow-none border-1 border-[#0000000f]">
                <CardBody className="p-2 max-md:p-2 max-lg:p-3">
                  <div className="w-full p-6  bg-white rounded-[24px] max-md:p-4 box-shadow">
                    <div className="flex flex-row items-center justify-center gap-4 max-md:gap-2 mb-4">
                      <img
                        alt="Profile"
                        className="w-[162px] h-[162px] min-w-[162px] min-h-[162px]"
                        src={
                          item.img
                            ? item.img
                            : "https://res.cloudinary.com/damm9iwho/image/upload/v1731065510/Ellipse_1388_od4ab3.svg"
                        }
                      />
                    </div>
                    <p className="text-xl max-md:text-base font-[700]">
                      {item.heading}
                    </p>
                    <p className="text-base max-md:text-base font-[500] text-[#777777]  py-2">
                      {item.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhatWeProvide;
