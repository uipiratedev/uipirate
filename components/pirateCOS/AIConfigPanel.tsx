"use client";

import { useState, useEffect } from "react";
import CosIcon from "./CosIcon";
import { useAIModels } from "@/hooks/useAIModels";

export const AI_CONFIG_LS_KEY = "uipirate-ai-config";

import {
  AIEngine,
  AI_PROVIDERS,
  getDefaultModelForEngine,
  getProvider,
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
  const [grokKey, setGrokKey] = useState("");
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [defaultEngine, setDefaultEngine] = useState<AIEngine>("puter");
  const [defaultModel, setDefaultModel] = useState("gpt-4o-mini");

  const [openaiEnabled, setOpenaiEnabled] = useState(true);
  const [geminiEnabled, setGeminiEnabled] = useState(true);
  const [mistralEnabled, setMistralEnabled] = useState(true);
  const [anthropicEnabled, setAnthropicEnabled] = useState(true);
  const [grokEnabled, setGrokEnabled] = useState(true);
  const [openrouterEnabled, setOpenrouterEnabled] = useState(true);
  const [puterEnabled, setPuterEnabled] = useState(true);

  const [serverStatus, setServerStatus] = useState<{
    openai: boolean;
    gemini: boolean;
    mistral: boolean;
    anthropic: boolean;
    grok: boolean;
    openrouter: boolean;
  } | null>(null);
  const [puterUser, setPuterUser] = useState<{ username: string } | null>(null);
  const [puterBusy, setPuterBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    provider: AIEngine | null;
    nextState: boolean;
  }>({ open: false, provider: null, nextState: false });

  const onToggleClick = (provider: AIEngine, currentState: boolean) => {
    setConfirmModal({
      open: true,
      provider,
      nextState: !currentState,
    });
  };

  const executeToggleLocal = (provider: AIEngine, nextVal: boolean) => {
    if (provider === "openai") setOpenaiEnabled(nextVal);
    if (provider === "gemini") setGeminiEnabled(nextVal);
    if (provider === "mistral") setMistralEnabled(nextVal);
    if (provider === "anthropic") setAnthropicEnabled(nextVal);
    if (provider === "grok") setGrokEnabled(nextVal);
    if (provider === "openrouter") setOpenrouterEnabled(nextVal);
    if (provider === "puter") setPuterEnabled(nextVal);
    
    setConfirmModal({ open: false, provider: null, nextState: false });
  };

  const [showOAKey, setShowOAKey] = useState(false);
  const [showGKey, setShowGKey] = useState(false);
  const [showMKey, setShowMKey] = useState(false);
  const [showAKey, setShowAKey] = useState(false);
  const [showGrokKey, setShowGrokKey] = useState(false);
  const [showORKey, setShowORKey] = useState(false);
  const {
    models: availableModels,
    source: modelSource,
    isLoading: modelsLoading,
  } = useAIModels(defaultEngine);

  // If the current defaultEngine becomes disabled, shift defaultEngine to the first enabled one
  useEffect(() => {
    const isCurrentEnabled =
      defaultEngine === "openai" ? openaiEnabled :
      defaultEngine === "gemini" ? geminiEnabled :
      defaultEngine === "mistral" ? mistralEnabled :
      defaultEngine === "anthropic" ? anthropicEnabled :
      defaultEngine === "grok" ? grokEnabled :
      defaultEngine === "openrouter" ? openrouterEnabled : puterEnabled;

    if (!isCurrentEnabled) {
      if (puterEnabled) {
        setDefaultEngine("puter");
        setDefaultModel(getDefaultModelForEngine("puter"));
      } else if (openaiEnabled) {
        setDefaultEngine("openai");
        setDefaultModel(getDefaultModelForEngine("openai"));
      } else if (geminiEnabled) {
        setDefaultEngine("gemini");
        setDefaultModel(getDefaultModelForEngine("gemini"));
      } else if (anthropicEnabled) {
        setDefaultEngine("anthropic");
        setDefaultModel(getDefaultModelForEngine("anthropic"));
      } else if (mistralEnabled) {
        setDefaultEngine("mistral");
        setDefaultModel(getDefaultModelForEngine("mistral"));
      } else if (grokEnabled) {
        setDefaultEngine("grok");
        setDefaultModel(getDefaultModelForEngine("grok"));
      } else if (openrouterEnabled) {
        setDefaultEngine("openrouter");
        setDefaultModel(getDefaultModelForEngine("openrouter"));
      }
    }
  }, [
    defaultEngine,
    openaiEnabled,
    geminiEnabled,
    mistralEnabled,
    anthropicEnabled,
    grokEnabled,
    openrouterEnabled,
    puterEnabled,
  ]);

  useEffect(() => {
    if (!open) return;
    const cfg = loadAIConfig();

    setOpenaiKey("");
    setGeminiKey("");
    setMistralKey("");
    setAnthropicKey("");
    setGrokKey("");
    setOpenrouterKey("");
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
            grok: d.grok,
            openrouter: d.openrouter,
          });
          if (d.defaultEngine) setDefaultEngine(d.defaultEngine as any);
          if (d.defaultModel) setDefaultModel(d.defaultModel);
          setOpenaiEnabled(d.openaiEnabled ?? true);
          setGeminiEnabled(d.geminiEnabled ?? true);
          setMistralEnabled(d.mistralEnabled ?? true);
          setAnthropicEnabled(d.anthropicEnabled ?? true);
          setGrokEnabled(d.grokEnabled ?? true);
          setOpenrouterEnabled(d.openrouterEnabled ?? true);
          setPuterEnabled(d.puterEnabled ?? true);
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
      const body: Record<string, any> = {
        defaultEngine,
        defaultModel,
        openaiEnabled,
        geminiEnabled,
        mistralEnabled,
        anthropicEnabled,
        grokEnabled,
        openrouterEnabled,
        puterEnabled,
      };

      if (openaiKey.trim()) body.openaiKey = openaiKey.trim();
      if (geminiKey.trim()) body.geminiKey = geminiKey.trim();
      if (mistralKey.trim()) body.mistralKey = mistralKey.trim();
      if (anthropicKey.trim()) body.anthropicKey = anthropicKey.trim();
      if (grokKey.trim()) body.grokKey = grokKey.trim();
      if (openrouterKey.trim()) body.openrouterKey = openrouterKey.trim();

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
      if (grokKey.trim()) setGrokKey("");
      if (openrouterKey.trim()) setOpenrouterKey("");

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
          grok: refreshed.grok,
          openrouter: refreshed.openrouter,
        });
        setOpenaiEnabled(refreshed.openaiEnabled ?? true);
        setGeminiEnabled(refreshed.geminiEnabled ?? true);
        setMistralEnabled(refreshed.mistralEnabled ?? true);
        setAnthropicEnabled(refreshed.anthropicEnabled ?? true);
        setGrokEnabled(refreshed.grokEnabled ?? true);
        setOpenrouterEnabled(refreshed.openrouterEnabled ?? true);
        setPuterEnabled(refreshed.puterEnabled ?? true);
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
            {/* Toggle Switch */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[10px] font-semibold text-gray-500">Enabled</span>
              <button
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  puterEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                type="button"
                onClick={() => onToggleClick("puter", puterEnabled)}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                    puterEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
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
            {/* Toggle Switch */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[10px] font-semibold text-gray-500">Enabled</span>
              <button
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  openaiEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                type="button"
                onClick={() => onToggleClick("openai", openaiEnabled)}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                    openaiEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
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
            {/* Toggle Switch */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[10px] font-semibold text-gray-500">Enabled</span>
              <button
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  geminiEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                type="button"
                onClick={() => onToggleClick("gemini", geminiEnabled)}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                    geminiEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
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
            {/* Toggle Switch */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[10px] font-semibold text-gray-500">Enabled</span>
              <button
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  mistralEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                type="button"
                onClick={() => onToggleClick("mistral", mistralEnabled)}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                    mistralEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
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
            {/* Toggle Switch */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[10px] font-semibold text-gray-500">Enabled</span>
              <button
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  anthropicEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                type="button"
                onClick={() => onToggleClick("anthropic", anthropicEnabled)}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                    anthropicEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </PanelSection>

          {/* ── xAI Grok ── */}
          <PanelSection label="xAI Grok">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold font-geist text-gray-800">
                xAI Grok
              </span>
              {serverStatus?.grok && <EnvBadge color="violet" />}
            </div>
            <KeyInput
              focusColor="#000000"
              placeholder={
                serverStatus?.grok
                  ? "Saved in Database (encrypted)"
                  : "xai-..."
              }
              show={showGrokKey}
              value={grokKey}
              onChange={setGrokKey}
              onToggle={() => setShowGrokKey((v) => !v)}
            />
            {/* Toggle Switch */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[10px] font-semibold text-gray-500">Enabled</span>
              <button
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  grokEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                type="button"
                onClick={() => onToggleClick("grok", grokEnabled)}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                    grokEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </PanelSection>

          {/* ── OpenRouter ── */}
          <PanelSection label="OpenRouter">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold font-geist text-gray-800">
                OpenRouter
              </span>
              {serverStatus?.openrouter && <EnvBadge color="violet" />}
            </div>
            <KeyInput
              focusColor="#7C3AED"
              placeholder={
                serverStatus?.openrouter
                  ? "Saved in Database (encrypted)"
                  : "sk-or-..."
              }
              show={showORKey}
              value={openrouterKey}
              onChange={setOpenrouterKey}
              onToggle={() => setShowORKey((v) => !v)}
            />
            {/* Toggle Switch */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04]">
              <span className="text-[10px] font-semibold text-gray-500">Enabled</span>
              <button
                className={`w-8 h-4.5 rounded-full p-0.5 transition-colors relative flex items-center ${
                  openrouterEnabled ? "bg-green-500" : "bg-gray-200"
                }`}
                type="button"
                onClick={() => onToggleClick("openrouter", openrouterEnabled)}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                    openrouterEnabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </PanelSection>

          <PanelSection label="Default Engine">
            <div className="flex flex-wrap bg-black/[0.04] p-1 rounded-xl gap-1">
              {AI_PROVIDERS.filter((provider) => {
                if (provider.id === "openai") return openaiEnabled;
                if (provider.id === "gemini") return geminiEnabled;
                if (provider.id === "mistral") return mistralEnabled;
                if (provider.id === "anthropic") return anthropicEnabled;
                if (provider.id === "grok") return grokEnabled;
                if (provider.id === "openrouter") return openrouterEnabled;
                if (provider.id === "puter") return puterEnabled;
                return true;
              }).map((provider) => (
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
      <ConfirmModal
        open={confirmModal.open}
        provider={confirmModal.provider}
        nextState={confirmModal.nextState}
        onClose={() => setConfirmModal({ open: false, provider: null, nextState: false })}
        onConfirm={() => executeToggleLocal(confirmModal.provider!, confirmModal.nextState)}
      />
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

interface ConfirmModalProps {
  open: boolean;
  provider: AIEngine | null;
  nextState: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
function ConfirmModal({ open, provider, nextState, onClose, onConfirm }: ConfirmModalProps) {
  if (!open || !provider) return null;
  const info = getProvider(provider);
  if (!info) return null;

  const sourceColors = info.sourceColors || {
    bg: "bg-orange-50",
    border: "border-orange-100",
    dot: "bg-orange-400",
    text: "text-orange-700",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-black/5 w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p
              className="text-xs font-jetbrains-mono uppercase tracking-widest mb-0.5"
              style={{ color: "#FF5B04" }}
            >
              AI Provider
            </p>
            <h2 className="text-lg font-bold font-geist text-gray-900">
              {nextState ? `Enable ${info.name}?` : `Disable ${info.name}?`}
            </h2>
          </div>
          <button
            className="text-gray-400 hover:text-gray-700 transition-colors mt-1 flex items-center justify-center"
            onClick={onClose}
          >
            <svg
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              width="16"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Provider identity strip */}
        <div
          className={`flex items-start gap-3 px-4 py-3 rounded-xl mb-5 ${sourceColors.bg} border ${sourceColors.border} items-center`}
        >
          {info.logo ? (
            <img
              src={info.logo}
              alt={info.name}
              className="w-5 h-5 object-contain flex-shrink-0"
            />
          ) : (
            <span
              className="text-xl leading-none flex-shrink-0"
              style={{ color: info.color }}
            >
              ◆
            </span>
          )}
          <div className="min-w-0">
            <p
              className={`text-xs font-bold font-geist mb-0.5 ${sourceColors.text}`}
            >
              {info.name}
            </p>
            <p className="text-xs font-geist text-gray-500 leading-relaxed">
              {nextState ? "Provider will be enabled globally" : "Provider will be disabled globally"}
            </p>
          </div>
        </div>

        {/* Description/Info */}
        <p className="text-xs font-geist text-gray-500 mb-5 leading-relaxed">
          {nextState
            ? `Enabling ${info.name} will make it available in your default engine and selectors after saving. Make sure a valid API key is configured.`
            : `Disabling ${info.name} will hide it from active selections. If it is currently set as your default engine, it will fall back to another active provider after saving.`}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-geist text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-geist text-white transition-all"
            style={{ background: nextState ? "#16a34a" : "#FF5B04" }}
            onClick={onConfirm}
          >
            {nextState ? "Enable Provider" : "Disable Provider"}
          </button>
        </div>
      </div>
    </div>
  );
}
