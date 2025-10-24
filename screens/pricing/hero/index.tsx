"use client";

const PricingHero = () => {
  return (
    <div>
      <section className="relative pt-16 md:pt-24 flex flex-col items-center text-center ">
        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Transparent Pricing for
        </h1>

        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Design & Development
        </h1>
        {/* Subheading */}
        <p className="text-base md:text-lg text-gray-600 max-w-2xl reveal-text-anim ">
          Choose between fixed or hourly rates, with the flexibility to mix
          design-only, dev-only, or full-service execution, tailored to your
          scope.
        </p>
      </section>
    </div>
  );
};

export default PricingHero;
