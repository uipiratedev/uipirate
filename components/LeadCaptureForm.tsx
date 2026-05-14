"use client";

import { useState } from "react";
import { Input, Select, SelectItem, Textarea, Button, Chip } from "@heroui/react";

export interface LeadFormData {
  name: string;
  email: string;
  company: string;
  budget: string;
  projectType: string;
  requirement: string;
  message: string;
}

interface LeadCaptureFormProps {
  /** Which page/section this form is placed on (for analytics) */
  source?: string;
  /** Compact mode — hides message field, fewer fields */
  compact?: boolean;
  /** Called after successful submission */
  onSuccess?: () => void;
}

const BUDGET_OPTIONS = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
];

const PROJECT_TYPES = [
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

const REQUIREMENTS = ["Design/Redesign", "Development", "Both"];

export default function LeadCaptureForm({
  source = "contact-form",
  compact = false,
  onSuccess,
}: LeadCaptureFormProps) {
  const [form, setForm] = useState<LeadFormData>({
    name: "",
    email: "",
    company: "",
    budget: "",
    projectType: "",
    requirement: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for required fields
    if (!form.name || !form.email) {
      setErrorMsg("Name and email are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      onSuccess?.();
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Message Received!</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          We typically respond within 2 hours. Check your inbox — we'll reach out to schedule a call.
        </p>
      </div>
    );
  }

  const inputClassNames = {
    label: "text-sm font-medium text-gray-700 font-jakarta",
    input: "text-base",
    inputWrapper: "border-2 border-gray-100 hover:border-gray-300 dark:bg-white bg-white h-[52px]",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Row: Name + Email */}
      <div className={`grid gap-5 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <Input
          label="Your Name"
          name="name"
          autoComplete="name"
          placeholder="Write here"
          labelPlacement="outside"
          value={form.name}
          onValueChange={(val) => handleChange("name", val)}
          isRequired
          classNames={inputClassNames}
        />
        <Input
          label="Work Email"
          name="email"
          autoComplete="email"
          placeholder="Write here"
          labelPlacement="outside"
          type="email"
          value={form.email}
          onValueChange={(val) => handleChange("email", val)}
          isRequired
          classNames={inputClassNames}
        />
      </div>

      {/* Row: Company + Budget */}
      <div className={`grid gap-5 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <Input
          label="Company"
          name="organization"
          autoComplete="organization"
          placeholder="Write here"
          labelPlacement="outside"
          value={form.company}
          onValueChange={(val) => handleChange("company", val)}
          classNames={inputClassNames}
        />
        <Select
          label="Budget Range"
          placeholder="Select budget"
          labelPlacement="outside"
          selectedKeys={form.budget ? [form.budget] : []}
          onSelectionChange={(keys) => handleChange("budget", Array.from(keys)[0] as string)}
          classNames={{
            label: "text-sm font-medium text-gray-700 font-jakarta",
            trigger: "border-2 border-gray-100 hover:border-gray-300 dark:bg-white bg-white h-[52px]",
          }}
        >
          {BUDGET_OPTIONS.map((opt) => (
            <SelectItem key={opt}>{opt}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Section Header */}
      {!compact && (
        <div className="mt-2">
          <h4 className="text-lg font-bold text-gray-900">Select Your Project Type & Scope</h4>
          <p className="text-sm text-gray-500 italic">Select what best fits your project</p>
        </div>
      )}

      {/* Project Type — Updated List */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700 font-jakarta">
          What are you building?
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => {
            const isSelected = form.projectType === type;
            return (
              <Chip
                key={type}
                onClick={() => handleChange("projectType", type)}
                variant={isSelected ? "solid" : "bordered"}
                style={{
                  backgroundColor: isSelected ? '#FF5B04' : 'transparent',
                  borderColor: isSelected ? '#FF5B04' : '#E5E7EB',
                  color: isSelected ? 'white' : '#6B7280'
                }}
                className={`cursor-pointer transition-all border-2 h-9 px-4 text-sm font-medium ${!isSelected ? 'hover:border-gray-300' : ''}`}
              >
                {type}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Requirement — Updated Style */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700 font-jakarta">
          What is your requirement?
        </label>
        <div className="flex flex-wrap gap-2">
          {REQUIREMENTS.map((req) => {
            const isSelected = form.requirement === req;
            return (
              <Chip
                key={req}
                onClick={() => handleChange("requirement", req)}
                variant={isSelected ? "solid" : "bordered"}
                style={{
                  backgroundColor: isSelected ? '#FF5B04' : 'transparent',
                  borderColor: isSelected ? '#FF5B04' : '#E5E7EB',
                  color: isSelected ? 'white' : '#6B7280'
                }}
                className={`cursor-pointer transition-all border-2 h-9 px-4 text-sm font-medium ${!isSelected ? 'hover:border-gray-300' : ''}`}
              >
                {req}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Message — hidden in compact mode */}
      {!compact && (
        <Textarea
          label="Tell us about your project"
          placeholder="Write here..."
          labelPlacement="outside"
          minRows={4}
          value={form.message}
          onValueChange={(val) => handleChange("message", val)}
          classNames={{
            label: "text-sm font-medium text-gray-700 font-jakarta",
            input: "text-base",
            inputWrapper: "border-2 border-gray-100 hover:border-gray-300 dark:bg-white bg-white",
          }}
        />
      )}

      {/* Error */}
      {status === "error" && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl" role="alert">
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        isLoading={status === "loading"}
        className="w-full h-[56px] rounded-xl bg-gray-900 text-white text-base font-bold tracking-wide hover:bg-[#FF5B04] transition-all duration-300 mt-2"
      >
        {status === "loading" ? "Sending..." : "Send Message →"}
      </Button>

      <p className="text-xs text-gray-400 text-center font-jakarta">
        No spam. We respond within 2 hours during business hours.
      </p>
    </form>
  );
}
