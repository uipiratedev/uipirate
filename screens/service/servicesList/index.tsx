import LookingFor from "./lookingFor";

import PricingCard from "@/screens/landing/businessHelp/pricingCard";

const ServicesList = () => {
  return (
    <div className=" container mx-auto">
      <div>
        {/* <ServicesCard /> */}
        <PricingCard />

        <LookingFor />
      </div>
    </div>
  );
};

export default ServicesList;
