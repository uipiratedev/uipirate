"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BrandBrainData {
  companyName: string;
  brandVoice: string;
  products: string;
  audienceICP: string;
  targetKeywords: string[];
  forbiddenWords: string[];
  callToActionTemplate?: string;
}

const BRAND_VOICE_PRESETS = [
  {
    value: "Professional & Authoritative",
    label: "Professional & Authoritative",
    desc: "Expert, trustworthy, and industry-leading tone suitable for corporate, B2B, or enterprise audiences.",
  },
  {
    value: "Conversational & Friendly",
    label: "Conversational & Friendly",
    desc: "Approachable, warm, and highly engaging style that builds a strong human connection.",
  },
  {
    value: "Bold & Energetic",
    label: "Bold & Energetic",
    desc: "Inspiring, creative, and action-oriented tone that challenges the status quo.",
  },
  {
    value: "Empathetic & Supportive",
    label: "Empathetic & Supportive",
    desc: "Compassionate and helpful tone focused on solving deep customer pain points with care.",
  },
  {
    value: "Sleek & Minimalist",
    label: "Sleek & Minimalist",
    desc: "Premium, refined, and understated copy focusing on high-concept design principles.",
  },
];

export default function BrandBrainPage() {
  const router = useRouter();

  // Loading & State variables
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandBrain, setBrandBrain] = useState<BrandBrainData | null>(null);

  // Tab control ("identity" | "audience" | "vocabulary")
  const [activeTab, setActiveTab] = useState<
    "identity" | "audience" | "vocabulary"
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
        <p className="text-sm font-semibold font-geist text-gray-500">
          Loading AI Brand Brain profile...
        </p>
      </div>
    );
  }

  // ---------------- WIZARD STATE (Onboarding) ----------------
  if (!brandBrain) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 font-geist text-gray-700">
        {/* Banner Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(255,91,4,0.08)", color: "#FF5B04" }}
          >
            <svg
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-geist text-gray-900 leading-tight">
            Welcome to your AI Brand Brain
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
            Configure your brand identity and audience rules once. Our writing
            copilots will dynamically inject these guidelines into every single
            AI post.
          </p>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex items-center justify-between px-6 mb-6">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-jetbrains-mono transition-colors ${
                    wizardStep === step
                      ? "bg-[#FF5B04] text-white"
                      : wizardStep > step
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {wizardStep > step ? "✓" : step}
                </div>
                <span
                  className={`text-xs font-semibold ${wizardStep === step ? "text-gray-900 font-bold" : "text-gray-400"}`}
                >
                  {step === 1
                    ? "Brand & Voice"
                    : step === 2
                      ? "Offerings & ICP"
                      : "Vocabulary Guard"}
                </span>
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${wizardStep > step ? "bg-green-500" : "bg-gray-100"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Wizard Card Body */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden p-6 md:p-8">
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-100 p-3.5 rounded-xl flex items-start gap-2">
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
              transition={{ duration: 0.2 }}
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Define Brand Identity
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed mt-1">
                  Specify your company details and core brand voice parameters.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Company / Brand Name
                </label>
                <input
                  className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                  placeholder="e.g. UI Pirate, Acme Corp"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Brand Voice / Tone Presets
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {BRAND_VOICE_PRESETS.map((preset) => {
                    const selected = brandVoice === preset.value;

                    return (
                      <button
                        key={preset.value}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          selected
                            ? "border-[#FF5B04] bg-orange-50/10 shadow-sm"
                            : "border-black/5 hover:border-black/10 bg-white"
                        }`}
                        type="button"
                        onClick={() => setBrandVoice(preset.value)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${selected ? "border-[#FF5B04]" : "border-gray-300"}`}
                          >
                            {selected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5B04]" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">
                              {preset.label}
                            </p>
                            <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">
                              {preset.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  className="bg-[#FF5B04] text-white text-xs font-semibold px-5 h-9 rounded-lg hover:opacity-95 transition-opacity"
                  type="button"
                  onClick={() => {
                    if (!companyName.trim())
                      return setErrorMsg(
                        "Please provide a company/brand name.",
                      );
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
              transition={{ duration: 0.2 }}
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Define Products & Target ICP
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed mt-1">
                  Help the AI write accurately about what you sell and who your
                  buyers are.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Products / Services Description
                </label>
                <textarea
                  className="w-full bg-[#F7F7F6] border border-transparent rounded-xl p-4 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all resize-none leading-relaxed"
                  placeholder="Describe what your company does, your unique offerings, and what value you generate (e.g. We are a premium UI/UX agency that designs high-converting SaaS interfaces and mobile apps with timing-safe motion principles)."
                  rows={4}
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Target Ideal Customer Profile (ICP)
                </label>
                <textarea
                  className="w-full bg-[#F7F7F6] border border-transparent rounded-xl p-4 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all resize-none leading-relaxed"
                  placeholder="Describe your ideal customers, their pain points, and why they buy (e.g. Growth-stage B2B SaaS founders, Product Managers, and CTOs who are struggling with high user churn and outdated layouts)."
                  rows={4}
                  value={audienceICP}
                  onChange={(e) => setAudienceICP(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  className="border border-black/10 text-gray-500 text-xs font-semibold px-5 h-9 rounded-lg hover:bg-gray-50 transition-colors"
                  type="button"
                  onClick={() => setWizardStep(1)}
                >
                  Back
                </button>
                <button
                  className="bg-[#FF5B04] text-white text-xs font-semibold px-5 h-9 rounded-lg hover:opacity-95 transition-opacity"
                  type="button"
                  onClick={() => {
                    if (!products.trim())
                      return setErrorMsg(
                        "Please describe your products or services.",
                      );
                    if (!audienceICP.trim())
                      return setErrorMsg(
                        "Please define your target ICP/audience profile.",
                      );
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
              transition={{ duration: 0.2 }}
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Define Vocabulary Guard
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed mt-1">
                  Add target keywords you want to promote, and forbidden words
                  the AI must completely filter out.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Target Keywords to Promote
                </label>
                <input
                  className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                  placeholder="Type a keyword and press Enter or Comma..."
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                />
                {targetKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {targetKeywords.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-50 text-[#FF5B04] border border-[#FF5B04]/10 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1.5"
                      >
                        {tag}
                        <button
                          className="text-red-500 hover:text-red-700 font-bold"
                          type="button"
                          onClick={() => removeKeyword(idx)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block text-red-600">
                  Forbidden Words / Vocabulary (To Completely Avoid)
                </label>
                <input
                  className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                  placeholder="Type a word to completely ban and press Enter or Comma..."
                  type="text"
                  value={forbiddenInput}
                  onChange={(e) => setForbiddenInput(e.target.value)}
                  onKeyDown={handleAddForbidden}
                />
                {forbiddenWords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {forbiddenWords.map((word, idx) => (
                      <span
                        key={idx}
                        className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1.5"
                      >
                        {word}
                        <button
                          className="text-red-500 hover:text-red-700 font-bold"
                          type="button"
                          onClick={() => removeForbidden(idx)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Standard Call To Action (CTA) footer (Optional)
                </label>
                <input
                  className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Schedule a 15-minute SaaS strategy call with the UI Pirate crew today!"
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-black/5">
                <button
                  className="border border-black/10 text-gray-500 text-xs font-semibold px-5 h-9 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={saving}
                  type="button"
                  onClick={() => setWizardStep(2)}
                >
                  Back
                </button>
                <button
                  className="bg-[#FF5B04] text-white text-xs font-semibold px-6 h-9 rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
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
    <div className="max-w-5xl mx-auto px-4 py-6 font-geist text-gray-700 space-y-6">
      {/* Visual Workspace Banner */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,91,4,0.08)", color: "#FF5B04" }}
          >
            <svg
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
            >
              <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
              <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-geist">
              AI Brand Brain
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-lg leading-relaxed">
              Your company identity rules are fully active. All downstream AI
              writing copilots automatically read these settings to preserve
              voice consistency.
            </p>
          </div>
        </div>

        {/* Completeness Indicator */}
        <div className="flex items-center gap-4 bg-[#F7F7F6] p-3 rounded-2xl border border-black/5 flex-shrink-0 min-w-[200px]">
          <div className="relative w-11 h-11 rounded-full flex items-center justify-center bg-white shadow-sm border border-black/5">
            <span className="text-xs font-bold text-gray-800 font-jetbrains-mono">
              {completeness}%
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">
              Brain Completeness
            </p>
            <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">
              {completeness === 100
                ? "Highly comprehensive profile!"
                : "Add more fields to hit 100%."}
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl flex items-start gap-2.5 animate-fade-in">
          <span className="text-emerald-500 font-bold">✓</span>
          <p className="text-xs text-emerald-700 font-medium leading-relaxed">
            {successMsg}
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl flex items-start gap-2.5 animate-fade-in">
          <span className="text-red-500 font-bold">✗</span>
          <p className="text-xs text-red-700 font-medium leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}

      {/* Workspace Tabs & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Tabs (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-1">
          <p className="text-[9px] font-jetbrains-mono text-gray-400 uppercase tracking-widest px-2.5 mb-2">
            Workspace Tabs
          </p>
          {[
            {
              id: "identity",
              label: "Brand Identity",
              desc: "Names, tone presets, CTAs",
            },
            {
              id: "audience",
              label: "Audience & ICP",
              desc: "Selling value & segments",
            },
            {
              id: "vocabulary",
              label: "Vocabulary Guard",
              desc: "Keywords and bans",
            },
          ].map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 ${
                  active
                    ? "bg-orange-50/30 text-[#FF5B04]"
                    : "hover:bg-gray-50 text-gray-500 hover:text-gray-800"
                }`}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
              >
                <p
                  className={`text-xs font-semibold ${active ? "font-bold" : ""}`}
                >
                  {tab.label}
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5">{tab.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Tab Form Details (col-span-9) */}
        <form
          className="lg:col-span-9 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col min-h-[400px]"
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
                <div className="border-b border-black/5 pb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Brand Identity Profile
                  </h2>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                    Details basic company metadata and visual tone directions.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Company / Brand Name
                  </label>
                  <input
                    className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                    placeholder="e.g. UI Pirate"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Brand Voice / Tone Presets
                  </label>
                  <select
                    className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all cursor-pointer"
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                  >
                    {BRAND_VOICE_PRESETS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Call To Action (CTA) Template
                  </label>
                  <input
                    className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                    placeholder="Standard CTA footer attached to drafts..."
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                  />
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
                <div className="border-b border-black/5 pb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Audience & ICP Profiles
                  </h2>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                    Describe what you offer and identify your prime target
                    audience segment.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Products / Services Description
                  </label>
                  <textarea
                    className="w-full bg-[#F7F7F6] border border-transparent rounded-xl p-4 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all resize-none leading-relaxed"
                    placeholder="e.g. SaaS and web development consulting..."
                    rows={5}
                    value={products}
                    onChange={(e) => setProducts(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Target Ideal Customer Profile (ICP)
                  </label>
                  <textarea
                    className="w-full bg-[#F7F7F6] border border-transparent rounded-xl p-4 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all resize-none leading-relaxed"
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
                <div className="border-b border-black/5 pb-3">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Vocabulary & Content Guard
                  </h2>
                  <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">
                    Define target keywords to integrate and forbidden terms to
                    completely ban.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                    Target Keywords to Promote
                  </label>
                  <input
                    className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                    placeholder="Add keyword and press Enter or Comma..."
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleAddKeyword}
                  />
                  {targetKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {targetKeywords.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-orange-50 text-[#FF5B04] border border-[#FF5B04]/10 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1.5"
                        >
                          {tag}
                          <button
                            className="text-red-500 hover:text-red-700 font-bold"
                            type="button"
                            onClick={() => removeKeyword(idx)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block text-red-600">
                    Forbidden Vocabulary (Completely Avoid)
                  </label>
                  <input
                    className="w-full bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all"
                    placeholder="Add prohibited term and press Enter or Comma..."
                    type="text"
                    value={forbiddenInput}
                    onChange={(e) => setForbiddenInput(e.target.value)}
                    onKeyDown={handleAddForbidden}
                  />
                  {forbiddenWords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {forbiddenWords.map((word, idx) => (
                        <span
                          key={idx}
                          className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1.5"
                        >
                          {word}
                          <button
                            className="text-red-500 hover:text-red-700 font-bold"
                            type="button"
                            onClick={() => removeForbidden(idx)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Save Operations */}
          <div className="bg-[#F7F7F6] border-t border-black/5 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-medium">
              💡 Changes will apply to all downstream AI writer prompts in real
              time.
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
    </div>
  );
}
