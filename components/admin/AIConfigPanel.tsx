"use client";

import { useState, useEffect } from "react";

export const AI_CONFIG_LS_KEY = "uipirate-ai-config";

export interface AIConfig {
  /** API keys are no longer stored here — they live encrypted in MongoDB */
  defaultEngine?: "openai" | "gemini" | "puter" | "mistral";
  defaultModel?: string;
}

export function loadAIConfig(): AIConfig {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(AI_CONFIG_LS_KEY) || "{}"); }
  catch { return {}; }
}

interface Props { open: boolean; onClose: () => void; }

export const AIConfigPanel = ({ open, onClose }: Props) => {
  const [openaiKey, setOpenaiKey]     = useState("");
  const [geminiKey, setGeminiKey]     = useState("");
  const [defaultEngine, setDefaultEngine] = useState<"openai" | "gemini" | "puter">("puter");
  const [defaultModel, setDefaultModel]   = useState("gpt-4o-mini");
  const [serverStatus, setServerStatus]   = useState<{ openai: boolean; gemini: boolean } | null>(null);
  const [puterUser, setPuterUser]         = useState<{ username: string } | null>(null);
  const [puterBusy, setPuterBusy]         = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [showOAKey, setShowOAKey]         = useState(false);
  const [showGKey, setShowGKey]           = useState(false);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const save = () => {
    localStorage.setItem(AI_CONFIG_LS_KEY, JSON.stringify({ openaiKey, geminiKey, defaultEngine, defaultModel }));
    setSaved(true); setTimeout(() => setSaved(false), 2000);
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

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90] bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 bottom-0 left-60 w-80 z-[95] bg-white flex flex-col overflow-hidden"
        style={{ boxShadow: "4px 0 24px rgba(0,0,0,0.12)", borderRight: "1px solid rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <div>
            <p className="text-[9px] font-jetbrains-mono uppercase tracking-widest mb-0.5" style={{ color: "#FF5B04" }}>Admin</p>
            <h2 className="text-sm font-bold font-geist text-gray-900">AI Configuration</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-gray-700 hover:bg-black/5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* ── Puter ── */}
          <PanelSection label="Puter AI (Free)">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#FF5B04] font-bold text-sm">⚡</span>
              <span className="text-sm font-semibold font-geist text-gray-800">Puter</span>
              <span className={`ml-auto w-2 h-2 rounded-full ${puterUser ? "bg-green-400" : "bg-gray-300"}`} />
            </div>
            <p className="text-[11px] text-gray-500 font-geist mb-3 leading-relaxed">Free AI — no API key needed. Sign in with your Puter account.</p>
            {puterUser ? (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium font-geist text-gray-700 truncate max-w-[160px]">{puterUser.username}</span>
                <button onClick={puterSignOut} disabled={puterBusy}
                  className="text-[11px] font-jetbrains-mono text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors">
                  {puterBusy ? "…" : "Sign out"}
                </button>
              </div>
            ) : (
              <button onClick={puterSignIn} disabled={puterBusy}
                className="w-full py-2 rounded-lg text-xs font-semibold font-geist text-white transition-opacity disabled:opacity-50"
                style={{ background: "#FF5B04" }}>
                {puterBusy ? "Connecting…" : "Sign in to Puter"}
              </button>
            )}
          </PanelSection>

          {/* ── OpenAI ── */}
          <PanelSection label="OpenAI">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-emerald-500 font-bold text-sm">●</span>
              <span className="text-sm font-semibold font-geist text-gray-800">OpenAI GPT</span>
              {serverStatus?.openai && <EnvBadge color="emerald" />}
            </div>
            <KeyInput value={openaiKey} onChange={setOpenaiKey} show={showOAKey} onToggle={() => setShowOAKey(v => !v)}
              placeholder={serverStatus?.openai ? "Env key active — paste to override" : "sk-..."} focusColor="#10B981" />
          </PanelSection>

          {/* ── Gemini ── */}
          <PanelSection label="Google Gemini">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-500 font-bold text-sm">✦</span>
              <span className="text-sm font-semibold font-geist text-gray-800">Gemini</span>
              {serverStatus?.gemini && <EnvBadge color="blue" />}
            </div>
            <KeyInput value={geminiKey} onChange={setGeminiKey} show={showGKey} onToggle={() => setShowGKey(v => !v)}
              placeholder={serverStatus?.gemini ? "Env key active — paste to override" : "AIza..."} focusColor="#3B82F6" />
          </PanelSection>

          {/* ── Default Engine ── */}
          <PanelSection label="Default Engine">
            <div className="flex bg-black/[0.04] p-1 rounded-xl gap-1">
              {(["openai", "gemini", "puter"] as const).map(eng => (
                <button key={eng} onClick={() => {
                  setDefaultEngine(eng);
                  setDefaultModel(eng === "gemini" ? "gemini-flash-latest" : "gpt-4o-mini");
                }}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold font-geist transition-all ${defaultEngine === eng ? "bg-white text-gray-900 shadow-sm border border-black/5" : "text-gray-500 hover:text-gray-900"}`}>
                  {eng === "openai" ? "● GPT" : eng === "gemini" ? "✦ Gemini" : "⚡ Puter"}
                </button>
              ))}
            </div>
          </PanelSection>

          {/* ── Default Model ── */}
          <PanelSection label="Default Model">
            <select value={defaultModel} onChange={e => setDefaultModel(e.target.value)}
              className="w-full text-xs font-geist bg-white border text-gray-700 px-3 py-2.5 rounded-xl outline-none cursor-pointer"
              style={{ borderColor: "rgba(0,0,0,0.1)" }}>
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
          </PanelSection>

          <p className="text-[10px] text-gray-400 font-geist leading-relaxed">
            Keys are stored in your browser only. They are sent to your own server when making AI requests, never to third parties directly.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <button onClick={save}
            className="w-full py-2.5 rounded-xl text-sm font-semibold font-geist text-white transition-all duration-200"
            style={{ background: saved ? "#16a34a" : "#FF5B04" }}>
            {saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Small reusable sub-components ── */
const PanelSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[9px] font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-2">{label}</p>
    <div className="rounded-xl p-4 space-y-2" style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#FAFAFA" }}>
      {children}
    </div>
  </div>
);

const EnvBadge = ({ color }: { color: "emerald" | "blue" }) => (
  <span className={`ml-auto text-[10px] font-jetbrains-mono px-2 py-0.5 rounded-full
    ${color === "emerald" ? "text-emerald-700 bg-emerald-50" : "text-blue-700 bg-blue-50"}`}>
    .env ✓
  </span>
);

interface KeyInputProps {
  value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void;
  placeholder: string; focusColor: string;
}
const KeyInput = ({ value, onChange, show, onToggle, placeholder }: KeyInputProps) => (
  <div className="relative">
    <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full text-xs font-geist bg-white rounded-lg px-3 py-2.5 pr-12 outline-none transition-colors placeholder:text-gray-400"
      style={{ border: "1px solid rgba(0,0,0,0.1)" }} />
    <button onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-jetbrains-mono text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wide">
      {show ? "Hide" : "Show"}
    </button>
  </div>
);
