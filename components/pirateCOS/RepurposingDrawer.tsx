import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatePresenceAny = AnimatePresence as any;

interface RepurposingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const REPURPOSE_FORMATS = [
  {
    id: "linkedin-thread",
    label: "LinkedIn Thread",
    desc: "10-slide carousel script",
    icon: "🔗",
  },
  {
    id: "twitter-thread",
    label: "Twitter Thread",
    desc: "8-12 sequential tweets",
    icon: "🐦",
  },
  {
    id: "newsletter",
    label: "Email Newsletter",
    desc: "Friendly HTML campaign template",
    icon: "📧",
  },
  {
    id: "summary",
    label: "Executive Summary",
    desc: "200-word digest + bullet takeaways",
    icon: "📝",
  },
  {
    id: "seo-meta",
    label: "SEO Meta Package",
    desc: "Focus slugs, tags and description limits",
    icon: "📊",
  },
  {
    id: "cta-blocks",
    label: "CTA Action Blocks",
    desc: "Soft, medium and hard CTA variations",
    icon: "⚡",
  },
  {
    id: "faq-schema",
    label: "Structured FAQ Schema",
    desc: "Standard Q&A rich snippets",
    icon: "❓",
  },
  {
    id: "infographic",
    label: "Infographic Blueprint",
    desc: "Layout structure & design scripts",
    icon: "📐",
  },
];

export default function RepurposingDrawer({
  isOpen,
  onClose,
  postId,
}: RepurposingDrawerProps) {
  const [selectedFormat, setSelectedFormat] = useState("linkedin-thread");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRepurpose = async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/pirateCOS/posts/${postId}/repurpose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: selectedFormat }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to transform content.");
      }
      setResult(data.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSimulatedPreview = () => {
    if (!result) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
          <span className="text-3xl mb-3 animate-bounce">🚀</span>
          <p className="text-sm font-bold text-gray-700 font-geist">
            Ready for Transformation
          </p>
          <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-relaxed">
            Select a target format and click generate to translate your post.
          </p>
        </div>
      );
    }

    if (selectedFormat === "linkedin-thread") {
      // Split into slides
      const slides = result.split(/Slide \d+/gi).filter(Boolean);

      return (
        <div className="space-y-4 p-4 font-geist bg-gray-50 rounded-xl max-h-[60vh] overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Simulated LinkedIn Feed Carousel
          </p>
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-black/5 p-4 shadow-sm relative"
            >
              <div className="flex items-center gap-2 border-b border-black/5 pb-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#FF5B04]/10 text-[#FF5B04] flex items-center justify-center font-bold text-xs">
                  UA
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 leading-none">
                    Vishal Anand
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5 leading-none">
                    Product Studio Founder
                  </p>
                </div>
                <span className="ml-auto bg-orange-50 text-[#FF5B04] text-[9px] font-bold px-2 py-0.5 rounded">
                  Slide {idx + 1}
                </span>
              </div>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-geist leading-relaxed">
                {slide.replace(/^:\s*/, "").trim()}
              </pre>
            </div>
          ))}
        </div>
      );
    }

    if (selectedFormat === "twitter-thread") {
      const tweets = result.split(/\d+\/|\d+\./gi).filter(Boolean);

      return (
        <div className="space-y-0.5 p-4 font-geist bg-gray-50 rounded-xl max-h-[60vh] overflow-y-auto relative">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Simulated Twitter/X Thread
          </p>
          <div className="absolute left-[34px] top-12 bottom-8 w-0.5 bg-gray-200" />
          {tweets.map((tweet, idx) => (
            <div key={idx} className="flex gap-3 relative mb-6">
              <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs z-10 flex-shrink-0">
                P9
              </div>
              <div className="bg-white rounded-xl border border-black/5 p-3 shadow-sm flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[11px] font-bold text-gray-900 leading-none">
                    UI Pirate
                  </span>
                  <span className="text-[9px] text-gray-400 leading-none">
                    @uipirate · {idx + 1}/
                  </span>
                </div>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-geist leading-relaxed">
                  {tweet.trim()}
                </pre>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedFormat === "newsletter") {
      return (
        <div className="p-4 bg-gray-50 rounded-xl max-h-[60vh] overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Newsletter Email Preview
          </p>
          <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6 space-y-4">
            <div className="border-b border-black/5 pb-3">
              <p className="text-[10px] font-semibold text-gray-400">
                Subject: Dynamic Content Syndication Announcement 🚀
              </p>
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: result }}
              className="text-xs text-gray-700 leading-relaxed font-geist newsletter-preview space-y-3"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-gray-50 rounded-xl max-h-[60vh] overflow-y-auto font-geist">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          Generated Raw Assets Output
        </p>
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4">
          <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-geist">
            {result}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresenceAny>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 0.3 }}
            className="fixed inset-0 bg-black"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            animate={{ x: 0 }}
            className="w-full max-w-4xl bg-white h-full shadow-2xl relative z-50 flex flex-col font-geist border-l border-l-black/5"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5B04] flex items-center justify-center font-bold text-base shadow-sm border border-[#FF5B04]/10">
                  ⚡
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Multi-Format Content Transformation
                  </h2>
                  <p className="text-[11px] text-gray-400 leading-none mt-0.5">
                    Repurpose articles into 8 distinct high-engagement assets in
                    seconds.
                  </p>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
                type="button"
                onClick={onClose}
              >
                <svg
                  fill="none"
                  height="18"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* Split Content */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
              {/* Form Side (col-span-5) */}
              <div className="md:col-span-5 border-r border-black/5 p-6 overflow-y-auto flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Select Target Channel Format
                  </p>

                  <div className="space-y-2">
                    {REPURPOSE_FORMATS.map((f) => {
                      const selected = selectedFormat === f.id;

                      return (
                        <button
                          key={f.id}
                          className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all duration-150 ${
                            selected
                              ? "border-[#FF5B04] bg-orange-50/10 shadow-sm"
                              : "border-black/5 hover:border-black/10 bg-white"
                          }`}
                          type="button"
                          onClick={() => setSelectedFormat(f.id)}
                        >
                          <span className="text-lg leading-none mt-0.5">
                            {f.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900">
                              {f.label}
                            </p>
                            <p className="text-[9px] text-gray-400 mt-0.5 leading-snug truncate">
                              {f.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 mt-6">
                  {error && (
                    <p className="text-xs text-red-500 font-semibold mb-3">
                      ✗ {error}
                    </p>
                  )}
                  <button
                    className="w-full bg-[#FF5B04] text-white text-xs font-bold py-3 px-4 rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={loading}
                    type="button"
                    onClick={handleRepurpose}
                  >
                    {loading ? (
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
                        Transforming Draft...
                      </>
                    ) : (
                      "Generate Repurposed Content"
                    )}
                  </button>
                </div>
              </div>

              {/* Preview Side (col-span-7) */}
              <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col bg-gray-50/50 justify-between">
                <div className="flex-1 overflow-hidden">
                  {renderSimulatedPreview()}
                </div>

                {result && (
                  <div className="pt-4 border-t border-black/5 mt-4 flex justify-end gap-3 flex-shrink-0">
                    <button
                      className="border border-black/10 text-gray-600 bg-white text-xs font-bold py-2 px-5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                      type="button"
                      onClick={handleCopy}
                    >
                      <svg
                        fill="none"
                        height="12"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        width="12"
                      >
                        <rect
                          height="13"
                          rx="2"
                          ry="2"
                          width="13"
                          x="8"
                          y="8"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      {copied ? "✓ Copied!" : "Copy Output"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresenceAny>
  );
}
