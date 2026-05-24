"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

interface UsageData {
  plan: string;
  creditsRemaining: number;
  usageThisMonth: {
    aiRequests: number;
    distributions: number;
  };
  byokEnabled: {
    openai: boolean;
    gemini: boolean;
    mistral: boolean;
    anthropic: boolean;
  };
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  hasKeys: {
    openai: boolean;
    gemini: boolean;
    mistral: boolean;
    anthropic: boolean;
  };
}

export default function BillingSettingsPage() {
  const { user, refreshAuth } = useAuth();
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingBYOK, setUpdatingBYOK] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // BYOK form keys
  const [keysForm, setKeysForm] = useState({
    openaiKey: "",
    geminiKey: "",
    mistralKey: "",
  });
  const [savingKeys, setSavingKeys] = useState(false);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/pirateCOS/billing/usage");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Failed to query usage metrics", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
    
    // Check URL parameters for Stripe session callbacks
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setSuccessMsg("🎉 Thank you! Your Stripe transaction completed successfully.");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("success")?.startsWith("simulated-")) {
      const type = params.get("success")?.split("-")[1];
      setSuccessMsg(`🚀 [Sandbox] Checkout simulation successful! ${type === "subscription" ? "Pro Plan activated (500 credits added)" : "1,000 Credits booster credited."}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      refreshAuth();
    } else if (params.get("canceled") === "true") {
      setErrorMsg("⚠️ Stripe transaction was canceled.");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("portal") === "simulated") {
      setSuccessMsg("ℹ️ [Sandbox] Stripe self-service Portal bypass triggered successfully.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [fetchUsage, refreshAuth]);

  const handleToggleBYOK = async (provider: "openai" | "gemini" | "mistral" | "anthropic") => {
    if (!data) return;
    
    // Warn the user if they enable BYOK but have no keys saved
    if (!data.byokEnabled[provider] && !data.hasKeys[provider]) {
      alert(`⚠️ You have not connected an API key for ${provider.toUpperCase()} yet. Please input your key first before enabling Bring Your Own Key bypass.`);
      return;
    }

    setUpdatingBYOK(true);
    const nextBYOK = {
      ...data.byokEnabled,
      [provider]: !data.byokEnabled[provider],
    };

    try {
      const res = await fetch("/api/pirateCOS/billing/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ byokEnabled: nextBYOK }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => prev ? { ...prev, byokEnabled: json.byokEnabled } : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingBYOK(false);
    }
  };

  const saveApiKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKeys(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/pirateCOS/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keysForm),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to encrypt keys.");
      }

      setSuccessMsg("🔐 Custom API keys safely encrypted and stored in database.");
      setKeysForm({ openaiKey: "", geminiKey: "", mistralKey: "" });
      await fetchUsage();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save API keys");
    } finally {
      setSavingKeys(false);
    }
  };

  const handleCheckout = async (type: "subscription" | "topup") => {
    setProcessingCheckout(type);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/pirateCOS/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const json = await res.json();
      
      if (res.ok && json.url) {
        window.location.href = json.url;
      } else {
        throw new Error(json.error || "Failed to trigger checkout session.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Stripe transaction session lookup failed.");
      setProcessingCheckout(null);
    }
  };

  const handlePortal = async () => {
    setProcessingCheckout("portal");
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/pirateCOS/billing/portal", {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok && json.url) {
        window.location.href = json.url;
      } else {
        throw new Error(json.error || "Failed to allocate Stripe Portal link.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Portal trigger failed.");
      setProcessingCheckout(null);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-sm text-gray-400 font-geist">
        Loading billing control suite...
      </div>
    );
  }

  const isPro = data.plan === "pro";
  const planLabel = data.plan.toUpperCase();

  return (
    <div className="space-y-8 px-8 py-4 font-geist text-gray-700 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="pt-2">
        <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1" style={{ color: "#FF5B04" }}>
          Subscription Settings
        </p>
        <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">
          Billing & Usage Pools
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your usage boundaries, purchase top-up credits, and toggle custom BYOK access toggles.
        </p>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl text-sm flex items-start gap-3 shadow-sm animate-fade-in">
          <span className="font-bold flex-shrink-0 text-base">✓</span>
          <p>{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-2xl text-sm flex items-start gap-3 shadow-sm animate-fade-in">
          <span className="font-bold flex-shrink-0 text-base">✗</span>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* TIER STATUS & PROGRESS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 flex flex-col justify-between md:col-span-1">
          <div className="space-y-2">
            <span className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest block">Active Plan</span>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-black tracking-tight text-gray-800 font-geist">
                {planLabel}
              </h2>
              {data.subscriptionStatus === "active" && (
                <span className="text-[9px] font-jetbrains-mono bg-green-50 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border border-green-100">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 leading-normal pt-1">
              {data.plan === "free" && "Enjoy cheap shared-AI models. Upgrade to get scheduled publishing, full content API, and custom keys."}
              {data.plan === "pro" && "Full multi-channel publishing, full content API keys, custom scheduling, and Bring Your Own Key bypass."}
            </p>
            {data.currentPeriodEnd && (
              <p className="text-[10px] text-gray-400 font-jetbrains-mono pt-2">
                Renewal: {new Date(data.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-black/[0.03] mt-4">
            {isPro ? (
              <button
                type="button"
                onClick={handlePortal}
                disabled={processingCheckout !== null}
                className="w-full text-xs font-semibold bg-white text-gray-700 hover:bg-black/[0.02] border border-black/10 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                {processingCheckout === "portal" ? "Directing..." : "Manage Subscription"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleCheckout("subscription")}
                disabled={processingCheckout !== null}
                className="w-full text-xs font-bold text-white py-2.5 rounded-xl text-center hover:opacity-95 transition-opacity shadow-sm flex items-center justify-center gap-1.5"
                style={{ background: "#FF5B04" }}
              >
                {processingCheckout === "subscription" ? "Processing..." : "Upgrade to Pro ($19/mo)"}
              </button>
            )}
          </div>
        </div>

        {/* Credit Meter Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5 md:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-widest block">Credits Balance</span>
                <h3 className="text-3xl font-black tracking-tight text-gray-800 font-geist mt-1">
                  {data.creditsRemaining.toFixed(1)}{" "}
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">credits</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-jetbrains-mono text-gray-400 uppercase tracking-widest block">Monthly Usage</span>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  📄 {data.usageThisMonth.aiRequests} AIs · 🔗 {data.usageThisMonth.distributions} Pubs
                </p>
              </div>
            </div>

            {/* Custom Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Free Pool Capacity</span>
                <span className="font-semibold">{Math.min(100, Math.max(0, (data.creditsRemaining / 20) * 100)).toFixed(0)}% balance</span>
              </div>
              <div className="w-full h-3 bg-black/[0.04] rounded-full overflow-hidden p-0.5 border border-black/[0.02]">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, (data.creditsRemaining / 20) * 100))}%`,
                    background: data.creditsRemaining < 5.0 ? "#EF4444" : "#FF5B04",
                  }}
                />
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                Generations cost 5.0 credits; outbound distributions cost 1.0; enhancements cost 0.5. BYOK runs cost **0** credits.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.03] mt-4 flex items-center justify-between gap-4">
            <div className="text-xs text-gray-400 leading-snug">
              Need extra shared pool resources? Get a booster pack.
            </div>
            <button
              type="button"
              onClick={() => handleCheckout("topup")}
              disabled={processingCheckout !== null}
              className="text-xs font-semibold bg-white text-gray-700 hover:bg-black/[0.02] border border-black/10 px-4 py-2 rounded-xl transition-all shadow-sm flex-shrink-0 flex items-center justify-center gap-1.5"
            >
              {processingCheckout === "topup" ? "Directing..." : "Buy 1,000 Credits ($5)"}
            </button>
          </div>
        </div>
      </div>

      {/* BYOK CONFIG PANEL */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.05]">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-jetbrains-mono flex items-center gap-1.5">
            🔐 Bring Your Own Key (BYOK) Bypass
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">
            Configure personal API keys to run heavy writing volumes. Toggling BYOK active **bypasses credit deductions entirely**!
          </p>
        </div>

        {/* Toggles Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.05] border-b border-black/[0.05]">
          {/* OpenAI */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">OpenAI BYOK</h4>
              <p className="text-[10px] text-gray-400 pt-0.5">
                Key status: {data.hasKeys.openai ? "🟢 Configured" : "🔴 Missing Key"}
              </p>
            </div>
            <button
              type="button"
              disabled={updatingBYOK}
              onClick={() => handleToggleBYOK("openai")}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                data.byokEnabled.openai ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 block ${
                  data.byokEnabled.openai ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Gemini */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Gemini BYOK</h4>
              <p className="text-[10px] text-gray-400 pt-0.5">
                Key status: {data.hasKeys.gemini ? "🟢 Configured" : "🔴 Missing Key"}
              </p>
            </div>
            <button
              type="button"
              disabled={updatingBYOK}
              onClick={() => handleToggleBYOK("gemini")}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                data.byokEnabled.gemini ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 block ${
                  data.byokEnabled.gemini ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Mistral */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Mistral BYOK</h4>
              <p className="text-[10px] text-gray-400 pt-0.5">
                Key status: {data.hasKeys.mistral ? "🟢 Configured" : "🔴 Missing Key"}
              </p>
            </div>
            <button
              type="button"
              disabled={updatingBYOK}
              onClick={() => handleToggleBYOK("mistral")}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors relative flex items-center ${
                data.byokEnabled.mistral ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 block ${
                  data.byokEnabled.mistral ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Input Keys Form */}
        <form onSubmit={saveApiKeys} className="p-5 space-y-4 bg-black/[0.005]">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-jetbrains-mono">
            Encrypt & Update Keys
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                className="w-full text-xs font-geist bg-white rounded-lg px-3 py-2 border border-black/10 outline-none"
                placeholder={data.hasKeys.openai ? "••••••••••••••••" : "Paste sk-... key"}
                value={keysForm.openaiKey}
                onChange={(e) => setKeysForm((p) => ({ ...p, openaiKey: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                className="w-full text-xs font-geist bg-white rounded-lg px-3 py-2 border border-black/10 outline-none"
                placeholder={data.hasKeys.gemini ? "••••••••••••••••" : "Paste AIza... key"}
                value={keysForm.geminiKey}
                onChange={(e) => setKeysForm((p) => ({ ...p, geminiKey: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                Mistral API Key
              </label>
              <input
                type="password"
                className="w-full text-xs font-geist bg-white rounded-lg px-3 py-2 border border-black/10 outline-none"
                placeholder={data.hasKeys.mistral ? "••••••••••••••••" : "Paste mistral... key"}
                value={keysForm.mistralKey}
                onChange={(e) => setKeysForm((p) => ({ ...p, mistralKey: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={savingKeys || (!keysForm.openaiKey && !keysForm.geminiKey && !keysForm.mistralKey)}
              className="text-xs font-semibold text-white px-4 py-2 rounded-xl hover:opacity-95 transition-opacity disabled:opacity-40 shadow-sm"
              style={{ background: "#FF5B04" }}
            >
              {savingKeys ? "Encrypting..." : "Update Custom Keys"}
            </button>
          </div>
        </form>
      </div>

      {/* STORAGE SECURITY BANNER */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-xs leading-relaxed text-green-800">
        <svg
          className="flex-shrink-0 mt-0.5 text-green-600"
          fill="none"
          height="14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          width="14"
        >
          <rect height="11" rx="2" width="18" x="3" y="11" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>
          <strong>Double-Layer Security Guarantee:</strong> All integration secrets and tokens are AES-256-GCM encrypted in the database. Raw tokens are never transmitted to the browser or stored in cleartext. Public API Keys are hashed via SHA-256 and only verified through timing-safe comparisons.
        </span>
      </div>
    </div>
  );
}
