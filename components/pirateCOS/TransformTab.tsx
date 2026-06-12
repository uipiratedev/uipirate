import React, { useState } from "react";
import CosIcon from "./CosIcon";
import { REPURPOSE_FORMATS, renderFormatPreview } from "./RepurposingDrawer";
import { AIEngine } from "@/lib/pirateCOS/ai-registry";

interface TransformTabProps {
  postId: string | null;
  postTitle: string;
  repurposedOutputs?: Record<string, string>;
  onUpdateRepurposedOutputs?: (outputs: Record<string, string>) => void;
  selectedFormat: string | null;
  setSelectedFormat: (format: string | null) => void;
  selectedEngine?: AIEngine;
  selectedModel?: string;
}

export default function TransformTab({
  postId,
  postTitle,
  repurposedOutputs = {},
  onUpdateRepurposedOutputs,
  selectedFormat,
  setSelectedFormat,
  selectedEngine,
  selectedModel,
}: TransformTabProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showMaximizeModal, setShowMaximizeModal] = useState(false);

  const handleGenerate = async (fmtId: string) => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pirateCOS/posts/${postId}/repurpose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: fmtId,
          ...(selectedEngine && { engine: selectedEngine }),
          ...(selectedModel && { model: selectedModel }),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to transform content.");
      }
      
      const updatedOutputs = {
        ...repurposedOutputs,
        [fmtId]: data.data,
      };
      
      // Save to parent state
      onUpdateRepurposedOutputs?.(updatedOutputs);

      // Persist to DB immediately so outputs survive a refresh
      await fetch(`/api/pirateCOS/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repurposedOutputs: updatedOutputs }),
      });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeMeta = REPURPOSE_FORMATS.find((f) => f.id === selectedFormat);
  const activeOutput = selectedFormat ? repurposedOutputs[selectedFormat] : null;

  const isSubdomain = typeof window !== "undefined" && (window.location.hostname.startsWith("cos.") || window.location.hostname === "cos.uipirate.com");
  const getHref = (path: string) => (isSubdomain ? path : `/pirateCOS${path}`);

  return (
    <div className="flex flex-col h-full overflow-hidden font-geist">
      {/* ── List View ── */}
      {!selectedFormat ? (
        <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Repurpose your post into high-converting assets. Select a format below to generate and preview:
          </p>
          <div className="space-y-2">
            {REPURPOSE_FORMATS.map((fmt) => {
              const isGenerated = !!repurposedOutputs[fmt.id];
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedFormat(fmt.id)}
                  className="w-full text-left p-3 rounded-xl border border-black/5 hover:border-[#FF5B04]/30 bg-white hover:bg-orange-50/20 transition-all flex items-start gap-3 group cursor-pointer shadow-sm"
                >
                  <span className="mt-0.5 flex-shrink-0 text-gray-400 group-hover:text-[#FF5B04] transition-colors">
                    <CosIcon name={fmt.icon} size={15} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF5B04] transition-colors truncate">
                        {fmt.label}
                      </span>
                      {isGenerated && (
                        <span className="text-[8px] font-extrabold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full flex-shrink-0 animate-in fade-in">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 block mt-0.5 font-geist">
                      {fmt.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Detail View ── */
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Detail Header */}
          <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedFormat(null);
                setError(null);
              }}
              className="text-[10px] font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer"
            >
              ← Back
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-800 truncate max-w-[120px] capitalize">
                {activeMeta?.label}
              </span>
              {activeOutput && (
                <button
                  type="button"
                  onClick={() => setShowMaximizeModal(true)}
                  className="w-5 h-5 rounded-md flex items-center justify-center border border-black/5 bg-white text-gray-500 hover:text-[#FF5B04] hover:bg-orange-50 hover:border-[#FF5B04]/30 transition-all shadow-sm cursor-pointer"
                  title="Maximize Preview"
                >
                  <svg fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="10">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Detail Body */}
          <div className="flex-1 overflow-y-auto pr-0.5 min-h-0 flex flex-col justify-between">
            <div className="space-y-4 flex-1">
              <div className="p-3.5 bg-gray-50 border border-black/5 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                  Format Goal
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {activeMeta?.desc}. Translates key strategic arguments from your draft into optimized layouts.
                </p>
              </div>

              {error && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in slide-in-from-top-1 duration-200">
                  <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg fill="none" height="14" stroke="#ef4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="14">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-red-700 mb-0.5">Generation Failed</p>
                    <p className="text-[10px] text-red-600 leading-relaxed">{error}</p>
                    <p className="text-[10px] text-red-400 mt-1.5">Try switching to a different AI model using the selector above.</p>
                  </div>
                </div>
              )}

              {/* Mini Preview inside Sidebar */}
              {activeOutput ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 font-jetbrains-mono uppercase tracking-widest">
                      Preview
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeOutput)}
                      className="text-[9px] font-bold text-[#FF5B04] hover:underline"
                    >
                      {copied ? "✓ Copied!" : "Copy Output"}
                    </button>
                  </div>
                  <div className="p-3 bg-white border border-black/5 rounded-xl max-h-56 overflow-y-auto shadow-sm">
                    <pre className="text-[10px] text-gray-600 whitespace-pre-wrap font-geist leading-relaxed">
                      {activeOutput}
                    </pre>
                  </div>
                </div>
              ) : (
                /* Empty state when not generated */
                <div className="py-6 flex flex-col items-center justify-center text-center text-gray-400">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                    <CosIcon name="bolt" size={16} className="text-[#FF5B04]" />
                  </div>
                  <p className="text-xs font-bold text-gray-700">Not Generated Yet</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] leading-relaxed">
                    Click the button below to generate this spinoff with AI.
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-black/5 mt-4">
              {postId ? (
                <button
                  type="button"
                  onClick={() => selectedFormat && handleGenerate(selectedFormat)}
                  disabled={loading}
                  className="w-full text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  style={{ background: "#FF5B04" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
                      </svg>
                      Transforming…
                    </>
                  ) : activeOutput ? (
                    "↻ Re-generate Spinoff"
                  ) : (
                    "Generate Spinoff"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full text-xs font-bold py-2.5 px-4 rounded-xl bg-gray-50 text-gray-400 border border-black/5 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Save Draft to Enable
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Maximize Full Screen Modal ── */}
      {showMaximizeModal && activeMeta && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300"
          onClick={() => setShowMaximizeModal(false)}
        >
          <div
            className="bg-white rounded-[32px] shadow-2xl border border-black/5 w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 text-left font-geist"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-black/5 bg-gray-50/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-base shadow-sm border border-orange-100/30">
                  <CosIcon name="bolt" size={18} className="text-[#FF5B04] fill-[#FF5B04]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">
                    Spinoff Preview: {activeMeta.label}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
                    Review and copy high-fidelity simulated previews of generated assets.
                  </p>
                </div>
              </div>
              <button
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-all cursor-pointer"
                onClick={() => setShowMaximizeModal(false)}
              >
                <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="16">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* Modal Split Content */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
              {/* Left Selector Rail */}
              <div className="md:col-span-4 border-r border-black/5 p-6 overflow-y-auto flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Spinoff Format
                  </p>
                  <div className="space-y-2">
                    {REPURPOSE_FORMATS.map((fmt) => {
                      const selected = selectedFormat === fmt.id;
                      const isGenerated = !!repurposedOutputs[fmt.id];
                      return (
                        <button
                          key={fmt.id}
                          className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all duration-150 cursor-pointer ${
                            selected
                              ? "border-[#FF5B04]/40 bg-orange-50/30 shadow-sm"
                              : "border-black/5 hover:border-[#FF5B04]/20 hover:bg-orange-50/10 bg-white"
                          }`}
                          type="button"
                          onClick={() => {
                            setSelectedFormat(fmt.id);
                            setError(null);
                          }}
                        >
                          <span className="text-lg leading-none mt-0.5">
                            <CosIcon name={fmt.icon} size={18} className={selected ? "text-[#FF5B04]" : "text-gray-400"} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-bold ${selected ? "text-[#FF5B04]" : "text-gray-900"}`}>
                                {fmt.label}
                              </p>
                              {isGenerated && (
                                <span className="text-[8px] font-extrabold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-gray-400 mt-0.5 leading-snug truncate">
                              {fmt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 mt-6 flex-shrink-0">
                  <button
                    className="w-full text-white text-xs font-bold py-3 px-4 rounded-xl hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    disabled={loading}
                    style={{ background: "#FF5B04" }}
                    onClick={() => selectedFormat && handleGenerate(selectedFormat)}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
                        </svg>
                        Transforming…
                      </>
                    ) : activeOutput ? (
                      "↻ Re-generate Spinoff"
                    ) : (
                      "Generate Spinoff"
                    )}
                  </button>
                </div>
              </div>

              {/* Right Simulation Preview Area */}
              <div className="md:col-span-8 p-6 overflow-hidden flex flex-col justify-between bg-gray-50/50">
                <div className="flex-1 overflow-hidden flex flex-col">
                  {activeOutput ? (
                    <div className="flex-1 overflow-y-auto">
                      {renderFormatPreview(selectedFormat ?? "", activeOutput, postTitle)}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-orange-50 shadow-sm shadow-orange-100">
                        <CosIcon name="bolt" size={24} className="text-[#FF5B04] fill-[#FF5B04]" />
                      </div>
                      <p className="text-sm font-bold text-gray-800 mb-1">
                        Ready to Transform
                      </p>
                      <p className="text-xs text-gray-400 max-w-[260px] leading-relaxed">
                        Click "Generate Spinoff" on the left to repurpose this post into {activeMeta.label}.
                      </p>
                    </div>
                  )}
                </div>

                {activeOutput && (
                  <div className="pt-4 border-t border-black/5 mt-4 flex justify-end gap-3 flex-shrink-0">
                    <button
                      className="border border-black/10 text-gray-600 bg-white text-xs font-bold py-2.5 px-5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      type="button"
                      onClick={() => handleCopy(activeOutput)}
                    >
                      <svg fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="12">
                        <rect height="13" rx="2" ry="2" width="13" x="8" y="8" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      {copied ? "✓ Copied!" : "Copy Output"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
