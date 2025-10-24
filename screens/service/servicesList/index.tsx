"use client";
import PricingCard from "@/screens/landing/businessHelp/pricingCard";
import LookingFor from "./lookingFor";
import ServicesCard from "./servicesCard";

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
