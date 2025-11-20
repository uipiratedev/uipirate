import CardAnimation from "./cardAnimation";
const OurValues = () => {
  return (
    <>
      <div className="pt-32 max-md:pt-24 ">
        <div className="autoShow">
          <div className="flex flex-row  items-center justify-center mb-6 ">
            <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold border-cyan-400 border-2">
              ABOUT US
            </span>
          </div>
          <h2 className="heading-center">What We Stand For</h2>
        </div>
      </div>{" "}
      <div className="" style={{ overflowX: "hidden" }}>
        <CardAnimation />
      </div>
    </>
  );
};

export default OurValues;
