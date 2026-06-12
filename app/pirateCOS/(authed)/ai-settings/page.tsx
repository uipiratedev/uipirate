"use client";

import { useState, useEffect } from "react";

import { AI_CONFIG_LS_KEY } from "@/components/pirateCOS/AIConfigPanel";
import { useAIModels } from "@/hooks/useAIModels";

import {
  AIEngine,
  AIKeyProvider,
  AI_PROVIDERS,
  getProvider,
  getDefaultModelForEngine,
  getProviderLabel,
  getProviderLogo,
} from "@/lib/pirateCOS/ai-registry";

/* ── Types & constants ── */
type Engine = AIEngine;
type KeySource = "env" | "db" | null;
type KeyProvider = AIKeyProvider;

interface KeyModalProps {
  open: boolean;
  provider: KeyProvider;
  onClose: () => void;
  onSave: (provider: KeyProvider, key: string) => Promise<void>;
}
function KeyModal({ open, provider, onClose, onSave }: KeyModalProps) {
  const [keyValue, setKeyValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setKeyValue("");
      setShowKey(false);
      setSaved(false);
      setError(null);
    }
  }, [open, provider]);

  if (!open) return null;
  const info = getProvider(provider);
  if (!info) return null;
  const handleSave = async () => {
    if (!keyValue.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(provider, keyValue.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 800);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    }
    setSaving(false);
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
              API Key
            </p>
            <h2 className="text-lg font-bold font-geist text-gray-900">
              Update {info.name} Key
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
          className={`flex items-start gap-3 px-4 py-3 rounded-xl mb-5 ${info.sourceColors?.bg || ""} border ${info.sourceColors?.border || ""} items-center`}
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
              className={`text-xs font-bold font-geist mb-0.5 ${info.sourceColors?.text || ""}`}
            >
              {info.name}
            </p>
            <p className="text-xs font-geist text-gray-500 leading-relaxed">
              {info.keyDescription}
            </p>
            {info.keyLink && (
              <a
                className={`inline-flex items-center gap-1 text-[11px] font-geist mt-1.5 underline underline-offset-2 ${info.sourceColors?.text || ""} hover:opacity-70 transition-opacity`}
                href={info.keyLink}
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  fill="none"
                  height="10"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="10"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
                {info.keyLinkLabel || info.keyLink}
              </a>
            )}
          </div>
        </div>

        {/* Key input */}
        <p className="text-xs font-geist text-gray-500 mb-2">
          {info.name} API Key
        </p>
        <div className="relative mb-2">
          <input
            autoFocus
            className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2.5 pr-14 outline-none placeholder:text-gray-400"
            placeholder={info.keyPlaceholder}
            style={{ border: "1px solid rgba(0,0,0,0.1)" }}
            type={showKey ? "text" : "password"}
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-jetbrains-mono text-gray-400 hover:text-gray-700 transition-colors uppercase tracking-wide"
            onClick={() => setShowKey((v) => !v)}
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-[11px] font-geist text-gray-400 mb-5 flex items-center gap-1.5">
          <svg
            className="flex-shrink-0"
            fill="none"
            height="11"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            width="11"
          >
            <rect height="11" rx="2" width="18" x="3" y="11" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Encrypted with AES-256-GCM — stored in your database, never exposed to
          the browser.
        </p>

        {/* Actions */}
        {error && (
          <p className="text-xs text-red-500 font-geist mb-3">{error}</p>
        )}
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-geist text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-40"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-geist text-white transition-all disabled:opacity-40"
            disabled={!keyValue.trim() || saving}
            style={{ background: saved ? "#16a34a" : "#FF5B04" }}
            onClick={handleSave}
          >
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Key"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function AISettingsPage() {
  // Config
  const [defaultEngine, setDefaultEngine] = useState<Engine>("puter");
  const [defaultModel, setDefaultModel] = useState("gpt-4o-mini");
  const [openaiSource, setOpenaiSource] = useState<KeySource>(null);
  const [geminiSource, setGeminiSource] = useState<KeySource>(null);
  const [mistralSource, setMistralSource] = useState<KeySource>(null);
  const [anthropicSource, setAnthropicSource] = useState<KeySource>(null);
  const [grokSource, setGrokSource] = useState<KeySource>(null);
  const [openrouterSource, setOpenrouterSource] = useState<KeySource>(null);

  // plan states
  const [plan, setPlan] = useState<string>("free");
  const isPro = plan === "pro" || plan === "enterprise";

  // BYOK States
  const [byokEnabled, setByokEnabled] = useState<{
    openai: boolean;
    gemini: boolean;
    mistral: boolean;
    anthropic: boolean;
    grok: boolean;
    openrouter: boolean;
  }>({
    openai: false,
    gemini: false,
    mistral: false,
    anthropic: false,
    grok: false,
    openrouter: false,
  });
  const [updatingBYOK, setUpdatingBYOK] = useState(false);

  // Defaults dirty-detection
  const [initialEngine, setInitialEngine] = useState<Engine>("puter");
  const [initialModel, setInitialModel] = useState("gpt-4o-mini");
  const [defaultsSaving, setDefaultsSaving] = useState(false);
  const [defaultsSaved, setDefaultsSaved] = useState(false);
  const [defaultsError, setDefaultsError] = useState<string | null>(null);

  // Puter
  const [puterUser, setPuterUser] = useState<{ username: string } | null>(null);
  const [puterBusy, setPuterBusy] = useState(false);

  // UI
  const [editMode, setEditMode] = useState(false);
  const [keyModal, setKeyModal] = useState<{
    open: boolean;
    provider: KeyProvider;
  }>({ open: false, provider: "openai" });

  const isDefaultsDirty =
    defaultEngine !== initialEngine || defaultModel !== initialModel;

  useEffect(() => {
    // Fetch AI config
    fetch("/api/pirateCOS/ai-config")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPlan(d.plan ?? "free");
          setOpenaiSource(d.openaiSource);
          setGeminiSource(d.geminiSource);
          setMistralSource(d.mistralSource);
          setAnthropicSource(d.anthropicSource);
          setGrokSource(d.grokSource);
          setOpenrouterSource(d.openrouterSource);
          const eng = (d.defaultEngine ?? "puter") as Engine;
          const mdl = d.defaultModel ?? "gpt-4o-mini";

          setDefaultEngine(eng);
          setInitialEngine(eng);
          setDefaultModel(mdl);
          setInitialModel(mdl);
        }
      })
      .catch(() => {});

    // Preference fetch removed (consolidated in Brand Brain)

    import("@heyputer/puter.js")
      .then(({ puter }) => {
        if (puter.auth.isSignedIn())
          puter.auth
            .getUser()
            .then(setPuterUser)
            .catch(() => {});
      })
      .catch(() => {});

    // Fetch BYOK Status from billing/usage
    fetch("/api/pirateCOS/billing/usage")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.byokEnabled) {
          setByokEnabled(d.byokEnabled);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleBYOK = async (provider: Engine) => {
    if (provider === "puter") return;
    setUpdatingBYOK(true);
    const nextBYOK = {
      ...byokEnabled,
      [provider]: !byokEnabled[provider],
    };

    try {
      const res = await fetch("/api/pirateCOS/billing/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ byokEnabled: nextBYOK }),
      });
      const json = await res.json();

      if (json.success) {
        setByokEnabled(json.byokEnabled);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingBYOK(false);
    }
  };

  const openKeyModal = (provider: KeyProvider) =>
    setKeyModal({ open: true, provider });
  const closeKeyModal = () => setKeyModal((m) => ({ ...m, open: false }));

  // Immediately save a single provider key to the API
  const saveKey = async (provider: KeyProvider, key: string): Promise<void> => {
    const body: Record<string, string> = { defaultEngine, defaultModel };

    if (provider === "openai") body.openaiKey = key;
    if (provider === "gemini") body.geminiKey = key;
    if (provider === "mistral") body.mistralKey = key;
    if (provider === "anthropic") body.anthropicKey = key;
    if (provider === "grok") body.grokKey = key;
    if (provider === "openrouter") body.openrouterKey = key;
    const res = await fetch("/api/pirateCOS/ai-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!data.success) throw new Error(data.error || "Save failed");
    // Refresh source badges
    const refreshed = await fetch("/api/pirateCOS/ai-config").then((r) =>
      r.json(),
    );

    if (refreshed.success) {
      setOpenaiSource(refreshed.openaiSource);
      setGeminiSource(refreshed.geminiSource);
      setMistralSource(refreshed.mistralSource);
      setAnthropicSource(refreshed.anthropicSource);
      setGrokSource(refreshed.grokSource);
      setOpenrouterSource(refreshed.openrouterSource);
    }
  };

  // Save only the engine/model defaults
  const saveDefaults = async () => {
    setDefaultsSaving(true);
    setDefaultsError(null);
    try {
      const res = await fetch("/api/pirateCOS/ai-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultEngine, defaultModel }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Save failed");
      localStorage.setItem(
        AI_CONFIG_LS_KEY,
        JSON.stringify({ defaultEngine, defaultModel }),
      );
      setInitialEngine(defaultEngine);
      setInitialModel(defaultModel);
      setEditMode(false);
      setDefaultsSaved(true);
      setTimeout(() => setDefaultsSaved(false), 2500);
    } catch (e: any) {
      setDefaultsError(e.message ?? "Unknown error");
    }
    setDefaultsSaving(false);
  };

  // Preferences save logic removed (consolidated in Brand Brain)

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

  const defaultEngineLabel = getProviderLabel(defaultEngine);
  const defaultEngineLogo = getProviderLogo(defaultEngine);
  const {
    models: availableModels,
    source: modelSource,
    isLoading: modelsLoading,
  } = useAIModels(defaultEngine);
  const defaultModelLabel =
    availableModels.find((m) => m.id === defaultModel)?.label ?? defaultModel;

  return (
    <div className="space-y-8 px-8 py-4 font-geist text-gray-700">
      <KeyModal
        open={keyModal.open}
        provider={keyModal.provider}
        onClose={closeKeyModal}
        onSave={saveKey}
      />

      {/* ── Page header ── */}
      <div className="pt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p
            className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1"
            style={{ color: "#FF5B04" }}
          >
            Admin
          </p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            AI Configuration & Engine Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your API keys and default AI engine providers.
          </p>
          <p className="text-xs text-gray-400 mt-2 font-geist">
            Looking to check credit balance or configure Bring Your Own Key (BYOK) billing?{" "}
            <a
              href="/pirateCOS/settings/billing"
              className="text-[#FF5B04] hover:underline font-semibold"
            >
              Go to Billing & Subscription Pools →
            </a>
          </p>
        </div>
      </div>

      <>
          {/* ── Providers row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Puter — free, no API key */}
            <SettingCard
              badge="Free"
              badgeColor="orange"
              description="Use GPT models for free via Puter.com — no API key required."
              icon={
                <img
                  src="/assets/logos/ai/puter.svg"
                  alt="Puter"
                  className="w-[18px] h-[18px] object-contain"
                />
              }
              title="Puter AI"
            >
              {puterUser ? (
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-sm font-geist text-gray-700 truncate">
                      {puterUser.username}
                    </span>
                  </div>
                  <button
                    className="text-xs font-geist text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
                    disabled={puterBusy}
                    onClick={puterSignOut}
                  >
                    {puterBusy ? "…" : "Sign out"}
                  </button>
                </div>
              ) : (
                <button
                  className="mt-3 w-full py-2 rounded-lg text-sm font-semibold font-geist text-white transition-opacity disabled:opacity-50"
                  disabled={puterBusy}
                  style={{ background: "#FF5B04" }}
                  onClick={puterSignIn}
                >
                  {puterBusy ? "Connecting…" : "Sign in to Puter"}
                </button>
              )}
            </SettingCard>

            {/* OpenAI */}
            <ProviderKeyCard
              badgeColor="emerald"
              description="GPT-4o, GPT-5 and newer models."
              icon={
                <img src="/assets/logos/ai/openai.svg" alt="OpenAI" className="w-5 h-5 object-contain" />
              }
              source={openaiSource}
              sourceColors={{
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                dot: "bg-emerald-400",
                text: "text-emerald-700",
              }}
              title="OpenAI"
              isPro={isPro}
              byokEnabled={byokEnabled.openai}
              updatingBYOK={updatingBYOK}
              onToggleBYOK={() => handleToggleBYOK("openai")}
              onManageKey={() => openKeyModal("openai")}
            />

            {/* Gemini */}
            <ProviderKeyCard
              badgeColor="blue"
              description="Gemini 1.5 Flash, Pro and 2.0 models."
              icon={<img src="/assets/logos/ai/google-gemini-icon.svg" alt="Google Gemini" className="w-5 h-5 object-contain" />}
              source={geminiSource}
              sourceColors={{
                bg: "bg-blue-50",
                border: "border-blue-100",
                dot: "bg-blue-400",
                text: "text-blue-700",
              }}
              title="Google Gemini"
              isPro={isPro}
              byokEnabled={byokEnabled.gemini}
              updatingBYOK={updatingBYOK}
              onToggleBYOK={() => handleToggleBYOK("gemini")}
              onManageKey={() => openKeyModal("gemini")}
            />

            {/* Mistral */}
            <ProviderKeyCard
              badgeColor="violet"
              description="Mistral Large, Small, Nemo and Codestral models."
              icon={
                <img src="/assets/logos/ai/mistral-ai-icon.svg" alt="Mistral AI" className="w-5 h-5 object-contain" />
              }
              source={mistralSource}
              sourceColors={{
                bg: "bg-violet-50",
                border: "border-violet-100",
                dot: "bg-violet-400",
                text: "text-violet-700",
              }}
              title="Mistral AI"
              isPro={isPro}
              byokEnabled={byokEnabled.mistral}
              updatingBYOK={updatingBYOK}
              onToggleBYOK={() => handleToggleBYOK("mistral")}
              onManageKey={() => openKeyModal("mistral")}
            />

            {/* Claude */}
            <ProviderKeyCard
              badgeColor="fuchsia"
              description="Claude Sonnet, Haiku and Opus models."
              icon={
                <img src="/assets/logos/ai/claude-ai-icon.svg" alt="Anthropic Claude" className="w-5 h-5 object-contain" />
              }
              source={anthropicSource}
              sourceColors={{
                bg: "bg-fuchsia-50",
                border: "border-fuchsia-100",
                dot: "bg-fuchsia-400",
                text: "text-fuchsia-700",
              }}
              title="Anthropic Claude"
              isPro={isPro}
              byokEnabled={byokEnabled.anthropic}
              updatingBYOK={updatingBYOK}
              onToggleBYOK={() => handleToggleBYOK("anthropic")}
              onManageKey={() => openKeyModal("anthropic")}
            />

            {/* Grok */}
            <ProviderKeyCard
              badgeColor="gray"
              description="Grok 2 and Grok Beta models."
              icon={
                <img src="/assets/logos/ai/xai-grok.svg" alt="xAI Grok" className="w-5 h-5 object-contain" />
              }
              source={grokSource}
              sourceColors={{
                bg: "bg-gray-50",
                border: "border-gray-100",
                dot: "bg-gray-400",
                text: "text-gray-700",
              }}
              title="xAI Grok"
              isPro={isPro}
              byokEnabled={byokEnabled.grok}
              updatingBYOK={updatingBYOK}
              onToggleBYOK={() => handleToggleBYOK("grok")}
              onManageKey={() => openKeyModal("grok")}
            />

            {/* OpenRouter */}
            <ProviderKeyCard
              badgeColor="violet"
              description="Llama 3, Claude, Gemini via OpenRouter."
              icon={
                <img src="/assets/logos/ai/openrouter.svg" alt="OpenRouter" className="w-5 h-5 object-contain" />
              }
              source={openrouterSource}
              sourceColors={{
                bg: "bg-violet-50",
                border: "border-violet-100",
                dot: "bg-violet-400",
                text: "text-violet-700",
              }}
              title="OpenRouter"
              isPro={isPro}
              byokEnabled={byokEnabled.openrouter}
              updatingBYOK={updatingBYOK}
              onToggleBYOK={() => handleToggleBYOK("openrouter")}
              onManageKey={() => openKeyModal("openrouter")}
            />
          </div>

          {/* ── Defaults ── */}
          <div className="bg-white rounded-2xl shadow-card border border-black/5 overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
              <div>
                <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400">
                  Active Defaults
                </p>
                <p className="text-sm font-geist text-gray-500 mt-0.5">
                  Engine and model pre-selected in the writing assistant
                </p>
              </div>
              <button
                className={`px-4 py-2 rounded-xl text-xs font-semibold font-geist transition-all border flex items-center gap-1.5 ${
                  editMode
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200 border-black/5"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-black/5"
                }`}
                onClick={() => setEditMode((v) => !v)}
              >
                {editMode ? (
                  <>
                    <svg
                      fill="none"
                      height="10"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                      width="10"
                    >
                      <line x1="18" x2="6" y1="6" y2="18" />
                      <line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg
                      fill="none"
                      height="10"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="10"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Configuration
                  </>
                )}
              </button>
            </div>

            {!editMode ? (
              /* ── Read-only summary ── */
              <div className="px-6 py-5 flex flex-wrap items-center gap-8">
                <div>
                  <p className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-1.5">
                    Engine
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={defaultEngineLogo}
                      alt={defaultEngineLabel}
                      className="w-4 h-4 object-contain"
                    />
                    <span
                      className="text-sm font-bold font-geist"
                      style={{ color: "#FF5B04" }}
                    >
                      {defaultEngineLabel}
                    </span>
                  </div>
                </div>
                <div className="w-px h-8 bg-black/5 hidden sm:block" />
                <div>
                  <p className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-1.5">
                    Model
                  </p>
                  <span className="text-sm font-bold font-geist text-gray-800">
                    {defaultModelLabel}
                  </span>
                  {modelSource !== "fallback" && (
                    <p className="text-[10px] text-gray-400 font-geist mt-1">
                      Live provider catalog enabled
                    </p>
                  )}
                </div>
                <div className="ml-auto hidden sm:block">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-[#FF5B04]/20 text-xs font-semibold font-geist"
                    style={{ color: "#FF5B04" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B04]" />
                    Current Default
                  </span>
                </div>
              </div>
            ) : (
              /* ── Edit mode ── */
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Engine selector */}
                <div>
                  <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-3">
                    Default Engine
                  </p>
                  <div className="flex flex-wrap bg-black/[0.04] p-1 rounded-xl gap-1">
                    {AI_PROVIDERS.map((provider) => (
                        <button
                          key={provider.id}
                          className={`flex-1 py-2 rounded-lg text-xs font-semibold font-geist transition-all flex items-center justify-center gap-1.5 ${
                            defaultEngine === provider.id
                              ? "bg-white text-gray-900 shadow-sm border border-black/5"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                          onClick={() => {
                            setDefaultEngine(provider.id);
                            setDefaultModel(getDefaultModelForEngine(provider.id));
                          }}
                        >
                          <img
                            src={provider.logo}
                            alt={provider.name}
                            className="w-3.5 h-3.5 object-contain"
                          />
                          {provider.shortName}
                        </button>
                    ))}
                  </div>
                </div>
                {/* Model selector */}
                <div>
                  <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-3">
                    {modelsLoading ? "Loading Models..." : "Default Model"}
                  </p>
                  <select
                    className="w-full text-sm font-geist bg-gray-50 border border-black/[0.08] text-gray-700 px-3 py-2.5 rounded-xl outline-none cursor-pointer"
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                  >
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} {m.description ? `— ${m.description}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Save Defaults row */}
                <div className="md:col-span-2 flex items-center gap-3 pt-2 border-t border-black/5">
                  <button
                    className="px-5 py-2 rounded-xl text-sm font-semibold font-geist text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    disabled={!isDefaultsDirty || defaultsSaving}
                    style={{
                      background: defaultsSaved ? "#16a34a" : "#FF5B04",
                    }}
                    onClick={saveDefaults}
                  >
                    {defaultsSaving ? (
                      <>
                        <svg
                          className="animate-spin"
                          fill="none"
                          height="13"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          width="13"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Saving…
                      </>
                    ) : defaultsSaved ? (
                      <>
                        <svg
                          fill="none"
                          height="13"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                          width="13"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Saved!
                      </>
                    ) : (
                      "Save Defaults"
                    )}
                  </button>
                  {isDefaultsDirty && !defaultsSaving && (
                    <p className="text-[11px] font-geist text-amber-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                      Unsaved changes
                    </p>
                  )}
                  {defaultsError && (
                    <p className="text-xs text-red-500 font-geist">
                      {defaultsError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Storage note ── */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
            <svg
              className="flex-shrink-0 mt-0.5"
              fill="none"
              height="14"
              stroke="#16a34a"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <p className="text-xs font-geist text-green-800 leading-relaxed">
              API keys are <strong>AES-256-GCM encrypted</strong> and stored in
              your MongoDB database. They are decrypted server-side only when
              making AI requests — they never leave your server or reach the
              browser. Requires{" "}
              <code className="bg-green-100 px-1 rounded text-[10px]">
                AI_ENCRYPTION_KEY
              </code>{" "}
              in your{" "}
              <code className="bg-green-100 px-1 rounded text-[10px]">
                .env.local
              </code>
              .
            </p>
          </div>
      </>
    </div>
  );
}

/* ── Sub-components ── */

interface CardProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeColor?: "orange" | "emerald" | "blue" | "violet" | "fuchsia" | "gray";
  description: string;
  children?: React.ReactNode;
}
const SettingCard = ({
  icon,
  title,
  badge,
  badgeColor = "orange",
  description,
  children,
}: CardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-card border border-black/5 flex flex-col">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm font-bold font-geist text-gray-900">
        {title}
      </span>
      {badge && (
        <span
          className={`ml-auto text-[10px] font-jetbrains-mono px-2 py-0.5 rounded-full
          ${
            badgeColor === "emerald"
              ? "text-emerald-700 bg-emerald-50"
              : badgeColor === "blue"
                ? "text-blue-700 bg-blue-50"
                : badgeColor === "violet"
                  ? "text-violet-700 bg-violet-50"
                  : badgeColor === "fuchsia"
                    ? "text-fuchsia-700 bg-fuchsia-50"
                  : badgeColor === "gray"
                    ? "text-gray-700 bg-gray-50"
                  : "text-orange-700 bg-orange-50"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
    <p className="text-xs font-geist text-gray-500 leading-relaxed">
      {description}
    </p>
    {children}
  </div>
);

interface ProviderKeyCardProps {
  icon: React.ReactNode;
  title: string;
  badgeColor: "emerald" | "blue" | "violet" | "fuchsia" | "gray";
  source: KeySource;
  description: string;
  sourceColors: { bg: string; border: string; dot: string; text: string };
  isPro: boolean;
  byokEnabled: boolean;
  updatingBYOK: boolean;
  onToggleBYOK: () => void;
  onManageKey: () => void;
}
const ProviderKeyCard = ({
  icon,
  title,
  badgeColor,
  source,
  description,
  sourceColors,
  isPro,
  byokEnabled,
  updatingBYOK,
  onToggleBYOK,
  onManageKey,
}: ProviderKeyCardProps) => {
  const badge =
    source === "env" ? ".env ✓" : source === "db" ? "Saved" : undefined;

  return (
    <SettingCard
      badge={badge}
      badgeColor={badgeColor}
      description={description}
      icon={icon}
      title={title}
    >
      {/* Key status pill */}
      {source ? (
        <div
          className={`flex items-center gap-2 mt-3 px-3 py-2 rounded-lg ${sourceColors.bg} border ${sourceColors.border}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${sourceColors.dot} flex-shrink-0`}
          />
          <span className={`text-xs font-geist ${sourceColors.text}`}>
            {source === "env"
              ? "Key loaded from .env"
              : "Encrypted key saved in database"}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-gray-50 border border-black/5">
          <span className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
          <span className="text-xs font-geist text-gray-400">
            No key configured
          </span>
        </div>
      )}

      {/* BYOK Toggle */}
      {source && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/[0.04] relative">
          <div>
            <span className="text-[11px] font-bold text-gray-700 block">BYOK Bypass</span>
            <span className="text-[9px] text-gray-400 block leading-tight">
              Bypasses shared credit pools
            </span>
          </div>
          <button
            className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
              byokEnabled && isPro ? "bg-green-500" : "bg-gray-200"
            }`}
            disabled={updatingBYOK || !isPro}
            type="button"
            onClick={onToggleBYOK}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 block ${
                byokEnabled && isPro ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          {!isPro && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[0.5px] flex items-center justify-end pr-1 text-[10px] font-bold text-[#FF5B04] font-geist">
              🔒 Locked
            </div>
          )}
        </div>
      )}

      {/* Manage button */}
      <button
        className={`mt-3 w-full py-2 rounded-lg text-xs font-semibold font-geist border transition-colors flex items-center justify-center gap-1.5 ${
          isPro 
            ? "text-gray-700 bg-gray-50 hover:bg-gray-100 border-black/5" 
            : "text-gray-400 bg-gray-100 border-transparent cursor-not-allowed"
        }`}
        disabled={!isPro}
        onClick={onManageKey}
      >
        <svg
          fill="none"
          height="12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="12"
        >
          <circle cx="7.5" cy="15.5" r="5.5" />
          <path d="M21 2l-9.6 9.6M15.5 7.5l3 3" />
        </svg>
        {isPro ? (source ? "Update API Key" : "Add API Key") : "🔒 Unlock with Pro"}
      </button>
    </SettingCard>
  );
};
