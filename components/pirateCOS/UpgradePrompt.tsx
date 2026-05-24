"use client";

import { useState } from "react";

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  requiredCredits?: number;
  currentCredits?: number;
}

export default function UpgradePrompt({
  open,
  onClose,
  requiredCredits = 5.0,
  currentCredits = 0.0,
}: UpgradePromptProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!open) return null;

  const handleCheckout = async (type: "subscription" | "topup") => {
    setLoading(type);
    setErrorMsg(null);

    const isSubdomain = typeof window !== "undefined" && 
      (window.location.hostname.startsWith("cos.") || window.location.hostname === "cos.uipirate.com");
    const baseRedirect = isSubdomain ? "" : "/pirateCOS";

    try {
      const res = await fetch("/api/pirateCOS/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          successUrl: window.location.href.split("?")[0] + `?success=simulated-${type}`,
          cancelUrl: window.location.href.split("?")[0] + "?canceled=true",
        }),
      });
      const json = await res.json();
      
      if (res.ok && json.url) {
        window.location.href = json.url;
      } else {
        throw new Error(json.error || "Failed to trigger checkout session.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Stripe transaction session lookup failed.");
      setLoading(null);
    }
  };

  const isSubdomain = typeof window !== "undefined" && 
    (window.location.hostname.startsWith("cos.") || window.location.hostname === "cos.uipirate.com");
  const billingUrl = isSubdomain ? "/settings/billing" : "/pirateCOS/settings/billing";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-xl border border-black/5 w-full max-w-md mx-4 p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: "#FF5B04" }} />

        {/* Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-orange-100 animate-pulse">
            <span className="text-xl">⚡</span>
          </div>
          <h3 className="font-bold text-gray-900 font-geist text-lg tracking-tight">
            Insufficient Credits Balance
          </h3>
          <p className="text-xs text-gray-500 font-geist px-4">
            You need <span className="font-bold text-gray-800">{requiredCredits.toFixed(1)}</span> credits, but currently have <span className="font-bold text-red-500">{currentCredits.toFixed(1)}</span>.
          </p>
        </div>

        {/* Options Stack */}
        <div className="space-y-3 my-6">
          {/* Pro Subscription */}
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleCheckout("subscription")}
            className="w-full text-left p-3.5 rounded-xl border border-black/5 hover:border-[#FF5B04]/30 hover:bg-orange-50/10 transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-jetbrains-mono text-[#FF5B04] uppercase tracking-wider font-bold">Pro Subscription</span>
              <h4 className="font-bold text-gray-800 text-sm">Upgrade to Pro Tier</h4>
              <p className="text-[10px] text-gray-400">Unlock 500 daily credits, content API, & scheduled posts.</p>
            </div>
            <span className="text-xs font-bold text-white bg-[#FF5B04] px-3 py-1.5 rounded-lg group-hover:opacity-95 transition-opacity">
              $19/mo
            </span>
          </button>

          {/* Top-up Credits */}
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => handleCheckout("topup")}
            className="w-full text-left p-3.5 rounded-xl border border-black/5 hover:border-[#FF5B04]/30 hover:bg-orange-50/10 transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-wider font-bold">Credit Booster</span>
              <h4 className="font-bold text-gray-800 text-sm">Buy 1,000 Credits Booster</h4>
              <p className="text-[10px] text-gray-400">Add a one-time boost of 1,000 shared pool credits.</p>
            </div>
            <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border border-black/5 group-hover:bg-gray-200 transition-colors">
              $5
            </span>
          </button>

          {/* BYOK Link */}
          <a
            href={billingUrl}
            onClick={onClose}
            className="w-full text-left p-3.5 rounded-xl border border-dashed border-black/10 hover:border-black/20 hover:bg-black/[0.005] transition-all flex items-center justify-between group block"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-jetbrains-mono text-green-600 uppercase tracking-wider font-bold">BYOK Bypass</span>
              <h4 className="font-bold text-gray-800 text-sm">Bring Your Own Keys</h4>
              <p className="text-[10px] text-gray-400">Connect personal API keys for unlimited free credits.</p>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 rounded-lg">
              Bypass
            </span>
          </a>
        </div>

        {/* Errors Block */}
        {errorMsg && (
          <p className="text-xs text-red-500 font-medium text-center mb-4 leading-normal">{errorMsg}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            className="w-full py-2.5 rounded-xl text-xs font-semibold font-geist text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors border border-black/5 text-center"
            onClick={onClose}
            disabled={loading !== null}
          >
            Close / Return
          </button>
        </div>
      </div>
    </div>
  );
}
