"use client";

import { useState, useEffect } from "react";
import CosIcon from "./CosIcon";
import { useAIModels } from "@/hooks/useAIModels";

export const AI_CONFIG_LS_KEY = "uipirate-ai-config";

import {
  AIEngine,
  AI_PROVIDERS,
  getDefaultModelForEngine,
} from "@/lib/pirateCOS/ai-registry";

export interface AIConfig {
  /** API keys are no longer stored here — they live encrypted in MongoDB */
  openaiKey?: string;
  geminiKey?: string;
  mistralKey?: string;
  anthropicKey?: string;
  defaultEngine?: AIEngine;
  defaultModel?: string;
}

export function loadAIConfig(): AIConfig {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(AI_CONFIG_LS_KEY) || "{}");
  } catch {
    return {};
  }
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AIConfigPanel = ({ open, onClose }: Props) => {
  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [mistralKey, setMistralKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [defaultEngine, setDefaultEngine] = useState<AIEngine>("puter");
  const [defaultModel, setDefaultModel] = useState("gpt-4o-mini");
  const [serverStatus, setServerStatus] = useState<{
    openai: boolean;
    gemini: boolean;
    mistral: boolean;
    anthropic: boolean;
  } | null>(null);
  const [puterUser, setPuterUser] = useState<{ username: string } | null>(null);
  const [puterBusy, setPuterBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showOAKey, setShowOAKey] = useState(false);
  const [showGKey, setShowGKey] = useState(false);
  const [showMKey, setShowMKey] = useState(false);
  const [showAKey, setShowAKey] = useState(false);
  const {
    models: availableModels,
    source: modelSource,
    isLoading: modelsLoading,
  } = useAIModels(defaultEngine);

  useEffect(() => {
    if (!open) return;
    const cfg = loadAIConfig();

    setOpenaiKey("");
    setGeminiKey("");
    setMistralKey("");
    setAnthropicKey("");
    setDefaultEngine(cfg.defaultEngine || "puter");
    setDefaultModel(cfg.defaultModel || "gpt-4o-mini");

    fetch("/api/pirateCOS/ai-config")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setServerStatus({
            openai: d.openai,
            gemini: d.gemini,
            mistral: d.mistral,
            anthropic: d.anthropic,
          });
          if (d.defaultEngine) setDefaultEngine(d.defaultEngine as any);
          if (d.defaultModel) setDefaultModel(d.defaultModel);
        }
      })
      .catch(() => {});

    import("@heyputer/puter.js")
      .then(({ puter }) => {
        if (puter.auth.isSignedIn())
          puter.auth
            .getUser()
            .then(setPuterUser)
            .catch(() => {});
      })
      .catch(() => {});
  }, [open]);

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const body: Record<string, string> = { defaultEngine, defaultModel };

      if (openaiKey.trim()) body.openaiKey = openaiKey.trim();
      if (geminiKey.trim()) body.geminiKey = geminiKey.trim();
      if (mistralKey.trim()) body.mistralKey = mistralKey.trim();
      if (anthropicKey.trim()) body.anthropicKey = anthropicKey.trim();

      const res = await fetch("/api/pirateCOS/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Save failed");

      // Clear entered keys so placeholder takes over
      if (openaiKey.trim()) setOpenaiKey("");
      if (geminiKey.trim()) setGeminiKey("");
      if (mistralKey.trim()) setMistralKey("");
      if (anthropicKey.trim()) setAnthropicKey("");

      // Update local storage defaults cache for fast loading
      localStorage.setItem(
        AI_CONFIG_LS_KEY,
        JSON.stringify({ defaultEngine, defaultModel }),
      );

      // Refresh server status
      const refreshed = await fetch("/api/pirateCOS/ai-config").then((r) =>
        r.json(),
      );

      if (refreshed.success) {
        setServerStatus({
          openai: refreshed.openai,
          gemini: refreshed.gemini,
          mistral: refreshed.mistral,
          anthropic: refreshed.anthropic,
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const puterSignIn = async () => {
    setPuterBusy(true);
    try {
      const { puter } = await import("@heyputer/puter.js");

      await puter.auth.signIn();
      const u = await puter.auth.getUser();

      setPuterUser(u);
    } catch {}
    setPuterBusy(false);
  };
  const puterSignOut = async () => {
    setPuterBusy(true);
    try {
      const { puter } = await import("@heyputer/puter.js");

      await puter.auth.signOut();
      setPuterUser(null);
    } catch {}
    setPuterBusy(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90] bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed top-0 bottom-0 left-60 w-80 z-[95] bg-white flex flex-col overflow-hidden"
        style={{
          boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <div>
            <p
              className="text-[9px] font-jetbrains-mono uppercase tracking-widest mb-0.5"
              style={{ color: "#FF5B04" }}
            >
              Admin
            </p>
            <h2 className="text-sm font-bold font-geist text-gray-900">
              AI Configuration
            </h2>
          </div>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-gray-400 hover:text-gray-700 hover:bg-black/5"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="12"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {/* ── Puter ── */}
          <PanelSection label="Puter AI (Free)">
            <div className="flex items-center gap-2 mb-2">
              <CosIcon name="bolt" size={14} className="text-[#FF5B04]" />
              <span className="text-sm font-semibold font-geist text-gray-800">
                Puter
              </span>
              <span
                className={`ml-auto w-2 h-2 rounded-full ${puterUser ? "bg-green-400" : "bg-gray-300"}`}
              />
            </div>
            <p className="text-[11px] text-gray-500 font-geist mb-3 leading-relaxed">
              Free AI — no API key needed. Sign in with your Puter account.
            </p>
            {puterUser ? (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium font-geist text-gray-700 truncate max-w-[160px]">
                  {puterUser.username}
                </span>
                <button
                  className="text-[11px] font-jetbrains-mono text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                  disabled={puterBusy}
                  onClick={puterSignOut}
                >
                  {puterBusy ? "…" : "Sign out"}
                </button>
              </div>
            ) : (
              <button
                className="w-full py-2 rounded-lg text-xs font-semibold font-geist text-white transition-opacity disabled:opacity-50"
                disabled={puterBusy}
                style={{ background: "#FF5B04" }}
                onClick={puterSignIn}
              >
                {puterBusy ? "Connecting…" : "Sign in to Puter"}
              </button>
            )}
          </PanelSection>

          {/* ── OpenAI ── */}
          <PanelSection label="OpenAI">
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/logos/ai/openai.svg" alt="OpenAI" className="w-4 h-4 object-contain" />
              <span className="text-sm font-semibold font-geist text-gray-800">
                OpenAI GPT
              </span>
              {serverStatus?.openai && <EnvBadge color="emerald" />}
            </div>
            <KeyInput
              focusColor="#10B981"
              placeholder={
                serverStatus?.openai
                  ? "Env key active — paste to override"
                  : "sk-..."
              }
              show={showOAKey}
              value={openaiKey}
              onChange={setOpenaiKey}
              onToggle={() => setShowOAKey((v) => !v)}
            />
          </PanelSection>

          {/* ── Gemini ── */}
          <PanelSection label="Google Gemini">
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/logos/ai/google-gemini-icon.svg" alt="Gemini" className="w-4 h-4 object-contain" />
              <span className="text-sm font-semibold font-geist text-gray-800">
                Gemini
              </span>
              {serverStatus?.gemini && <EnvBadge color="blue" />}
            </div>
            <KeyInput
              focusColor="#3B82F6"
              placeholder={
                serverStatus?.gemini
                  ? "Saved in Database (encrypted)"
                  : "AIza..."
              }
              show={showGKey}
              value={geminiKey}
              onChange={setGeminiKey}
              onToggle={() => setShowGKey((v) => !v)}
            />
          </PanelSection>

          {/* ── Mistral AI ── */}
          <PanelSection label="Mistral AI">
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/logos/ai/mistral-ai-icon.svg" alt="Mistral" className="w-4 h-4 object-contain" />
              <span className="text-sm font-semibold font-geist text-gray-800">
                Mistral AI
              </span>
              {serverStatus?.mistral && <EnvBadge color="violet" />}
            </div>
            <KeyInput
              focusColor="#7C3AED"
              placeholder={
                serverStatus?.mistral
                  ? "Saved in Database (encrypted)"
                  : "e.g. your Mistral API key"
              }
              show={showMKey}
              value={mistralKey}
              onChange={setMistralKey}
              onToggle={() => setShowMKey((v) => !v)}
            />
          </PanelSection>

          {/* ── Default Engine ── */}
          <PanelSection label="Claude">
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/logos/ai/claude-ai-icon.svg" alt="Claude" className="w-4 h-4 object-contain" />
              <span className="text-sm font-semibold font-geist text-gray-800">
                Anthropic Claude
              </span>
              {serverStatus?.anthropic && <EnvBadge color="fuchsia" />}
            </div>
            <KeyInput
              focusColor="#C026D3"
              placeholder={
                serverStatus?.anthropic
                  ? "Saved in Database (encrypted)"
                  : "sk-ant-..."
              }
              show={showAKey}
              value={anthropicKey}
              onChange={setAnthropicKey}
              onToggle={() => setShowAKey((v) => !v)}
            />
          </PanelSection>

          <PanelSection label="Default Engine">
            <div className="flex flex-wrap bg-black/[0.04] p-1 rounded-xl gap-1">
              {AI_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  className={`flex-grow flex-shrink-0 min-w-[64px] py-1.5 rounded-lg text-[11px] font-semibold font-geist transition-all ${defaultEngine === provider.id ? "bg-white text-gray-900 shadow-sm border border-black/5" : "text-gray-500 hover:text-gray-900"}`}
                  onClick={() => {
                    setDefaultEngine(provider.id);
                    setDefaultModel(getDefaultModelForEngine(provider.id));
                  }}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <img src={provider.logo} alt={provider.name} className="w-3.5 h-3.5 object-contain" /> {provider.shortName}
                  </span>
                </button>
              ))}
            </div>
          </PanelSection>

          {/* ── Default Model ── */}
          <PanelSection label={modelsLoading ? "Default Model (loading)" : "Default Model"}>
            <select
              className="w-full text-xs font-geist bg-white border text-gray-700 px-3 py-2.5 rounded-xl outline-none cursor-pointer"
              style={{ borderColor: "rgba(0,0,0,0.1)" }}
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} {m.description ? `— ${m.description}` : ""}
                </option>
              ))}
            </select>
            {modelSource !== "fallback" && (
              <p className="text-[10px] text-gray-400 font-geist leading-relaxed">
                Showing live provider models with safe defaults.
              </p>
            )}
          </PanelSection>

          <p className="text-[10px] text-gray-400 font-geist leading-relaxed">
            Keys are securely encrypted using AES-256-GCM and stored in your
            database. They are never exposed to the browser or third parties.
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          {saveError && (
            <p className="text-xs text-red-500 font-geist mb-3 text-center">
              {saveError}
            </p>
          )}
          <button
            className="w-full py-2.5 rounded-xl text-sm font-semibold font-geist text-white transition-all duration-200 disabled:opacity-50"
            disabled={saving}
            style={{ background: saved ? "#16a34a" : "#FF5B04" }}
            onClick={save}
          >
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Settings"}
          </button>
        </div>
      </div>
    </>
  );
};

