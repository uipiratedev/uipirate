"use client";

import { useState, useEffect } from "react";
import { loadAIConfig, AI_CONFIG_LS_KEY } from "@/components/admin/AIConfigPanel";

export default function AISettingsPage() {
  const [openaiKey, setOpenaiKey]         = useState("");
  const [geminiKey, setGeminiKey]         = useState("");
  const [defaultEngine, setDefaultEngine] = useState<"openai" | "gemini" | "puter">("puter");
  const [defaultModel, setDefaultModel]   = useState("gpt-4o-mini");
  const [serverStatus, setServerStatus]   = useState<{ openai: boolean; gemini: boolean } | null>(null);
  const [puterUser, setPuterUser]         = useState<{ username: string } | null>(null);
  const [puterBusy, setPuterBusy]         = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [showOAKey, setShowOAKey]         = useState(false);
  const [showGKey, setShowGKey]           = useState(false);

  useEffect(() => {
    const cfg = loadAIConfig();
    setOpenaiKey(cfg.openaiKey || "");
    setGeminiKey(cfg.geminiKey || "");
    setDefaultEngine(cfg.defaultEngine || "puter");
    setDefaultModel(cfg.defaultModel || "gpt-4o-mini");

    fetch("/api/admin/ai-config").then(r => r.json())
      .then(d => { if (d.success) setServerStatus({ openai: d.openai, gemini: d.gemini }); })
      .catch(() => {});

    import("@heyputer/puter.js").then(({ puter }) => {
      if (puter.auth.isSignedIn()) puter.auth.getUser().then(setPuterUser).catch(() => {});
    }).catch(() => {});
  }, []);

  const save = () => {
    localStorage.setItem(AI_CONFIG_LS_KEY, JSON.stringify({ openaiKey, geminiKey, defaultEngine, defaultModel }));
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  };

  const puterSignIn = async () => {
    setPuterBusy(true);
    try { const { puter } = await import("@heyputer/puter.js"); await puter.auth.signIn(); const u = await puter.auth.getUser(); setPuterUser(u); } catch {}
    setPuterBusy(false);
  };
  const puterSignOut = async () => {
    setPuterBusy(true);
    try { const { puter } = await import("@heyputer/puter.js"); await puter.auth.signOut(); setPuterUser(null); } catch {}
    setPuterBusy(false);
  };

  return (
    <div className="space-y-8">

      {/* ── Page header ── */}
      <div className="pt-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1" style={{ color: "#FF5B04" }}>Admin</p>
          <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">AI Settings</h1>
          <p className="text-sm text-gray-500 mt-1 font-geist">Configure AI providers, API keys, and writing defaults</p>
        </div>
        <button onClick={save}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold font-geist text-white transition-all duration-200 mt-2"
          style={{ background: saved ? "#16a34a" : "#FF5B04" }}>
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>

      {/* ── Providers row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Puter */}
        <SettingCard
          icon={<span className="text-[#FF5B04] text-lg font-bold">⚡</span>}
          title="Puter AI" badge="Free" badgeColor="orange"
          description="Use GPT models for free via Puter.com — no API key required.">
          {puterUser ? (
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-geist text-gray-700 truncate">{puterUser.username}</span>
              </div>
              <button onClick={puterSignOut} disabled={puterBusy}
                className="text-xs font-geist text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors">
                {puterBusy ? "…" : "Sign out"}
              </button>
            </div>
          ) : (
            <button onClick={puterSignIn} disabled={puterBusy}
              className="mt-3 w-full py-2 rounded-lg text-sm font-semibold font-geist text-white transition-opacity disabled:opacity-50"
              style={{ background: "#FF5B04" }}>
              {puterBusy ? "Connecting…" : "Sign in to Puter"}
            </button>
          )}
        </SettingCard>

        {/* OpenAI */}
        <SettingCard
          icon={<span className="text-emerald-500 text-lg font-bold">●</span>}
          title="OpenAI" badge={serverStatus?.openai ? ".env ✓" : undefined} badgeColor="emerald"
          description="GPT-4o, GPT-5 and newer models. Paste your secret key below.">
          <KeyInput value={openaiKey} onChange={setOpenaiKey} show={showOAKey} onToggle={() => setShowOAKey(v => !v)}
            placeholder={serverStatus?.openai ? "Env key active — paste to override" : "sk-..."} />
        </SettingCard>

        {/* Gemini */}
        <SettingCard
          icon={<span className="text-blue-500 text-lg font-bold">✦</span>}
          title="Google Gemini" badge={serverStatus?.gemini ? ".env ✓" : undefined} badgeColor="blue"
          description="Gemini 1.5 Flash, Pro and 2.0 models. Paste your API key below.">
          <KeyInput value={geminiKey} onChange={setGeminiKey} show={showGKey} onToggle={() => setShowGKey(v => !v)}
            placeholder={serverStatus?.gemini ? "Env key active — paste to override" : "AIza..."} />
        </SettingCard>
      </div>

      {/* ── Defaults row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Default Engine */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
          <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-1">Default Engine</p>
          <p className="text-sm font-geist text-gray-500 mb-4">Which AI provider opens by default in the writing assistant</p>
          <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
            {(["openai", "gemini", "puter"] as const).map(eng => (
              <button key={eng} onClick={() => {
                setDefaultEngine(eng);
                setDefaultModel(eng === "gemini" ? "gemini-flash-latest" : "gpt-4o-mini");
              }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold font-geist transition-all ${defaultEngine === eng ? "bg-white text-gray-900 shadow-sm border border-black/5" : "text-gray-500 hover:text-gray-900"}`}>
                {eng === "openai" ? "● OpenAI" : eng === "gemini" ? "✦ Gemini" : "⚡ Puter"}
              </button>
            ))}
          </div>
        </div>

        {/* Default Model */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
          <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-1">Default Model</p>
          <p className="text-sm font-geist text-gray-500 mb-4">The model pre-selected when a writing assistant opens</p>
          <select value={defaultModel} onChange={e => setDefaultModel(e.target.value)}
            className="w-full text-sm font-geist bg-gray-50 border border-black/[0.08] text-gray-700 px-3 py-2.5 rounded-xl outline-none cursor-pointer">
            {defaultEngine === "gemini" ? (
              <>
                <option value="gemini-flash-latest">⚡ Gemini 1.5 Flash</option>
                <option value="gemini-1.5-pro-latest">🧬 Gemini 1.5 Pro</option>
                <option value="gemini-2.0-flash-exp">🚀 Gemini 2.0 Flash</option>
              </>
            ) : (
              <>
                <option value="gpt-4o-mini">🟢 GPT-4o Mini (fast)</option>
                <option value="gpt-4o">🔥 GPT-4o</option>
                <option value="gpt-5.5">🔥 GPT-5.5</option>
                <option value="gpt-5.4">⚡ GPT-5.4</option>
                <option value="gpt-5.4-mini">🟢 GPT-5.4 Mini</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* ── Storage note ── */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
        <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p className="text-xs font-geist text-amber-700 leading-relaxed">
          API keys are stored in <strong>your browser only</strong> (localStorage). They are sent to your own server when making AI requests and never exposed to third parties. Clearing browser data will remove saved keys.
        </p>
      </div>

    </div>
  );
}

/* ── Sub-components ── */
interface CardProps {
  icon: React.ReactNode; title: string;
  badge?: string; badgeColor?: "orange" | "emerald" | "blue";
  description: string; children?: React.ReactNode;
}
const SettingCard = ({ icon, title, badge, badgeColor = "orange", description, children }: CardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5 flex flex-col">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm font-bold font-geist text-gray-900">{title}</span>
      {badge && (
        <span className={`ml-auto text-[10px] font-jetbrains-mono px-2 py-0.5 rounded-full
          ${badgeColor === "emerald" ? "text-emerald-700 bg-emerald-50"
          : badgeColor === "blue" ? "text-blue-700 bg-blue-50"
          : "text-orange-700 bg-orange-50"}`}>{badge}</span>
      )}
    </div>
    <p className="text-xs font-geist text-gray-500 leading-relaxed">{description}</p>
    {children}
  </div>
);

interface KeyInputProps { value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder: string; }
const KeyInput = ({ value, onChange, show, onToggle, placeholder }: KeyInputProps) => (
  <div className="relative mt-3">
    <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2.5 pr-14 outline-none placeholder:text-gray-400"
      style={{ border: "1px solid rgba(0,0,0,0.1)" }} />
    <button onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-jetbrains-mono text-gray-400 hover:text-gray-700 transition-colors uppercase tracking-wide">
      {show ? "Hide" : "Show"}
    </button>
  </div>
);
