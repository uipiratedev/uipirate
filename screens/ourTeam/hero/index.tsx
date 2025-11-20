const TeamHero = ({ data: _data }: any) => {
  return (
    <div>
      <section className="relative pt-16 md:pt-20 flex flex-col items-center text-center ">
        {/* Badge Text */}

        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          Meet the People Behind
        </h1>
        <h1 className="text-3xl md:text-5xl font-bold leading-snug max-w-4xl mb-4 reveal-text-anim ">
          UiPirate
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-base text-gray-600 max-w-3xl reveal-text-anim ">
          We’re a small, battle-tested team of designers, developers, and
          creatives helping SaaS, AI, and modern tech companies ship better
          product experiences. From user flows to final code, we’ve got every
          pixel covered.
        </p>
      </section>
    </div>
  );
};

export default TeamHero;