/* ── Small reusable sub-components ── */
const PanelSection = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="text-[9px] font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-2">
      {label}
    </p>
    <div
      className="rounded-xl p-4 space-y-2"
      style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#FAFAFA" }}
    >
      {children}
    </div>
  </div>
);

const EnvBadge = ({
  color,
}: {
  color: "emerald" | "blue" | "violet" | "fuchsia";
}) => (
  <span
    className={`ml-auto text-[10px] font-jetbrains-mono px-2 py-0.5 rounded-full
    ${
      color === "emerald"
        ? "text-emerald-700 bg-emerald-50"
        : color === "blue"
          ? "text-blue-700 bg-blue-50"
          : color === "fuchsia"
            ? "text-fuchsia-700 bg-fuchsia-50"
            : "text-violet-700 bg-violet-50"
    }`}
  >
    .env ✓
  </span>
);

interface KeyInputProps {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  focusColor: string;
}
const KeyInput = ({
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}: KeyInputProps) => (
  <div className="relative">
    <input
      className="w-full text-xs font-geist bg-white rounded-lg px-3 py-2.5 pr-12 outline-none transition-colors placeholder:text-gray-400"
      placeholder={placeholder}
      style={{ border: "1px solid rgba(0,0,0,0.1)" }}
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <button
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-jetbrains-mono text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wide"
      onClick={onToggle}
    >
      {show ? "Hide" : "Show"}
    </button>
  </div>
);
