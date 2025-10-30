"use client";

const OptionalAdd = ({ data }: any) => {
  return (
    <div className=" pt-32 max-md:pt-24">
      <div className="autoShow">
        <div className="flex flex-row items-center justify-center mb-6">
          <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
            {data.badge}
          </span>
        </div>
        <p className="heading-center">{data.heading}</p>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 items-center">
        {/* Left Section */}
        <div className="flex flex-col gap-3 text-lg max-md:text-base space-y-2 max-md:py-6">
          {data.card.map((item: any, index: number) => (
            <p key={index} className="text-xl font-medium">
              {item.heading}
            </p>
          ))}
        </div>

        {/* Right Section (Carousel) */}

        <div className=" flex justify-end items-center">
          <div className="flex justify-center max-md:justify-center items-center relative w-[300px] h-[400px] min-h-[400px]">
            <img src={data.rightImg} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionalAdd;
