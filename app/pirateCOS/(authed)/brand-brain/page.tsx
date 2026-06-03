"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { POST_TYPE_CONFIGS } from "@/lib/pirateCOS/postTypeConfig";
import CosIcon from "@/components/pirateCOS/CosIcon";

interface BrandBrainData {
  companyName: string;
  brandVoice: string;
  products: string;
  audienceICP: string;
  targetKeywords: string[];
  forbiddenWords: string[];
  callToActionTemplate?: string;
  presetInstructions?: Record<string, string>;
  sentenceComplexity?: "simple" | "moderate" | "advanced";
  formattingRules?: {
    alwaysIncludeTakeaways: boolean;
    alwaysIncludeFAQ: boolean;
    autoAppendCTA: boolean;
  };
}

const BRAND_VOICE_PRESETS = [
  {
    value: "Professional & Authoritative",
    label: "Professional & Authoritative",
    desc: "Expert, trustworthy, and industry-leading tone suitable for corporate, B2B, or enterprise audiences.",
    icon: "authority" as const,
  },
  {
    value: "Conversational & Friendly",
    label: "Conversational & Friendly",
    desc: "Approachable, warm, and highly engaging style that builds a strong human connection.",
    icon: "engagement" as const,
  },
  {
    value: "Bold & Energetic",
    label: "Bold & Energetic",
    desc: "Inspiring, creative, and action-oriented tone that challenges the status quo.",
    icon: "bolt" as const,
  },
  {
    value: "Empathetic & Supportive",
    label: "Empathetic & Supportive",
    desc: "Compassionate and helpful tone focused on solving deep customer pain points with care.",
    icon: "retention" as const,
  },
  {
    value: "Sleek & Minimalist",
    label: "Sleek & Minimalist",
    desc: "Premium, refined, and understated copy focusing on high-concept design principles.",
    icon: "sparkles" as const,
  },
];

