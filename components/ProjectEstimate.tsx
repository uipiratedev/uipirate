"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Button, Input, Select, SelectItem, Chip, Tabs, Tab, Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@/components/icons";
import LetsTalkButton from "@/components/LetsTalkButton";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface ProjectEstimateProps {
  cardVariants?: any;
}

// Country codes will be handled by react-phone-input-2 package

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
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState<"center" | "bottom" | "top" | "top-center" | "bottom-center">("center");
  const [estimateId, setEstimateId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setModalPlacement(window.innerWidth < 768 ? "bottom" : "center");
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPhoneTouched, setIsPhoneTouched] = useState(false);
  const [isNameTouched, setIsNameTouched] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validateName = (value: string) => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (isEmailTouched) {
      setEmailError(validateEmail(value));
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (isNameTouched) {
      setNameError(validateName(value));
    }
  };

  const handlePhoneChange = (value: string, data: any) => {
    // Value includes dial code without + usually, or with it depending on config
    setPhone(value);
    if (data && data.dialCode) {
      setCountryCode(`+${data.dialCode}`);
    }
    if (isPhoneTouched) {
      if (value.length < 8) setPhoneError("Please enter a valid phone number");
      else setPhoneError("");
    }
  };

  const handleStart = () => {
    setCurrentStep(1);
    onOpen();
  };

  const handleReset = () => {
    setCurrentStep(0);
    setName("");
    setEmail("");
    setPhone("");
    setSelectedProjectTypes([]);
    setSelectedRequirement("");
    setSelectedPriorities(["fast", "premium"]);
    setIsEmailTouched(false);
    setIsPhoneTouched(false);
    setIsNameTouched(false);
    setEstimateId(null);
    onClose();
  };

  const saveEstimate = async () => {
    try {
      const estimate = getCalculatedEstimate();
      const payload: any = {
        name,
        email,
        phone,
        countryCode,
        projectTypes: selectedProjectTypes,
        requirement: selectedRequirement,
        priorities: selectedPriorities,
        budgetRange: estimate.budget,
        timelineEstimate: estimate.timeline,
        isInvalidCombination: estimate.isInvalid,
      };

      if (estimateId) {
        payload.id = estimateId;
      }

      const res = await fetch("/api/estimates", {
        method: estimateId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success && result.data?._id && !estimateId) {
        setEstimateId(result.data._id);
      }
    } catch (error) {
      console.error("Failed to save estimate:", error);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 || currentStep === 2) {
      saveEstimate();
    }
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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWhatsAppRedirect = async () => {
    setIsSubmitted(true);
    await saveEstimate();
    
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
    
    // Switch to success step (Step 4)
    setCurrentStep(4);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
  }, [isOpen]);

  const canProceed = () => {
    if (currentStep === 1) {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isPhoneValid = phone.length >= 8;
      const isNameValid = name.trim().length >= 2;
      return isNameValid && isEmailValid && isPhoneValid;
    }
    if (currentStep === 2) return selectedProjectTypes.length > 0 && selectedRequirement;
    if (currentStep === 3) return selectedPriorities.length > 0;
    return false;
  };

  return (
    <div className="h-full">
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
                {/* Icon and Title aligned together on mobile */}
                <div className="flex items-center gap-4 max-md:gap-3 mb-6">
                  <div className="w-12 h-12 max-md:w-10 max-md:h-10 flex items-center justify-center">
                    <img src="/assets/gif/filter.gif" alt="" />
                  </div>
                  <h3 className="text-3xl max-md:text-xl max-lg:text-xl font-bold">
                    Custom Project <span className="text-orange-600">Estimate</span>
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="text-black w-fit p-2 rounded-lg bg-black/5 text-sm max-md:text-xs mb-6 uppercase tracking-wide font-jetbrains-mono">
                  Get a quick ballpark before committing
                </p>

                {/* Description */}
                <p className="text-[#161616] mb-6 text-lg max-md:text-base">
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
                      <span className="max-md:text-sm text-base text-black">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="mt-auto">
                  <p className="text-gray-400 max-md:text-sm text-base mb-4 italic">
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
            
            {/* If not in initial state, show a placeholder in the card */}
            {currentStep !== 0 && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-16 h-16 mb-4">
                  <img src="/assets/gif/filter.gif" alt="" className="opacity-50" />
                </div>
                <p className="text-gray-500">Estimation in progress...</p>
                <Button 
                  variant="light" 
                  onPress={onOpen}
                  className="mt-4 text-orange-600"
                >
                  Return to Estimator
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardBody>
      </Card>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        onClose={() => setCurrentStep(0)}
        isKeyboardDismissDisabled={true}
        
        size="2xl"
        backdrop="blur"
        placement={modalPlacement}
        scrollBehavior="inside"
        classNames={{
          base: `rounded-[24px] border-1 border-gray-200 shadow-2xl h-[520px] max-md:h-auto max-md:max-h-[85dvh] ${currentStep === 1 ? '!overflow-visible' : 'overflow-hidden'}`,
          body: `p-0 ${currentStep === 1 ? '!overflow-visible' : ''}`,
          wrapper: currentStep === 1 ? '!overflow-visible' : '',
          backdrop: "bg-black/50 backdrop-blur-md",
        }}
      >
        <ModalContent className={currentStep === 1 ? '!overflow-visible' : ''}>
          <ModalBody className={`p-8 max-md:p-6 flex flex-col ${currentStep === 1 ? '!overflow-visible' : 'h-[650px] max-md:h-auto overflow-hidden'}`}>
            {/* @ts-ignore */}
            <AnimatePresence mode="wait">
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
                  <div className="flex-1 pr-2 overflow-y-visible">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                         <p className="text-[10px] bg-black/5 w-fit px-3 py-1 rounded-lg uppercase font-jetbrains-mono tracking-wider font-bold">STEP 1</p>
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Add Your Details</h4>
                      <p className="text-sm text-gray-600">So we know who we're estimating for</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block font-jakarta text-gray-700">What is your name?*</label>
                        <Input
                          placeholder="Write here"
                          value={name}
                          radius="sm"
                          isInvalid={!!nameError}
                          errorMessage={nameError}
                          onBlur={() => {
                            setIsNameTouched(true);
                            setNameError(validateName(name));
                          }}
                          onChange={(e) => handleNameChange(e.target.value)}
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-2 border-gray-200 hover:border-gray-300 dark:bg-white"
                          }}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block font-jakarta">What is your email id?*</label>
                        <Input
                          type="email"
                          placeholder="Write here"
                          value={email}
                          radius="sm"
                          isInvalid={!!emailError}
                          errorMessage={emailError}
                          onBlur={() => {
                            setIsEmailTouched(true);
                            setEmailError(validateEmail(email));
                          }}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          classNames={{
                            input: "text-base",
                            inputWrapper: "border-2 border-gray-200 hover:border-gray-300"
                          }}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block font-jakarta">What is your contact number?*</label>
                        <div className="phone-wrapper-custom">
                          <PhoneInput
                            country={'in'}
                            value={phone}
                            onChange={(value, data) => handlePhoneChange(value, data)}
                            onBlur={() => {
                              setIsPhoneTouched(true);
                              if (phone.length < 8) setPhoneError("Please enter a valid phone number");
                            }}
                            enableSearch={true}
                            disableSearchIcon={true}
                            searchPlaceholder="Search Country..."
                            searchNotFound="No country found"
                            prefix="+"
                            containerClass="!w-full mb-1"
                            inputClass="!w-full !font-jakarta !text-base focus:!ring-0 focus:!border-gray-300"
                            dropdownClass="!rounded-xl !shadow-2xl !z-[99999999]"
                            inputProps={{
                              name: 'phone',
                              required: true,
                              autoFocus: false
                            }}
                          />
                          {phoneError && <p className="text-xs text-[#f31260] mt-1 ml-1">{phoneError}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <LetsTalkButton fullWidth variant="color" onClick={handleNext} isDisabled={!canProceed()}>
                      Continue
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
                  <div className="flex-1 overflow-y-scroll pr-2 custom-scrollbar">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-[10px] bg-black/5 w-fit px-3 py-1 rounded-lg uppercase font-jetbrains-mono tracking-wider font-bold">STEP 2</p>
                        <Button isIconOnly variant="light" radius="full" size="sm" onPress={handleBack} className="text-gray-400">←</Button>
                      </div>
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
                      <div className="flex flex-wrap gap-2">
                        {requirements.map((req) => {
                          const isSelected = selectedRequirement === req;
                          return (
                            <Chip
                              key={req}
                              onClick={() => setSelectedRequirement(req)}
                              variant={isSelected ? "solid" : "bordered"}
                              style={{
                                backgroundColor: isSelected ? '#FF5B04' : 'transparent',
                                borderColor: isSelected ? '#FF5B04' : '#E5E7EB',
                                color: isSelected ? 'white' : 'inherit'
                              }}
                              className="cursor-pointer transition-all border-1"
                            >
                              {req}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <LetsTalkButton fullWidth variant="color" onClick={handleNext} isDisabled={!canProceed()}>
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
                  className="flex flex-col h-full"
                >
                  <div className="flex-1 overflow-y-scroll pr-2 custom-scrollbar pb-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-6">
                         <div className="px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                           <p className="text-[10px] uppercase font-jetbrains-mono tracking-[0.2em] font-bold text-gray-500">PROJECT ESTIMATE</p>
                         </div>
                         <Button isIconOnly variant="light" radius="full" size="sm" onPress={handleBack} className="text-gray-400">←</Button>
                      </div>
                      
                      <h4 className="text-2xl font-bold mb-8 text-black">This is your rough estimate!</h4>
                      
                      {(() => {
                        const estimate = getCalculatedEstimate();
                        if (estimate.isInvalid) {
                          return (
                            <div className="p-6 border-2 border-red-100 bg-red-50/50 rounded-[24px] mb-8">
                              <p className="text-red-700 text-base mb-2 font-medium">
                                Fast and budget-friendly usually means cutting corners. 
                              </p>
                              <span className="text-2xl font-black font-jetbrains-mono text-red-900">
                                We don’t do that here ❌
                              </span>
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-5 border border-gray-100 bg-[#F9FAFB] rounded-[24px] transition-all hover:border-gray-200">
                              <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-gray-400 mb-3">Estimated Budget Range</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl max-md:text-xl font-black font-jetbrains-mono text-black">{estimate.budget}</span>
                              </div>
                            </div>
                            <div className="p-5 border border-gray-100 bg-[#F9FAFB] rounded-[24px] transition-all hover:border-gray-200">
                              <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-gray-400 mb-3">Estimated Timeline</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl max-md:text-xl font-black font-jetbrains-mono text-black">{estimate.timeline}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-jakarta font-bold text-gray-500 uppercase tracking-widest mb-5">What matters most right now?</h5>
                      <div className="space-y-4">
                        {priorities.map((priority) => {
                          const isSelected = selectedPriorities.includes(priority.id);
                          
                          return (
                            <button
                              key={priority.id}
                              onClick={() => togglePriority(priority.id)}
                              className={`w-full p-4 rounded-[20px] transition-all text-left relative group border-2 ${
                                isSelected
                                  ? 'bg-black text-white border-black shadow-lg noise-texture'
                                  : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 max-md:min-w-10 max-md:min-h-10 flex items-center justify-center rounded-xl ${isSelected ? 'bg-white/10' : 'bg-gray-100'}`}>
                                    <img src={priority.icon} alt={priority.name} className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-lg leading-none mb-1.5">{priority.name}</div>
                                    <div className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {priority.description}
                                    </div>
                                  </div>
                                </div>
                                <div className={`w-12 h-6  min-w-12 min-h-6 rounded-full transition-all flex items-center px-1 ${
                                  isSelected ? 'bg-[#FF5B04]' : 'bg-gray-200'
                                }`}>
                                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                    isSelected ? 'translate-x-6' : 'translate-x-0'
                                  }`} />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center gap-3 bg-white mt-auto">
                    <Button 
                      variant="light" 
                      className="flex-1 font-bold h-[56px] text-gray-400 hover:text-black transition-colors" 
                      radius="full"
                      onPress={handleReset}
                    >
                      Start Over
                    </Button>
                    <div className="flex-[2.5]">
                      <LetsTalkButton fullWidth variant="color" onClick={handleWhatsAppRedirect}>
                        Get Detailed Quote →
                      </LetsTalkButton>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* Step 4: Success Message */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center py-12 h-full"
                >
                  <div className="mb-8 scale-110">
                    <SuccessIllustration />
                  </div>
                  <h4 className="text-3xl font-black mb-4">You're All Set!</h4>
                  <p className="text-gray-600 text-lg mb-8 max-w-[400px]">
                    Your inquiry has been stored. A member of our team will get in touch with you shortly.
                  </p>
                  <div className="w-full max-w-[280px]">
                    <Button 
                      onClick={() => { setCurrentStep(0); onClose(); setIsSubmitted(false); }}
                      radius="full"
                      className="w-full h-[56px] bg-black text-white font-bold hover:bg-gray-900 transition-all shadow-xl"
                    >
                      Back to Home
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

const SuccessIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="60" cy="60" r="44" fill="black" />
    <path d="M48 60L56 68L72 52" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="90" cy="30" r="6" fill="#FF5B04" />
    <circle cx="25" cy="45" r="4" fill="#FF5B04" opacity="0.6" />
    <circle cx="85" cy="85" r="3" fill="#FF5B04" opacity="0.4" />
  </svg>
);

export default ProjectEstimate;
