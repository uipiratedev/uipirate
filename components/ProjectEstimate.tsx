"use client";

import { useState } from "react";
import { Card, CardBody, Button, Input, Select, SelectItem, Chip, Tabs, Tab } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@/components/icons";
import LetsTalkButton from "@/components/LetsTalkButton";

interface ProjectEstimateProps {
  cardVariants?: any;
}

// Country codes
const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
];

// Step 2: Project Types
const projectTypes = [
  "SaaS Web App",
  "Mobile App",
  "Dashboard / Admin Panel",
  "Landing Page",
  "Business Website",
  "Portfolio / Personal Site",
  "Graphic Design",
  "Branding & Visual Identity",
  "Motion Graphics",
  "Infographics & Presentation",
  "3D Assets",
  "UX Audit & Consultation",
];

// Step 2: Requirements
const requirements = ["Design/Redesign", "Development", "Both"];

// Step 3: Priorities (max 2 selections)
const priorities = [
  {
    id: "fast",
    name: "Fast",
    description: "Quicker delivery, premium cost, fewer revisions",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770194732/flash_fkboaf.svg",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Quality work, polished delivery, extended timeline",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770194732/premium_lnvvxn.svg",
  },
  {
    id: "budget",
    name: "Budget-friendly",
    description: "Slower timeline, limited scope",
    icon: "https://res.cloudinary.com/dvk9ttiym/image/upload/v1770194732/budget_giilnt.svg",
  },
];

