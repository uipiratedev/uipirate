import React, { useState } from "react";
import { Tabs, Tab } from "@heroui/react";

import OurPricingCard from "./ourPricingCard";

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
      <div className="container mx-auto xl:px-40 2xl:px-48 max-md:px-4  pt-0 max-md:pt-0  max-xl:px-4 max-2xl:px-0">
      

        <div className="flex w-full flex-col items-center justify-center">
          {/* Centered Sticky Tabs */}
          <div className="sticky top-[4.5rem] max-md:top-[4.2rem] z-10 w-full flex justify-center md:px-[25rem] mx-auto">
            <Tabs
              aria-label="Dynamic tabs"
              className="pricing-tabs"
              classNames={{
                cursor: "bg-black text-black",
                tab: "px-12 mx-[25rem] mx-auto",
                tabContent:
                  "group-data-[selected=true]:text-white text-black font-[700]",
              }}
              items={tabs}
              selectedKey={activeTab} // Control active tab
              onSelectionChange={(key: any) => setActiveTab(key)} // Update activeTab on selection
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
