import TeamHero from "./hero";
import OurValues from "./ourValues";
import TeamCulture from "./teamCulture";
import Teams from "./teams";
import WhatWeProvideOurTeam from "./whatWeProvide";

import PageWrapper from "@/components/PageWrapper";

const OurTeams = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0">
        <TeamHero />
        <Teams />
        <WhatWeProvideOurTeam />
        <OurValues />
        <TeamCulture />
      </div>
    </PageWrapper>
  );
};

export default OurTeams;