export const ProjectEstimate = ({ cardVariants }: ProjectEstimateProps) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = initial, 1-3 = steps
  
  // Step 1 data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  
  // Step 2 data
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<string>("");
  
  // Step 3 data
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(["fast", "premium"]);

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setName("");
    setEmail("");
    setPhone("");
    setSelectedProjectTypes([]);
    setSelectedRequirement("");
    setSelectedPriorities(["fast", "premium"]);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleProjectType = (type: string) => {
    setSelectedProjectTypes([type]);
  };

  const togglePriority = (priorityId: string) => {
    setSelectedPriorities(prev => {
      // If already selected, replace current with the one not selected
      if (prev.includes(priorityId)) {
        const allOptions = ["fast", "premium", "budget"];
        const unselected = allOptions.find(opt => !prev.includes(opt));
        const remaining = prev.filter(id => id !== priorityId);
        // Ensure we always have 2 (if unselected exists)
        return unselected ? [...remaining, unselected] : prev;
      }
      
      // If less than 2 selected (shouldn't happen with new logic but for safety), add it
      if (prev.length < 2) {
        return [...prev, priorityId];
      }
      
      // If 2 already selected, replace the first one with the new one
      return [prev[1], priorityId];
    });
  };

  const getCalculatedEstimate = () => {
    const hasFast = selectedPriorities.includes("fast");
    const hasPremium = selectedPriorities.includes("premium");
    const hasBudget = selectedPriorities.includes("budget");

    if (hasFast && hasBudget) return { isInvalid: true, budget: "", timeline: "" };

    let budget = "$2.5K-3K";
    let timeline = "3-4 Weeks";

    if (hasPremium && hasBudget) {
      budget = "$2K-2.5K";
      timeline = "5-6 Weeks";
    } else if (hasFast && hasPremium) {
      budget = "$2.5K-3K";
      timeline = "3-4 Weeks";
    } else if (hasBudget) {
      budget = "$1.5K-2K";
      timeline = "6-8 Weeks";
    } else if (hasFast) {
      budget = "$3K-4K";
      timeline = "2-3 Weeks";
    } else if (hasPremium) {
      budget = "$4K-6K";
      timeline = "4-6 Weeks";
    }
    return { budget, timeline, isInvalid: false };
  };

  const handleWhatsAppRedirect = () => {
    const estimate = getCalculatedEstimate();
    const projectTypesList = selectedProjectTypes.join(", ");
    const prioritiesList = selectedPriorities.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(", ");
    
    const message = encodeURIComponent(
      `*Hey UI Pirate! I just completed the Project Estimator*%0A%0A` +
      `*My Details:*%0A` +
      `• Name: ${name}%0A` +
      `• Email: ${email}%0A` +
      `• Phone: ${countryCode} ${phone}%0A%0A` +
      `*Project Info:*%0A` +
      `• Building: ${projectTypesList}%0A` +
      `• Requirement: ${selectedRequirement}%0A` +
      `• Priorities: ${prioritiesList}%0A%0A` +
      `*Rough Estimate Received:*%0A` +
      `${estimate.isInvalid ? "_Invalid Combination (Fast + Budget)_" : `• Budget: ${estimate.budget}%0A• Timeline: ${estimate.timeline}`}%0A%0A` +
      `I'd like to get a more detailed quote!`
    );

    // Using the provided wa.link and appending the text parameter
    window.open(`https://wa.link/i35lma?text=${message}`, "_blank");
  };

  const canProceed = () => {
    if (currentStep === 1) return name && email && phone;
    if (currentStep === 2) return selectedProjectTypes.length > 0 && selectedRequirement;
    if (currentStep === 3) return selectedPriorities.length > 0;
    return false;
  };

  return (
    <Card className="rounded-[20px] max-md:rounded-[12px] bg-white border-1 border-gray-200 shadow-sm h-full">
      <CardBody className="p-8 max-md:p-6">
        {/* @ts-ignore */}
        <AnimatePresence mode="wait">
          {/* Initial State */}
          {currentStep === 0 && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src="/assets/gif/filter.gif" alt="" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl max-md:text-2xl font-bold mb-2">
                Custom Project <span className="text-orange-600">Estimate</span>
              </h3>

              {/* Subtitle */}
              <p className="text-black w-fit p-2 rounded-lg bg-black/5 text-sm mb-6 uppercase tracking-wide font-jetbrains-mono">
                Get a quick ballpark before committing
              </p>

              {/* Description */}
              <p className="text-[#161616] mb-6 text-lg max-md:text-base"
                
              >
                Pick your priorities, choose what you need, and get a realistic range in seconds.
              </p>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {[
                  "Access to all services",
                  "Priority support",
                  "Fully custom scope",
                  "No hidden costs",
                  "Working with your team",
                  "Experienced project ownership",
                  "5/7 Communication",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-[#E3E3E3]"><CheckIcon /></span>
                    <span className="max-md:text-sm text-base text-black"
                      
                    >{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-auto">
                <p className="text-gray-400 max-md:text-sm text-base mb-4 italic"
                  
                >
                  Clarity before commitment
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <LetsTalkButton fullWidth variant="color" onClick={handleStart}>
                    Calculate Now
                  </LetsTalkButton>
                  <LetsTalkButton fullWidth/>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Add Your Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="mb-6">
                  <p className="text-sm mb-2 bg-black/5 w-fit px-3 py-1 rounded-lg uppercase font-jetbrains-mono">STEP 1</p>
                  <h4 className="text-xl font-semibold mb-2">Add Your Details</h4>
                  <p className="text-sm text-gray-600">So we know who we're estimating for</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">What is your name?*</label>
                    <Input
                      placeholder="Write here"
                      value={name}
                      radius="sm"
                      onChange={(e) => setName(e.target.value)}
                      classNames={{
                        input: "text-base",
                        inputWrapper: "border-2 border-gray-200 hover:border-gray-300"
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">What is your email id?*</label>
                    <Input
                      type="email"
                      placeholder="Write here"
                      value={email}
                      radius="sm"
                      onChange={(e) => setEmail(e.target.value)}
                      classNames={{
                        input: "text-base",
                        inputWrapper: "border-2 border-gray-200 hover:border-gray-300"
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">What is your contact number?*</label>
                    <div className="flex flex-row gap-2 items-end">
                      <Select
                      radius="sm"
                        selectedKeys={[countryCode]}
                        onChange={(e) => setCountryCode(e.target.value)}
                        labelPlacement="outside"
                        className="w-[100px]"
                        classNames={{
                          trigger: "border-2 border-gray-200 hover:border-gray-300 h-[42px] px-2",
                          value: "text-sm"
                        }}
                        renderValue={(items) => {
                          const selected = countryCodes.find(c => c.code === countryCode);
                          return (
                            <div className="flex items-center gap-1">
                              <span className="text-base">{selected?.flag}</span>
                              <span className="text-sm font-medium">{selected?.code}</span>
                            </div>
                          );
                        }}
                      >
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} textValue={country.code}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{country.flag}</span>
                              <span className="text-sm">{country.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>
                      <Input
                        type="tel"
                        placeholder="Write here"
                        value={phone}
                      radius="sm"
                        onChange={(e) => setPhone(e.target.value)}
                        labelPlacement="outside"
                        className="flex-1"
                        classNames={{
                          input: "text-base",
                          inputWrapper: "border-2 border-gray-200 hover:border-gray-300 h-[42px]"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Button at Bottom */}
              <div className="pt-4 border-t border-gray-100">
                {/* <Button
                  color="primary"
                  onPress={handleNext}
                  isDisabled={!canProceed()}
                  className="w-full bg-[#FF5B04] text-white font-bold py-6 text-base"
                >
                  Next
                </Button> */}
                    <LetsTalkButton fullWidth variant="color" onClick={handleNext}   isDisabled={!canProceed()}>
                Calculate Now
              </LetsTalkButton>
              </div>
            </motion.div>
          )}

          {/* Step 2: Select Project Type & Scope */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="mb-6">
                  <p className="text-sm mb-2 bg-black/5 w-fit px-3 py-1 rounded-lg uppercase font-jetbrains-mono">STEP 2</p>
                  <h4 className="text-xl font-semibold mb-2">Select Your Project Type & Scope</h4>
                  <p className="text-md text-gray-600 italic">Select what best fits your project</p>
                </div>

                <div className="mb-6">
                  <h5 className="text-base font-medium mb-3">What are you building?</h5>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((type) => {
                      const isSelected = selectedProjectTypes.includes(type);
                      return (
                        <Chip
                          key={type}
                          onClick={() => toggleProjectType(type)}
                          variant={isSelected ? "solid" : "bordered"}
                          style={{
                            backgroundColor: isSelected ? '#FF5B04' : 'transparent',
                            borderColor: isSelected ? '#FF5B04' : '#E5E7EB',
                            color: isSelected ? 'white' : 'inherit'
                          }}
                          className="cursor-pointer transition-all border-1"
                        >
                          {type}
                        </Chip>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="text-base font-medium mb-3">What is your requirement?</h5>
                  <Tabs
                    // fullWidth
                    aria-label="Requirement Options"
                    variant="solid"
                    selectedKey={selectedRequirement}
                    radius="full"
                    onSelectionChange={(key) => setSelectedRequirement(key as string)}
                    classNames={{
                      tabList: "bg-gray-100/50  rounded-full",
                      cursor: "bg-[#FF5B04] shadow-sm",
                      tab: "h-7",
                      tabContent: "font-medium group-data-[selected=true]:text-white text-gray-600"
                    }}
                  >
                    {requirements.map((req) => (
                      <Tab key={req} title={req} />
                    ))}
                  </Tabs>
                </div>
              </div>

              {/* Fixed Button at Bottom */}
              <div className="pt-4 border-t border-gray-100">
                {/* <Button
                  onPress={handleNext}
                  isDisabled={!canProceed()}
                  style={{ backgroundColor: '#FF5B04' }}
                  className="w-full text-white font-bold py-6 text-base"
                >
                  Calculate Now
                </Button> */}
                 <LetsTalkButton fullWidth variant="color" onClick={handleNext}   isDisabled={!canProceed()}>
                Calculate Now
              </LetsTalkButton>
              </div>
            </motion.div>
          )}

          {/* Step 3: Priority Selection & Result */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >

              <div className="mb-6">
                 <p className="text-sm mb-2 bg-black/5 w-fit px-3 py-1 rounded-lg uppercase font-jetbrains-mono">Project Estimate</p>
                <h4 className="text-xl font-semibold mb-6"
                >This is your rough estimate!</h4>
                
                {/* Estimate Cards */}
                {(() => {
                  const estimate = getCalculatedEstimate();

                  if (estimate.isInvalid) {
                    return (
                      <div className="p-4 border-2 border-gray-200 bg-red-50/30 rounded-xl mb-6 ">
                        <p className="text-gray-700 text-base max-md:text-sm mb-2">
                          Fast and budget-friendly usually means cutting corners. 
                        </p>
                        <span className="text-3xl font-black mt-2 font-jetbrains-mono">
                          We don’t do that here ❌
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 border-2 border-gray-200 rounded-xl">
                        <p className="text-base max-md:text-sm text-gray-500 mb-2">Estimated Budget Range</p>
                        <p className="text-3xl font-black font-jetbrains-mono">
                          {estimate.budget}
                        </p>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-xl">
                        <p className="text-base max-md:text-sm text-gray-500 mb-2">Estimated Timeline</p>
                        <p className="text-3xl font-black font-jetbrains-mono"
                        
                        >
                          {estimate.timeline}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="mb-6">
                <h5 className="text-base font-medium mb-4">What matters most right now?</h5>
                
                <div className="space-y-3">
                  {priorities.map((priority) => {
                    const isSelected = selectedPriorities.includes(priority.id);
                    const isDark = priority.id === "fast" || priority.id === "premium" || priority.id === "budget";
                    
                    return (
                      <button
                        key={priority.id}
                        onClick={() => togglePriority(priority.id)}
                        style={{ boxShadow: "0px 1.81px 3.01px 0px #FFFFFF40 inset" }}
                        className={`w-full p-4 rounded-xl transition-all text-left relative  ${
                          isSelected && isDark
                            ? 'bg-black/95 text-white border-2 border-black noise-texture'
                            : isSelected && !isDark
                            ? 'bg-white text-black border-2 border-gray-300 '
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 '
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              <img src={priority.icon} alt={priority.name} className="w-6 h-6" />
                            </span>
                            <div>
                              <div className="font-bold text-lg">{priority.name}</div>
                              <div className={`text-sm ${isSelected && isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                {priority.description}
                              </div>
                            </div>
                          </div>
                          
                          {/* Toggle Switch */}
                          <div className={`w-12 h-6 rounded-full transition-all ${
                            isSelected ? 'bg-[#FF5B04]' : 'bg-gray-300'
                          }`}>
                            <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${
                              isSelected ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <LetsTalkButton fullWidth variant="color" onClick={handleWhatsAppRedirect}>
                Get a Detailed Quote →
              </LetsTalkButton>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  );
};

export default ProjectEstimate;
