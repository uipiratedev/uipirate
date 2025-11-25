"use client";
import TryBeforeCommit from "../pricing/tryBeforeCommit";
import ServiceHero from "./hero";
import ServicesList from "./servicesList";
import WhatWeProvide from "./whatWeProvide";

import PageWrapper from "@/components/PageWrapper";

const Service = () => {
  return (
    <PageWrapper showFloatingButton={false}>
      <div className="container mx-auto xl:px-32 max-md:px-4 max-xl:px-4 max-2xl:px-0 mb-12">
        <ServiceHero />
        <ServicesList />
        <WhatWeProvide />
        <TryBeforeCommit />
      </div>
    </PageWrapper>
  );
};

export default Service;