export default function BrandBrainPage() {
  const router = useRouter();

  // Loading & State variables
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandBrain, setBrandBrain] = useState<BrandBrainData | null>(null);

  // Tab control ("identity" | "audience" | "vocabulary" | "presets" | "formatting")
  const [activeTab, setActiveTab] = useState<
    "identity" | "audience" | "vocabulary" | "presets" | "formatting"
  >("identity");

  // Wizard variables (if brandBrain is null)
  const [wizardStep, setWizardStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [brandVoice, setBrandVoice] = useState("Professional & Authoritative");
  const [products, setProducts] = useState("");
  const [audienceICP, setAudienceICP] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [forbiddenInput, setForbiddenInput] = useState("");
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([]);
  const [callToAction, setCallToAction] = useState("");
  const [presetInstructions, setPresetInstructions] = useState<Record<string, string>>({});
  const [selectedPresetType, setSelectedPresetType] = useState<string>("blog");

  // Formatting & Style variables
  const [sentenceComplexity, setSentenceComplexity] = useState<
    "simple" | "moderate" | "advanced"
  >("moderate");
  const [alwaysIncludeTakeaways, setAlwaysIncludeTakeaways] = useState(false);
  const [alwaysIncludeFAQ, setAlwaysIncludeFAQ] = useState(false);
  const [autoAppendCTA, setAutoAppendCTA] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch active Brand Brain profile
  const fetchBrandBrain = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/pirateCOS/brand-brain");
      const data = await res.json();

      if (data.success && data.brandBrain) {
        setBrandBrain(data.brandBrain);
        // Initialize editing inputs
        setCompanyName(data.brandBrain.companyName || "");
        setBrandVoice(
          data.brandBrain.brandVoice || "Professional & Authoritative",
        );
        setProducts(data.brandBrain.products || "");
        setAudienceICP(data.brandBrain.audienceICP || "");
        setTargetKeywords(data.brandBrain.targetKeywords || []);
        setForbiddenWords(data.brandBrain.forbiddenWords || []);
        setCallToAction(data.brandBrain.callToActionTemplate || "");
        setPresetInstructions(data.brandBrain.presetInstructions || {});
        setSentenceComplexity(data.brandBrain.sentenceComplexity || "moderate");
        setAlwaysIncludeTakeaways(!!data.brandBrain.formattingRules?.alwaysIncludeTakeaways);
        setAlwaysIncludeFAQ(!!data.brandBrain.formattingRules?.alwaysIncludeFAQ);
        setAutoAppendCTA(!!data.brandBrain.formattingRules?.autoAppendCTA);
      } else {
        setBrandBrain(null);
      }
    } catch (err) {
      console.error("Failed to load Brand Brain profile", err);
      setErrorMsg(
        "Failed to connect to the database. Please try reloading the page.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrandBrain();
  }, [fetchBrandBrain]);

  // Handle Upsert / Save
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validations
    if (!companyName.trim()) return setErrorMsg("Company name is required.");
    if (!brandVoice.trim())
      return setErrorMsg("Brand voice definition is required.");
    if (!products.trim())
      return setErrorMsg("Products / services description is required.");
    if (!audienceICP.trim())
      return setErrorMsg("Audience / ICP description is required.");

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/pirateCOS/brand-brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          brandVoice,
          products,
          audienceICP,
          targetKeywords,
          forbiddenWords,
          callToActionTemplate: callToAction,
          presetInstructions,
          sentenceComplexity,
          formattingRules: {
            alwaysIncludeTakeaways,
            alwaysIncludeFAQ,
            autoAppendCTA,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save Brand Brain profile.");
      }

      setBrandBrain(data.data);
      setSuccessMsg(
        "Brand Brain updated successfully! Downstream AI prompt injection is now fully active.",
      );

      // Auto-clear success message
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Keyboard helper for adding target keywords
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && keywordInput.trim()) {
      e.preventDefault();
      const val = keywordInput.trim().replace(/,$/, "");

      if (val && !targetKeywords.includes(val)) {
        setTargetKeywords([...targetKeywords, val]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (idx: number) => {
    setTargetKeywords(targetKeywords.filter((_, i) => i !== idx));
  };

  // Keyboard helper for adding forbidden words
  const handleAddForbidden = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && forbiddenInput.trim()) {
      e.preventDefault();
      const val = forbiddenInput.trim().replace(/,$/, "");

      if (val && !forbiddenWords.includes(val)) {
        setForbiddenWords([...forbiddenWords, val]);
      }
      setForbiddenInput("");
    }
  };

  const removeForbidden = (idx: number) => {
    setForbiddenWords(forbiddenWords.filter((_, i) => i !== idx));
  };

  // Completeness score calculator
  const calculateCompleteness = () => {
    let score = 0;

    if (companyName) score += 20;
    if (brandVoice) score += 20;
    if (products) score += 20;
    if (audienceICP) score += 20;
    if (targetKeywords.length > 0) score += 10;
    if (callToAction) score += 10;

    return score;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <svg
          className="animate-spin h-8 w-8 text-[#FF5B04]"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
        <p className="text-sm font-semibold font-geist text-gray-500 animate-pulse">
          Retrieving AI Brand Brain guidelines...
        </p>
      </div>
    );
  }

  // ---------------- WIZARD STATE (Onboarding) ----------------
  if (!brandBrain) {
    return (
      <div className="w-full px-4 lg:px-8 py-6 lg:py-10 font-geist text-gray-700">
        {/* Banner Header */}
        <div className="text-center mb-10">
          <div className="relative w-14 h-14 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#FF5B04]/10 rounded-2xl blur-md animate-pulse" />
            <div
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center border border-[#FF5B04]/20 shadow-sm"
              style={{ background: "linear-gradient(135deg, rgba(255,91,4,0.12) 0%, rgba(255,91,4,0.04) 100%)", color: "#FF5B04" }}
            >
              <CosIcon name="bot" size={26} />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-geist text-gray-900 leading-tight">
            Create Your AI Brand Brain
          </h1>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            Configure your core brand settings once. Downstream AI copilots will automatically read these rules to preserve style and structure consistency.
          </p>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border border-black/[0.03] rounded-2xl mb-8 max-w-2xl mx-auto">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-jetbrains-mono transition-all duration-300 relative ${
                    wizardStep === step
                      ? "bg-[#FF5B04] text-white shadow-[0_0_12px_rgba(255,91,4,0.3)] ring-4 ring-[#FF5B04]/10"
                      : wizardStep > step
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-gray-200 text-gray-400"
                  }`}
                >
                  {wizardStep > step ? (
                    <CosIcon name="check" size={14} />
                  ) : (
                    step
                  )}
                </div>
                <div className="hidden sm:block">
                  <p
                    className={`text-xs font-bold leading-none ${wizardStep === step ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {step === 1
                      ? "Brand & Voice"
                      : step === 2
                        ? "Offerings & ICP"
                        : "Vocabulary"}
                  </p>
                </div>
              </div>
              {step < 3 && (
                <div className="flex-1 h-0.5 mx-4 relative overflow-hidden bg-gray-200 max-w-[80px]">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: wizardStep > step ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Wizard Card Body */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-black/[0.04] shadow-md overflow-hidden p-6 md:p-8">
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-100 p-3.5 rounded-xl flex items-start gap-2.5">
              <span className="text-red-500 font-bold">✗</span>
              <p className="text-xs text-red-600 font-medium leading-relaxed">
                {errorMsg}
              </p>
            </div>
          )}

          {wizardStep === 1 && (
            <motion.div
              key="step1"
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Define Brand Identity
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Specify your company name and choose your primary tone parameters.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Company / Brand Name
                </label>
                <input
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all"
                  placeholder="e.g. UI Pirate, Acme Corp"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Brand Voice / Tone Presets
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {BRAND_VOICE_PRESETS.map((preset) => {
                    const selected = brandVoice === preset.value;

                    return (
                      <button
                        key={preset.value}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                          selected
                            ? "border-[#FF5B04] bg-orange-50/10 shadow-[0_2px_12px_-4px_rgba(255,91,4,0.1)]"
                            : "border-black/[0.04] hover:border-black/[0.08] hover:bg-gray-50/50 bg-white"
                        }`}
                        type="button"
                        onClick={() => setBrandVoice(preset.value)}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            selected ? "bg-[#FF5B04] text-white" : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          <CosIcon name={preset.icon} size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${selected ? "text-gray-900" : "text-gray-800"}`}>
                            {preset.label}
                          </p>
                          <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
                            {preset.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-black/[0.03]">
                <button
                  className="bg-[#FF5B04] text-white text-xs font-semibold px-6 h-10 rounded-xl hover:opacity-95 transition-opacity"
                  type="button"
                  onClick={() => {
                    if (!companyName.trim())
                      return setErrorMsg("Please provide your company or brand name.");
                    setErrorMsg(null);
                    setWizardStep(2);
                  }}
                >
                  Continue to Step 2
                </button>
              </div>
            </motion.div>
          )}

          {wizardStep === 2 && (
            <motion.div
              key="step2"
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Products & Target Audience
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Help the AI write contextual copy regarding what you sell and who your buyers are.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Products / Services Description
                </label>
                <textarea
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl p-4 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all resize-none leading-relaxed text-gray-700 placeholder:text-gray-400/80"
                  placeholder="Describe what your company does, your unique offerings, and what value you generate (e.g. We are a premium UI/UX agency that designs B2B SaaS platforms and mobile apps)..."
                  rows={4}
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Target Ideal Customer Profile (ICP)
                </label>
                <textarea
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl p-4 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all resize-none leading-relaxed text-gray-700 placeholder:text-gray-400/80"
                  placeholder="Describe your ideal customers, their pain points, and why they buy (e.g. Growth-stage B2B SaaS founders, Product Managers, and CTOs struggling with high churn)..."
                  rows={4}
                  value={audienceICP}
                  onChange={(e) => setAudienceICP(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-black/[0.03]">
                <button
                  className="border border-black/[0.08] text-gray-500 text-xs font-semibold px-5 h-10 rounded-xl hover:bg-gray-50 transition-colors"
                  type="button"
                  onClick={() => setWizardStep(1)}
                >
                  Back
                </button>
                <button
                  className="bg-[#FF5B04] text-white text-xs font-semibold px-6 h-10 rounded-xl hover:opacity-95 transition-opacity"
                  type="button"
                  onClick={() => {
                    if (!products.trim())
                      return setErrorMsg("Please describe your products or services.");
                    if (!audienceICP.trim())
                      return setErrorMsg("Please define your target ICP/audience profile.");
                    setErrorMsg(null);
                    setWizardStep(3);
                  }}
                >
                  Continue to Step 3
                </button>
              </div>
            </motion.div>
          )}

          {wizardStep === 3 && (
            <motion.div
              key="step3"
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Vocabulary Guard & Call To Action
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Add target keywords you want to promote, and forbidden terms the AI must completely filter out.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Target Keywords to Promote
                </label>
                <input
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all"
                  placeholder="Add keyword and press Enter or Comma..."
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                />
                {targetKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {targetKeywords.map((tag, idx) => (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={idx}
                        className="bg-orange-50/60 text-[#FF5B04] border border-orange-100/40 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm animate-fade-in"
                      >
                        {tag}
                        <button
                          className="text-orange-400 hover:text-red-500 font-extrabold transition-colors leading-none"
                          type="button"
                          onClick={() => removeKeyword(idx)}
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block text-red-500">
                  Forbidden Words / Vocabulary (To Completely Avoid)
                </label>
                <input
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all"
                  placeholder="Type a word to completely ban and press Enter or Comma..."
                  type="text"
                  value={forbiddenInput}
                  onChange={(e) => setForbiddenInput(e.target.value)}
                  onKeyDown={handleAddForbidden}
                />
                {forbiddenWords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {forbiddenWords.map((word, idx) => (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={idx}
                        className="bg-red-50/60 text-red-600 border border-red-100/40 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm animate-fade-in"
                      >
                        {word}
                        <button
                          className="text-red-400 hover:text-red-600 font-extrabold transition-colors leading-none"
                          type="button"
                          onClick={() => removeForbidden(idx)}
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Standard Call To Action (CTA) template (Optional)
                </label>
                <input
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Schedule a 15-minute SaaS design consultation with the UI Pirate crew today!"
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-black/[0.03]">
                <button
                  className="border border-black/[0.08] text-gray-500 text-xs font-semibold px-5 h-10 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={saving}
                  type="button"
                  onClick={() => setWizardStep(2)}
                >
                  Back
                </button>
                <button
                  className="bg-[#FF5B04] text-white text-xs font-semibold px-6 h-10 rounded-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={saving}
                  type="button"
                  onClick={() => handleSave()}
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                      Deploying Brain…
                    </>
                  ) : (
                    "Complete & Enable AI Brand Brain"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- ACTIVE DASHBOARD STATE ----------------
  const completeness = calculateCompleteness();

  return (
    <div className="w-full px-4 lg:px-8 py-6 font-geist text-gray-700 space-y-6">
      {/* HEADER */}
      <div className="pt-2 border-b border-black/[0.04] pb-5">
        <p
          className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1"
          style={{ color: "#FF5B04" }}
        >
          AI Control Suite
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">
            AI Brand Brain
          </h1>
          
          {/* Elegant Inline Strength Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF5B04]/5 px-2.5 py-1 rounded-full border border-[#FF5B04]/10 shadow-sm flex-shrink-0 align-middle">
            <div className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  className="text-orange-100/40"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="16"
                />
                <motion.circle
                  className="text-[#FF5B04]"
                  strokeWidth="4"
                  strokeDasharray="100"
                  strokeDashoffset={100 - completeness}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  cx="18"
                  cy="18"
                  r="16"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - completeness }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute text-[6.5px] font-extrabold text-gray-800 font-jetbrains-mono">
                {completeness}%
              </div>
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[10px] font-bold text-gray-800 whitespace-nowrap">
                Brain Strength
              </span>
              <span className="text-[10px] text-gray-400 font-medium">•</span>
              <span className="flex items-center gap-1 leading-none">
                <span className={`w-1 h-1 rounded-full ${completeness === 100 ? "bg-emerald-500" : "bg-amber-400"}`} />
                <span className="text-[9px] text-gray-500 font-semibold capitalize">
                  {completeness === 100 ? "Optimised" : "Incomplete"}
                </span>
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1.5">
          Configure company metadata, brand voice rules, and custom style archetype prompts to guide LLM writing.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-xl flex items-start gap-2.5 animate-fade-in shadow-sm">
          <span className="text-emerald-500 font-bold">✓</span>
          <p className="text-xs text-emerald-700 font-medium leading-relaxed">
            {successMsg}
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50/60 border border-red-100 p-3.5 rounded-xl flex items-start gap-2.5 animate-fade-in shadow-sm">
          <span className="text-red-500 font-bold">✗</span>
          <p className="text-xs text-red-700 font-medium leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Top Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-black/[0.04] shadow-sm p-1.5 flex flex-wrap gap-1">
        {[
          { id: "identity", label: "Brand Identity", desc: "Metadata & voice", icon: "bot" },
          { id: "audience", label: "Audience & ICP", desc: "Offerings & clients", icon: "traffic" },
          { id: "vocabulary", label: "Vocabulary Guard", desc: "Keywords & bans", icon: "list" },
          { id: "presets", label: "Style Guides", desc: "Archetype rules", icon: "edit" },
          { id: "formatting", label: "Formatting & Style", desc: "Readability & CTAs", icon: "sparkles" },
        ].map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`relative flex-1 min-w-[140px] px-3 py-3 rounded-xl transition-all duration-200 text-center flex flex-col items-center gap-1.5 group border ${
                active
                  ? "bg-gradient-to-b from-orange-50/50 to-orange-50/10 border-orange-100/50 text-[#FF5B04] shadow-sm"
                  : "hover:bg-gray-50/60 border-transparent text-gray-500 hover:text-gray-800"
              }`}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
            >
              {active && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[#FF5B04]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <div
                className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
                  active ? "bg-white text-[#FF5B04] shadow-sm border border-orange-100/20" : "bg-gray-50 text-gray-400 group-hover:text-gray-600"
                }`}
              >
                <CosIcon name={tab.icon} size={15} />
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-bold leading-tight ${active ? "text-gray-900" : "text-gray-700"}`}
                >
                  {tab.label}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5 hidden sm:block truncate max-w-[150px]">{tab.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Full-width Form details */}
      <form
        className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-black/[0.04] shadow-sm overflow-hidden flex flex-col min-h-[460px]"
        onSubmit={handleSave}
      >
        <div className="p-6 md:p-8 flex-1">
          {activeTab === "identity" && (
            <motion.div
              key="identity-tab"
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="border-b border-black/[0.04] pb-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Brand Identity Profile
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Configure base brand details and select a core writing tone.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Company / Brand Name
                </label>
                <input
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all"
                  placeholder="e.g. UI Pirate"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Brand Voice & Writing Tone
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {BRAND_VOICE_PRESETS.map((p) => {
                    const selected = brandVoice === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setBrandVoice(p.value)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3.5 ${
                          selected
                            ? "border-[#FF5B04] bg-orange-50/10 shadow-[0_2px_12px_-4px_rgba(255,91,4,0.1)]"
                            : "border-black/[0.04] hover:border-black/[0.08] hover:bg-gray-50/50 bg-white"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                            selected ? "bg-[#FF5B04] text-white" : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          <CosIcon name={p.icon} size={15} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${selected ? "text-gray-900" : "text-gray-800"}`}>
                            {p.label}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "audience" && (
            <motion.div
              key="audience-tab"
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="border-b border-black/[0.04] pb-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Audience & ICP Profiles
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Describe what you offer and identify your prime target audience segment.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Products / Services Description
                </label>
                <textarea
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl p-4 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all resize-none leading-relaxed text-gray-700 placeholder:text-gray-400/80"
                  placeholder="e.g. SaaS and web development consulting..."
                  rows={5}
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Target Ideal Customer Profile (ICP)
                </label>
                <textarea
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl p-4 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all resize-none leading-relaxed text-gray-700 placeholder:text-gray-400/80"
                  placeholder="e.g. Technology founders struggling with SaaS user friction..."
                  rows={5}
                  value={audienceICP}
                  onChange={(e) => setAudienceICP(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "vocabulary" && (
            <motion.div
              key="vocabulary-tab"
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="border-b border-black/[0.04] pb-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Vocabulary & Content Guard
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Define target keywords to integrate and forbidden terms to completely ban.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Target Keywords to Promote
                </label>
                <input
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all"
                  placeholder="Add keyword and press Enter or Comma..."
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                />
                {targetKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {targetKeywords.map((tag, idx) => (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={idx}
                        className="bg-orange-50/60 text-[#FF5B04] border border-orange-100/40 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
                      >
                        {tag}
                        <button
                          className="text-orange-400 hover:text-red-500 font-extrabold transition-colors leading-none"
                          type="button"
                          onClick={() => removeKeyword(idx)}
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block text-red-500">
                  Forbidden Vocabulary (Completely Avoid)
                </label>
                <input
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all"
                  placeholder="Add prohibited term and press Enter or Comma..."
                  type="text"
                  value={forbiddenInput}
                  onChange={(e) => setForbiddenInput(e.target.value)}
                  onKeyDown={handleAddForbidden}
                />
                {forbiddenWords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {forbiddenWords.map((word, idx) => (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={idx}
                        className="bg-red-50/60 text-red-600 border border-red-100/40 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm"
                      >
                        {word}
                        <button
                          className="text-red-400 hover:text-red-600 font-extrabold transition-colors leading-none"
                          type="button"
                          onClick={() => removeForbidden(idx)}
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "presets" && (
            <motion.div
              key="presets-tab"
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="border-b border-black/[0.04] pb-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Style Guides & Presets
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Customize prompt guidelines for individual post types.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Archetypes Drawer */}
                <div className="md:col-span-1 space-y-1.5 max-h-[380px] overflow-y-auto pr-2 border-r border-black/[0.04]">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2 px-1">
                    Archetypes
                  </label>
                  {POST_TYPE_CONFIGS.map((type) => {
                    const active = selectedPresetType === type.value;
                    const hasCustom = !!(presetInstructions[type.value]?.trim());
                    return (
                      <button
                        key={type.value}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-3 border ${
                          active
                            ? "bg-gradient-to-r from-orange-50/40 to-orange-50/10 border-orange-200/40 text-[#FF5B04] shadow-[0_2px_8px_-3px_rgba(255,91,4,0.05)]"
                            : "hover:bg-gray-50/60 border-transparent hover:border-black/[0.02] text-gray-600"
                        }`}
                        type="button"
                        onClick={() => setSelectedPresetType(type.value)}
                      >
                        <div className="min-w-0 flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active ? "bg-white text-[#FF5B04]" : "bg-gray-50 text-gray-400"}`}>
                            <CosIcon name={type.icon} size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold leading-tight ${active ? "text-gray-900" : "text-gray-700"}`}>
                              {type.label}
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5 truncate">
                              {type.category === "content" ? "Content & Knowledge" : "Monetization"}
                            </p>
                          </div>
                        </div>
                        {hasCustom && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" title="Custom style rules active" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Custom Instruction Editor */}
                <div className="md:col-span-2 space-y-4">
                  {(() => {
                    const typeConfig = POST_TYPE_CONFIGS.find((t) => t.value === selectedPresetType);
                    if (!typeConfig) return null;

                    const customValue = presetInstructions[selectedPresetType] || "";

                    return (
                      <div className="space-y-4 bg-gray-50/30 p-5 rounded-2xl border border-black/[0.03]">
                        <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
                          <span className="inline-flex items-center gap-1.5 bg-white border border-black/[0.04] px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-800 shadow-sm">
                            <CosIcon name={typeConfig.icon} size={14} className="text-[#FF5B04]" /> {typeConfig.label} Rules
                          </span>
                        </div>

                        <div className="bg-white border border-black/[0.03] p-3 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Default Template Directive:</p>
                          <p className="text-[10.5px] text-gray-500 leading-relaxed mt-1 italic">
                            "{typeConfig.templateHint}"
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                            Custom AI Instructions
                          </label>
                          <textarea
                            className="w-full bg-white border border-black/[0.06] rounded-xl p-4 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 outline-none transition-all resize-none leading-relaxed text-gray-700 placeholder:text-gray-400"
                            placeholder={`Add custom archetype specifications, format preferences, or targeted tone tweaks for ${typeConfig.label}...`}
                            rows={6}
                            value={customValue}
                            onChange={(e) => {
                              setPresetInstructions({
                                ...presetInstructions,
                                [selectedPresetType]: e.target.value,
                              });
                            }}
                          />
                          <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
                            💡 Injects custom constraints into generators. Leave blank to default to the standard template hint.
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "formatting" && (
            <motion.div
              key="formatting-tab"
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="border-b border-black/[0.04] pb-3">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Formatting & Style Preferences
                </h2>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                  Customize complexity levels, structural highlights, and CTAs.
                </p>
              </div>

              {/* Readability Complexity with Segmented Sliding Controller */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Sentence Complexity & Readability
                </label>
                <div className="relative flex bg-gray-100/60 p-1 rounded-xl gap-1 max-w-xs border border-black/[0.02]">
                  {(["simple", "moderate", "advanced"] as const).map((comp) => {
                    const active = sentenceComplexity === comp;
                    return (
                      <button
                        key={comp}
                        className={`relative flex-1 py-2 text-xs font-bold rounded-lg transition-colors z-10 capitalize ${
                          active ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                        }`}
                        type="button"
                        onClick={() => setSentenceComplexity(comp)}
                      >
                        {active && (
                          <motion.div
                            layoutId="activeComplexity"
                            className="absolute inset-0 bg-white rounded-lg shadow-sm border border-black/5"
                            style={{ zIndex: -1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          />
                        )}
                        {comp}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-400 leading-normal mt-1">
                  {sentenceComplexity === "simple" &&
                    "💡 Short, punchy sentences ideal for readability and quick skimming."}
                  {sentenceComplexity === "moderate" &&
                    "💡 Balanced structure representing typical B2B SaaS and industry tutorials."}
                  {sentenceComplexity === "advanced" &&
                    "💡 Multi-clause, detail-rich arguments ideal for technical deep dives."}
                </p>
              </div>

              {/* Formatting Constraints Card Grid */}
              <div className="space-y-3 pt-2 border-t border-black/[0.03]">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Structural Content Constraints
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Key Takeaways */}
                  <div
                    onClick={() => setAlwaysIncludeTakeaways(!alwaysIncludeTakeaways)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                      alwaysIncludeTakeaways
                        ? "border-[#FF5B04] bg-orange-50/10 shadow-[0_2px_12px_-4px_rgba(255,91,4,0.1)]"
                        : "border-black/[0.04] hover:border-black/[0.08] hover:bg-gray-50/50 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 ${alwaysIncludeTakeaways ? "bg-[#FF5B04] text-white" : "bg-gray-50 text-gray-400"}`}>
                        <CosIcon name="list" size={14} />
                      </div>
                      {/* Snappy hardware-accelerated CSS Toggle */}
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div className={`w-9 h-5 rounded-full transition-colors duration-150 ${alwaysIncludeTakeaways ? "bg-[#FF5B04]" : "bg-gray-200"}`} />
                        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-150 ${alwaysIncludeTakeaways ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className={`text-xs font-bold ${alwaysIncludeTakeaways ? "text-gray-900" : "text-gray-800"}`}>
                        Key Takeaways
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                        Always generate a 3-sentence highlight box at the top.
                      </p>
                    </div>
                  </div>

                  {/* FAQ */}
                  <div
                    onClick={() => setAlwaysIncludeFAQ(!alwaysIncludeFAQ)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                      alwaysIncludeFAQ
                        ? "border-[#FF5B04] bg-orange-50/10 shadow-[0_2px_12px_-4px_rgba(255,91,4,0.1)]"
                        : "border-black/[0.04] hover:border-black/[0.08] hover:bg-gray-50/50 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 ${alwaysIncludeFAQ ? "bg-[#FF5B04] text-white" : "bg-gray-50 text-gray-400"}`}>
                        <CosIcon name="community-insight" size={14} />
                      </div>
                      {/* Snappy hardware-accelerated CSS Toggle */}
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div className={`w-9 h-5 rounded-full transition-colors duration-150 ${alwaysIncludeFAQ ? "bg-[#FF5B04]" : "bg-gray-200"}`} />
                        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-150 ${alwaysIncludeFAQ ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className={`text-xs font-bold ${alwaysIncludeFAQ ? "text-gray-900" : "text-gray-800"}`}>
                        FAQ Section
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                        Always append an FAQ segment at the post footer.
                      </p>
                    </div>
                  </div>

                  {/* Auto CTA */}
                  <div
                    onClick={() => setAutoAppendCTA(!autoAppendCTA)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                      autoAppendCTA
                        ? "border-[#FF5B04] bg-orange-50/10 shadow-[0_2px_12px_-4px_rgba(255,91,4,0.1)]"
                        : "border-black/[0.04] hover:border-black/[0.08] hover:bg-gray-50/50 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className={`p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 ${autoAppendCTA ? "bg-[#FF5B04] text-white" : "bg-gray-50 text-gray-400"}`}>
                        <CosIcon name="megaphone" size={14} />
                      </div>
                      {/* Snappy hardware-accelerated CSS Toggle */}
                      <div className="relative flex-shrink-0 mt-0.5">
                        <div className={`w-9 h-5 rounded-full transition-colors duration-150 ${autoAppendCTA ? "bg-[#FF5B04]" : "bg-gray-200"}`} />
                        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-150 ${autoAppendCTA ? "translate-x-4" : "translate-x-0"}`} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className={`text-xs font-bold ${autoAppendCTA ? "text-gray-900" : "text-gray-800"}`}>
                        Auto CTA Block
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                        Auto-inject custom call-to-action footnote below drafts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call To Action (CTA) Template */}
              <div className="space-y-2 pt-2 border-t border-black/[0.03]">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Call To Action (CTA) Template
                </label>
                <textarea
                  className="w-full bg-gray-50/50 border border-black/[0.06] rounded-xl p-4 text-sm focus:border-[#FF5B04] focus:ring-4 focus:ring-[#FF5B04]/5 focus:bg-white outline-none transition-all resize-none leading-relaxed text-gray-700 font-medium placeholder:text-gray-400/80"
                  placeholder="e.g. Schedule a 15-minute SaaS design consultation with the UI Pirate crew today at https://uipirate.com!"
                  rows={3}
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Save Operations */}
        <div className="bg-gray-50 border-t border-black/[0.04] px-6 py-4 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-medium">
            💡 Changes will apply to all downstream AI writer prompts in real time.
          </span>
          <button
            className="bg-[#FF5B04] text-white text-xs font-semibold px-6 h-9 rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 flex-shrink-0"
            disabled={saving}
            type="submit"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
