"use client";
import LookingFor from "./lookingFor";
import ServicesCard from "./servicesCard";

const ServicesList = () => {
  return (
    <div className=" container mx-auto">
      <div>
        <ServicesCard />
        <LookingFor />
      </div>
    </div>
  );
};

export default ServicesList;
