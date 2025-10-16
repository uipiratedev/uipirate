import React, { useState } from "react";
import OurPricingCard from "./ourPricingCard";
import { Tabs, Tab } from "@nextui-org/react";

const LandingOurPricing = () => {
  const [activeTab, setActiveTab] = useState("Hourly"); // Track active tab

  const tabs = [
    {
      id: "Hourly",
      label: "Hourly",
    },
    {
      id: "Fixed",
      label: "Fixed",
    },
  ];

  return (
    <>
      <div className="container mx-auto xl:px-40 2xl:px-48 max-md:px-4  pt-32 max-md:pt-24  max-xl:px-4 max-2xl:px-0">
        <div className="autoShow">
          <div className="flex flex-row items-center justify-center mb-6">
            <span className="bg-[#8EF1F1] px-4 py-2 rounded-xl font-semibold uppercase border-cyan-400 border-2">
              pricing
            </span>
          </div>
          <p className="heading-center">
            Transparent Pricing for Design & Development
          </p>
          <div className="flex flex-row items-center justify-center mb-8 mt-3 px-28 max-lg:px-32 max-md:px-3 max-xl:px-32">
            <p className="md:w-1/2 text-center content-center font-[500]">
              Choose between fixed or hourly rates, with the flexibility to mix
              design-only, dev-only, or full-service execution — tailored to
              your scope.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          {/* Centered Sticky Tabs */}
          <div className="sticky top-[4.5rem] max-md:top-[3.7rem] z-10 w-full flex justify-center md:px-[25rem] mx-auto">
            <Tabs
              aria-label="Dynamic tabs"
              items={tabs}
              selectedKey={activeTab} // Control active tab
              onSelectionChange={(key: any) => setActiveTab(key)} // Update activeTab on selection
              classNames={{
                cursor: "bg-black text-black",
                tab: "px-12 mx-[25rem] mx-auto",
                tabContent:
                  "group-data-[selected=true]:text-white text-black font-[700]",
              }}
              className="pricing-tabs"
            >
              {(item) => <Tab key={item.id} title={item.label} />}
            </Tabs>
          </div>

          {/* Conditionally Render Tab Content */}
          <div className="mt-6 w-full">
            <OurPricingCard id={activeTab} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingOurPricing;
