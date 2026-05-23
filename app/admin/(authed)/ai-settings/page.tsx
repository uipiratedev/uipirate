"use client";

import { useState, useEffect } from "react";
import { AI_CONFIG_LS_KEY } from "@/components/admin/AIConfigPanel";

export default function AISettingsPage() {
  const [openaiKey, setOpenaiKey]         = useState("");
  const [geminiKey, setGeminiKey]         = useState("");
  const [mistralKey, setMistralKey]       = useState("");
  const [defaultEngine, setDefaultEngine] = useState<"openai" | "gemini" | "puter" | "mistral">("puter");
  const [defaultModel, setDefaultModel]   = useState("gpt-4o-mini");
  /** Source of each key: null = not set, "env" = env var, "db" = encrypted in DB */
  const [openaiSource, setOpenaiSource]   = useState<"env" | "db" | null>(null);
  const [geminiSource, setGeminiSource]   = useState<"env" | "db" | null>(null);
  const [mistralSource, setMistralSource] = useState<"env" | "db" | null>(null);
  const [puterUser, setPuterUser]         = useState<{ username: string } | null>(null);
  const [puterBusy, setPuterBusy]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [saveError, setSaveError]         = useState<string | null>(null);
  const [showOAKey, setShowOAKey]         = useState(false);
  const [showGKey, setShowGKey]           = useState(false);
  const [showMKey, setShowMKey]           = useState(false);

  useEffect(() => {
    fetch("/api/admin/ai-config").then(r => r.json()).then(d => {
      if (d.success) {
        setOpenaiSource(d.openaiSource);
        setGeminiSource(d.geminiSource);
        setMistralSource(d.mistralSource);
        setDefaultEngine(d.defaultEngine ?? "puter");
        setDefaultModel(d.defaultModel  ?? "gpt-4o-mini");
      }
    }).catch(() => {});

    import("@heyputer/puter.js").then(({ puter }) => {
      if (puter.auth.isSignedIn()) puter.auth.getUser().then(setPuterUser).catch(() => {});
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true); setSaveError(null);
    try {
      const res = await fetch("/api/admin/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openaiKey, geminiKey, mistralKey, defaultEngine, defaultModel }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save failed");

      // Also persist non-sensitive defaults locally for fast reads in the editor
      localStorage.setItem(AI_CONFIG_LS_KEY, JSON.stringify({ defaultEngine, defaultModel }));

      // Refresh key sources
      const refreshed = await fetch("/api/admin/ai-config").then(r => r.json());
      if (refreshed.success) {
        setOpenaiSource(refreshed.openaiSource);
        setGeminiSource(refreshed.geminiSource);
        setMistralSource(refreshed.mistralSource);
      }
      setOpenaiKey(""); setGeminiKey(""); setMistralKey(""); // clear fields after save
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setSaveError(e.message ?? "Unknown error");
    }
    setSaving(false);
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
        <div className="flex flex-col items-end gap-1">
          <button onClick={save} disabled={saving}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold font-geist text-white transition-all duration-200 mt-2 disabled:opacity-60"
            style={{ background: saved ? "#16a34a" : "#FF5B04" }}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Settings"}
          </button>
          {saveError && <p className="text-xs text-red-500 font-geist">{saveError}</p>}
        </div>
      </div>

      {/* ── Providers row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

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
          title="OpenAI"
          badge={openaiSource === "env" ? ".env ✓" : openaiSource === "db" ? "🔒 DB" : undefined}
          badgeColor="emerald"
          description="GPT-4o, GPT-5 and newer models. Paste your secret key below.">
          {openaiSource && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-xs font-geist text-emerald-700">
                {openaiSource === "env" ? "Key loaded from .env" : "Encrypted key saved in database"}
              </span>
            </div>
          )}
          <KeyInput value={openaiKey} onChange={setOpenaiKey} show={showOAKey} onToggle={() => setShowOAKey(v => !v)}
            placeholder={openaiSource ? "Paste new key to replace…" : "sk-..."} />
        </SettingCard>

        {/* Gemini */}
        <SettingCard
          icon={<span className="text-blue-500 text-lg font-bold">✦</span>}
          title="Google Gemini"
          badge={geminiSource === "env" ? ".env ✓" : geminiSource === "db" ? "🔒 DB" : undefined}
          badgeColor="blue"
          description="Gemini 1.5 Flash, Pro and 2.0 models. Paste your API key below.">
          {geminiSource && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-xs font-geist text-blue-700">
                {geminiSource === "env" ? "Key loaded from .env" : "Encrypted key saved in database"}
              </span>
            </div>
          )}
          <KeyInput value={geminiKey} onChange={setGeminiKey} show={showGKey} onToggle={() => setShowGKey(v => !v)}
            placeholder={geminiSource ? "Paste new key to replace…" : "AIza..."} />
        </SettingCard>

        {/* Mistral */}
        <SettingCard
          icon={<span className="text-violet-600 text-lg font-bold">◆</span>}
          title="Mistral AI"
          badge={mistralSource === "env" ? ".env ✓" : mistralSource === "db" ? "🔒 DB" : undefined}
          badgeColor="violet"
          description="Mistral Large, Small, Nemo and Codestral models. Paste your API key below.">
          {mistralSource && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-violet-50 border border-violet-100">
              <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
              <span className="text-xs font-geist text-violet-700">
                {mistralSource === "env" ? "Key loaded from .env" : "Encrypted key saved in database"}
              </span>
            </div>
          )}
          <KeyInput value={mistralKey} onChange={setMistralKey} show={showMKey} onToggle={() => setShowMKey(v => !v)}
            placeholder={mistralSource ? "Paste new key to replace…" : "e.g. your Mistral API key"} />
        </SettingCard>
      </div>

      {/* ── Defaults row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Default Engine */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5">
          <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-1">Default Engine</p>
          <p className="text-sm font-geist text-gray-500 mb-4">Which AI provider opens by default in the writing assistant</p>
          <div className="flex flex-wrap bg-black/[0.04] p-1 rounded-xl gap-1">
            {(["openai", "gemini", "mistral", "puter"] as const).map(eng => (
              <button key={eng} onClick={() => {
                setDefaultEngine(eng);
                setDefaultModel(eng === "gemini" ? "gemini-flash-latest" : eng === "mistral" ? "mistral-large-latest" : "gpt-4o-mini");
              }}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold font-geist transition-all ${defaultEngine === eng ? "bg-white text-gray-900 shadow-sm border border-black/5" : "text-gray-500 hover:text-gray-900"}`}>
                {eng === "openai" ? "● OpenAI" : eng === "gemini" ? "✦ Gemini" : eng === "mistral" ? "◆ Mistral" : "⚡ Puter"}
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
            ) : defaultEngine === "mistral" ? (
              <>
                <option value="mistral-large-latest">👑 Mistral Large (Most Capable)</option>
                <option value="mistral-small-latest">🟢 Mistral Small (Fast)</option>
                <option value="mistral-nemo">🌱 Mistral Nemo (Lightweight)</option>
                <option value="codestral-latest">💻 Codestral (Code)</option>
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
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
        <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
        </svg>
        <p className="text-xs font-geist text-green-800 leading-relaxed">
          API keys are <strong>AES-256-GCM encrypted</strong> and stored in your MongoDB database. They are decrypted server-side only when making AI requests — they never leave your server or reach the browser. Requires <code className="bg-green-100 px-1 rounded text-[10px]">AI_ENCRYPTION_KEY</code> in your <code className="bg-green-100 px-1 rounded text-[10px]">.env.local</code>.
        </p>
      </div>

    </div>
  );
}

/* ── Sub-components ── */
interface CardProps {
  icon: React.ReactNode; title: string;
  badge?: string; badgeColor?: "orange" | "emerald" | "blue" | "violet";
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
          : badgeColor === "violet" ? "text-violet-700 bg-violet-50"
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
