"use client";

const PricingHero = () => {
  return (
    <div className="flex flex-row items-center justify-center py-12 w-full max-lg:py-10 max-md:py-6 container mx-auto max-md:px-2">
      <section className="relative flex flex-col items-center text-center ">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold max-md:mb-2 leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Transparent Pricing for
        </h1>

        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Design & Development
        </h1>
        {/* Subheading */}
        <p className="reveal-text-anim-1 lg:w-3/4 text-center text-lg max-md:text-sm mb-8 px-40 max-md:px-4 font-sans leading-[25.2px]">
          Choose between fixed or hourly rates, with the flexibility to mix
          design-only, dev-only, or full-service execution, tailored to your
          scope.
        </p>
      </section>
    </div>
  );
};

export default PricingHero;
