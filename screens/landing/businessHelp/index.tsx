import ServicesSection from "./servicesSection";
const LandingBusinessHelp = () => {
  return (
    <>
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6">
            <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
              Services
            </span>
          </div>
          <h2 className="heading-center">What We Design, Build, & Scale</h2>
          <div className="flex flex-row items-center justify-center mb-12 mt-3 px-28 max-lg:px-32 max-md:px-3">
            <p className="md:w-3/4 text-center content-center font-[500] leading-[25.2px]">
              From high-performing SaaS apps to scalable design systems, we help
              founders and product teams ship clean, conversion-driven
              experiences — faster.
            </p>
          </div>
        </div>
        {/* <PricingCard /> */}
        <ServicesSection />
      </div>
    </>
  );
};

export default LandingBusinessHelp;
