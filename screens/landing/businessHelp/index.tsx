import PricingCard from "./pricingCard";
const LandingBusinessHelp = () => {
  return (
    <>
      <div className=" container mx-auto lg:px-12 max-md:px-4  pt-32 max-md:pt-24 ">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6">
            <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
              Services
            </span>
          </div>
          <h2 className="heading-center">What We Design, Build, & Scale</h2>
          <div className="flex flex-row items-center justify-center mb-12 mt-3 px-28 max-lg:px-32 max-md:px-3">
            <p className="md:w-1/2 text-center content-center font-[500] leading-[25.2px]">
              From high-performing SaaS apps to scalable design systems, we help
              founders and product teams ship clean, conversion-driven
              experiences — faster.
            </p>
          </div>
        </div>
        <PricingCard />
      </div>
    </>
  );
};

export default LandingBusinessHelp;
