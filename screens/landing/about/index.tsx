import AboutCardAnimation from "./aboutCard";

import SectionHeader from "@/components/SectionHeader";
import { Reveal } from "@/components/motion";

const LandingAbout = () => {
  return (
    <section className="relative">
      <div className="section-container">
        {/* Sticky headline — pinned while the stat cards scroll past it
            (desktop only). Its ancestors must stay overflow:visible for
            sticky to track the viewport, so the horizontal clip that the
            card entrance needs lives on the cards' own wrapper below. */}
        <div className="lg:sticky lg:top-24 lg:z-10">
          <Reveal variant="up">
            <SectionHeader chip="Our journey so far">
              What We{" "}
              <span className="text-brand-orange"> Design, Build, & Scale</span>
            </SectionHeader>
          </Reveal>
        </div>
      </div>
      <div className="section-container overflow-x-hidden">
        <AboutCardAnimation />
      </div>
    </section>
  );
};

export default LandingAbout;
