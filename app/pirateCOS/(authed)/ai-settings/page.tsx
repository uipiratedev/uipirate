"use client";

import { useState, useEffect } from "react";

import { AI_CONFIG_LS_KEY } from "@/components/pirateCOS/AIConfigPanel";

/* ── Types & constants ── */
type Engine = "openai" | "gemini" | "puter" | "mistral" | "anthropic";
type KeySource = "env" | "db" | null;
type KeyProvider = "openai" | "gemini" | "mistral" | "anthropic";

const ENGINE_META: Record<
  Engine,
  { label: string; icon: string; iconClass: string }
> = {
  openai: { label: "OpenAI", icon: "●", iconClass: "text-emerald-500" },
  gemini: { label: "Google Gemini", icon: "✦", iconClass: "text-blue-500" },
  mistral: { label: "Mistral AI", icon: "◆", iconClass: "text-violet-600" },
  anthropic: {
    label: "Claude",
    icon: "◆",
    iconClass: "text-fuchsia-600",
  },
  puter: { label: "Puter AI", icon: "◎", iconClass: "text-[#FF5B04]" },
};

const MODEL_LABELS: Record<string, string> = {
  "gpt-4o-mini": "GPT-4o Mini",
  "gpt-4o": "GPT-4o",
  "gpt-5.5": "GPT-5.5",
  "gpt-5.4": "GPT-5.4",
  "gpt-5.4-mini": "GPT-5.4 Mini",
  "gemini-flash-latest": "Gemini 1.5 Flash",
  "gemini-1.5-pro-latest": "Gemini 1.5 Pro",
  "gemini-2.0-flash-exp": "Gemini 2.0 Flash",
  "mistral-large-latest": "Mistral Large",
  "mistral-small-latest": "Mistral Small",
  "mistral-nemo": "Mistral Nemo",
  "codestral-latest": "Codestral",
  "claude-3-5-sonnet-latest": "Claude 3.5 Sonnet",
  "claude-3-5-haiku-latest": "Claude 3.5 Haiku",
  "claude-3-opus-latest": "Claude 3 Opus",
};

/* ── KeyModal ── */
const PROVIDER_INFO: Record<
  KeyProvider,
  {
    label: string;
    icon: string;
    iconClass: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    placeholder: string;
    description: string;
    link: string;
    linkLabel: string;
  }
> = {
  openai: {
    label: "OpenAI",
    icon: "●",
    iconClass: "text-emerald-500",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-100",
    textClass: "text-emerald-700",
    placeholder: "sk-...",
    description: "Used for GPT-4o, GPT-5 and newer OpenAI models.",
    link: "https://platform.openai.com/api-keys",
    linkLabel: "platform.openai.com/api-keys",
  },
  gemini: {
    label: "Google Gemini",
    icon: "✦",
    iconClass: "text-blue-500",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-100",
    textClass: "text-blue-700",
    placeholder: "AIza...",
    description: "Used for Gemini 1.5 Flash, Pro and 2.0 models.",
    link: "https://aistudio.google.com/app/apikey",
    linkLabel: "aistudio.google.com/app/apikey",
  },
  mistral: {
    label: "Mistral AI",
    icon: "◆",
    iconClass: "text-violet-600",
    bgClass: "bg-violet-50",
    borderClass: "border-violet-100",
    textClass: "text-violet-700",
    placeholder: "e.g. your Mistral API key",
    description: "Used for Mistral Large, Small, Nemo and Codestral.",
    link: "https://console.mistral.ai/api-keys",
    linkLabel: "console.mistral.ai/api-keys",
  },
  anthropic: {
    label: "Anthropic Claude",
    icon: "◆",
    iconClass: "text-fuchsia-600",
    bgClass: "bg-fuchsia-50",
    borderClass: "border-fuchsia-100",
    textClass: "text-fuchsia-700",
    placeholder: "sk-ant-...",
    description: "Used for Claude Sonnet, Haiku and Opus models.",
    link: "https://console.anthropic.com/settings/keys",
    linkLabel: "console.anthropic.com/settings/keys",
  },
};

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
  const info = PROVIDER_INFO[provider];
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
              Update {info.label} Key
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
          className={`flex items-start gap-3 px-4 py-3 rounded-xl mb-5 ${info.bgClass} border ${info.borderClass}`}
        >
          <span
            className={`text-xl leading-none mt-0.5 flex-shrink-0 ${info.iconClass}`}
          >
            {info.icon}
          </span>
          <div className="min-w-0">
            <p
              className={`text-xs font-bold font-geist mb-0.5 ${info.textClass}`}
            >
              {info.label}
            </p>
            <p className="text-xs font-geist text-gray-500 leading-relaxed">
              {info.description}
            </p>
            <a
              className={`inline-flex items-center gap-1 text-[11px] font-geist mt-1.5 underline underline-offset-2 ${info.textClass} hover:opacity-70 transition-opacity`}
              href={info.link}
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
              {info.linkLabel}
            </a>
          </div>
        </div>

        {/* Key input */}
        <p className="text-xs font-geist text-gray-500 mb-2">
          {info.label} API Key
        </p>
        <div className="relative mb-2">
          <input
            autoFocus
            className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2.5 pr-14 outline-none placeholder:text-gray-400"
            placeholder={info.placeholder}
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
  const [activeTab, setActiveTab] = useState<"keys" | "preferences">("keys");

  // Config
  const [defaultEngine, setDefaultEngine] = useState<Engine>("puter");
  const [defaultModel, setDefaultModel] = useState("gpt-4o-mini");
  const [openaiSource, setOpenaiSource] = useState<KeySource>(null);
  const [geminiSource, setGeminiSource] = useState<KeySource>(null);
  const [mistralSource, setMistralSource] = useState<KeySource>(null);
  const [anthropicSource, setAnthropicSource] = useState<KeySource>(null);

  // Defaults dirty-detection
  const [initialEngine, setInitialEngine] = useState<Engine>("puter");
  const [initialModel, setInitialModel] = useState("gpt-4o-mini");
  const [defaultsSaving, setDefaultsSaving] = useState(false);
  const [defaultsSaved, setDefaultsSaved] = useState(false);
  const [defaultsError, setDefaultsError] = useState<string | null>(null);

  // Preferences / Style Memory
  const [preferredTone, setPreferredTone] = useState(
    "Professional & Authoritative",
  );
  const [sentenceComplexity, setSentenceComplexity] = useState<
    "simple" | "moderate" | "advanced"
  >("moderate");
  const [alwaysIncludeTakeaways, setAlwaysIncludeTakeaways] = useState(false);
  const [alwaysIncludeFAQ, setAlwaysIncludeFAQ] = useState(false);
  const [autoAppendCTA, setAutoAppendCTA] = useState(false);
  const [defaultCTA, setDefaultCTA] = useState("");
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);

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
          setOpenaiSource(d.openaiSource);
          setGeminiSource(d.geminiSource);
          setMistralSource(d.mistralSource);
          setAnthropicSource(d.anthropicSource);
          const eng = (d.defaultEngine ?? "puter") as Engine;
          const mdl = d.defaultModel ?? "gpt-4o-mini";

          setDefaultEngine(eng);
          setInitialEngine(eng);
          setDefaultModel(mdl);
          setInitialModel(mdl);
        }
      })
      .catch(() => {});

    // Fetch Workflow Memory preferences
    fetch("/api/pirateCOS/ai-config/preferences")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.preferences) {
          setPreferredTone(
            d.preferences.preferredTone || "Professional & Authoritative",
          );
          setSentenceComplexity(d.preferences.sentenceComplexity || "moderate");
          setAlwaysIncludeTakeaways(
            !!d.preferences.formattingRules?.alwaysIncludeTakeaways,
          );
          setAlwaysIncludeFAQ(
            !!d.preferences.formattingRules?.alwaysIncludeFAQ,
          );
          setAutoAppendCTA(!!d.preferences.formattingRules?.autoAppendCTA);
          setDefaultCTA(d.preferences.defaultCTA || "");
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
  }, []);

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

  // Save workflow memory and style preferences
  const savePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefsSaving(true);
    setPrefsError(null);
    try {
      const res = await fetch("/api/pirateCOS/ai-config/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredTone,
          sentenceComplexity,
          formattingRules: {
            alwaysIncludeTakeaways,
            alwaysIncludeFAQ,
            autoAppendCTA,
          },
          defaultCTA,
        }),
      });
      const data = await res.json();

      if (!data.success)
        throw new Error(data.error || "Failed to update preferences");
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    } catch (e: any) {
      setPrefsError(e.message ?? "Unknown error occurred.");
    }
    setPrefsSaving(false);
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

  const engMeta = ENGINE_META[defaultEngine];

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
            AI Configuration & Style Preferences
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your keys, default AI providers, and customize workflow
            styling memory parameters.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-[#F7F7F6] p-1 rounded-xl border border-black/5 self-start">
          <button
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "keys"
                ? "bg-white text-gray-900 shadow-sm border border-black/5"
                : "text-gray-400 hover:text-gray-800"
            }`}
            type="button"
            onClick={() => setActiveTab("keys")}
          >
            API & Providers
          </button>
          <button
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "preferences"
                ? "bg-white text-gray-900 shadow-sm border border-black/5"
                : "text-gray-400 hover:text-gray-800"
            }`}
            type="button"
            onClick={() => setActiveTab("preferences")}
          >
            Style Preferences
          </button>
        </div>
      </div>

      {activeTab === "keys" ? (
        <>
          {/* ── Providers row ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Puter — free, no API key */}
            <SettingCard
              badge="Free"
              badgeColor="orange"
              description="Use GPT models for free via Puter.com — no API key required."
              icon={
                <svg
                  fill="none"
                  height="18"
                  stroke="#FF5B04"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
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
                <span className="text-emerald-500 text-lg font-bold">●</span>
              }
              source={openaiSource}
              sourceColors={{
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                dot: "bg-emerald-400",
                text: "text-emerald-700",
              }}
              title="OpenAI"
              onManageKey={() => openKeyModal("openai")}
            />

            {/* Gemini */}
            <ProviderKeyCard
              badgeColor="blue"
              description="Gemini 1.5 Flash, Pro and 2.0 models."
              icon={<span className="text-blue-500 text-lg font-bold">✦</span>}
              source={geminiSource}
              sourceColors={{
                bg: "bg-blue-50",
                border: "border-blue-100",
                dot: "bg-blue-400",
                text: "text-blue-700",
              }}
              title="Google Gemini"
              onManageKey={() => openKeyModal("gemini")}
            />

            {/* Mistral */}
            <ProviderKeyCard
              badgeColor="violet"
              description="Mistral Large, Small, Nemo and Codestral models."
              icon={
                <span className="text-violet-600 text-lg font-bold">◆</span>
              }
              source={mistralSource}
              sourceColors={{
                bg: "bg-violet-50",
                border: "border-violet-100",
                dot: "bg-violet-400",
                text: "text-violet-700",
              }}
              title="Mistral AI"
              onManageKey={() => openKeyModal("mistral")}
            />

            {/* Claude */}
            <ProviderKeyCard
              badgeColor="fuchsia"
              description="Claude Sonnet, Haiku and Opus models."
              icon={
                <span className="text-fuchsia-600 text-lg font-bold">◆</span>
              }
              source={anthropicSource}
              sourceColors={{
                bg: "bg-fuchsia-50",
                border: "border-fuchsia-100",
                dot: "bg-fuchsia-400",
                text: "text-fuchsia-700",
              }}
              title="Anthropic Claude"
              onManageKey={() => openKeyModal("anthropic")}
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
                    <span className={`text-base ${engMeta.iconClass}`}>
                      {engMeta.icon}
                    </span>
                    <span
                      className="text-sm font-bold font-geist"
                      style={{ color: "#FF5B04" }}
                    >
                      {engMeta.label}
                    </span>
                  </div>
                </div>
                <div className="w-px h-8 bg-black/5 hidden sm:block" />
                <div>
                  <p className="text-[10px] font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-1.5">
                    Model
                  </p>
                  <span className="text-sm font-bold font-geist text-gray-800">
                    {MODEL_LABELS[defaultModel] ?? defaultModel}
                  </span>
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
                    {(
                      [
                        "openai",
                        "gemini",
                        "anthropic",
                        "mistral",
                        "puter",
                      ] as Engine[]
                    ).map((eng) => (
                        <button
                          key={eng}
                          className={`flex-1 py-2 rounded-lg text-xs font-semibold font-geist transition-all ${
                            defaultEngine === eng
                              ? "bg-white text-gray-900 shadow-sm border border-black/5"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                          onClick={() => {
                            setDefaultEngine(eng);
                            setDefaultModel(
                              eng === "gemini"
                                ? "gemini-flash-latest"
                                : eng === "anthropic"
                                  ? "claude-3-5-sonnet-latest"
                                : eng === "mistral"
                                  ? "mistral-large-latest"
                                  : "gpt-4o-mini",
                            );
                          }}
                        >
                          <span className={ENGINE_META[eng].iconClass}>
                            {ENGINE_META[eng].icon}
                          </span>{" "}
                          {ENGINE_META[eng].label.split(" ")[0]}
                        </button>
                    ))}
                  </div>
                </div>
                {/* Model selector */}
                <div>
                  <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400 mb-3">
                    Default Model
                  </p>
                  <select
                    className="w-full text-sm font-geist bg-gray-50 border border-black/[0.08] text-gray-700 px-3 py-2.5 rounded-xl outline-none cursor-pointer"
                    value={defaultModel}
                    onChange={(e) => setDefaultModel(e.target.value)}
                  >
                    {defaultEngine === "gemini" ? (
                      <>
                        <option value="gemini-flash-latest">
                          Gemini 1.5 Flash
                        </option>
                        <option value="gemini-1.5-pro-latest">
                          Gemini 1.5 Pro
                        </option>
                        <option value="gemini-2.0-flash-exp">
                          Gemini 2.0 Flash
                        </option>
                      </>
                    ) : defaultEngine === "mistral" ? (
                      <>
                        <option value="mistral-large-latest">
                          Mistral Large — Most Capable
                        </option>
                        <option value="mistral-small-latest">
                          Mistral Small — Fast
                        </option>
                        <option value="mistral-nemo">
                          Mistral Nemo — Lightweight
                        </option>
                        <option value="codestral-latest">
                          Codestral — Code
                        </option>
                      </>
                    ) : defaultEngine === "anthropic" ? (
                      <>
                        <option value="claude-3-5-sonnet-latest">
                          Claude 3.5 Sonnet
                        </option>
                        <option value="claude-3-5-haiku-latest">
                          Claude 3.5 Haiku
                        </option>
                        <option value="claude-3-opus-latest">
                          Claude 3 Opus
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="gpt-4o-mini">GPT-4o Mini — Fast</option>
                        <option value="gpt-4o">GPT-4o</option>
                        <option value="gpt-5.5">GPT-5.5</option>
                        <option value="gpt-5.4">GPT-5.4</option>
                        <option value="gpt-5.4-mini">GPT-5.4 Mini</option>
                      </>
                    )}
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
      ) : (
        /* ── WORKFLOW PREFERENCES / WRITING STYLE MEMORY TAB ── */
        <form
          className="bg-white rounded-2xl shadow-card border border-black/5 overflow-hidden flex flex-col min-h-[400px]"
          onSubmit={savePreferences}
        >
          <div className="px-6 py-4 border-b border-black/5">
            <p className="text-xs font-jetbrains-mono uppercase tracking-widest text-gray-400">
              Style Preferences & Content Guidelines
            </p>
            <p className="text-sm font-geist text-gray-500 mt-0.5">
              Customize readability, tone directions, and automatic CTA
              insertions.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {prefsError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                ✗ {prefsError}
              </div>
            )}
            {prefsSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium">
                ✓ Style preferences successfully updated! Downstream AI prompt
                injection is live.
              </div>
            )}

            {/* Tone Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Preferred Writing Tone
              </label>
              <select
                className="w-full max-w-md bg-[#F7F7F6] border border-transparent rounded-xl px-4 h-11 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all cursor-pointer text-gray-700 font-medium"
                value={preferredTone}
                onChange={(e) => setPreferredTone(e.target.value)}
              >
                <option value="Professional & Authoritative">
                  Professional & Authoritative (Expert, expert copy)
                </option>
                <option value="Conversational & Friendly">
                  Conversational & Friendly (Engaging, warm)
                </option>
                <option value="Bold & Energetic">
                  Bold & Energetic (Pioneering, inspirational)
                </option>
                <option value="Empathetic & Supportive">
                  Empathetic & Supportive (Compassionate)
                </option>
                <option value="Sleek & Minimalist">
                  Sleek & Minimalist (Premium, designs agency copy)
                </option>
              </select>
            </div>

            {/* Readability Complexity */}
            <div className="space-y-2 max-w-md">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Sentence Complexity & Readability
              </label>
              <div className="flex bg-[#F7F7F6] p-1 rounded-xl gap-1">
                {(["simple", "moderate", "advanced"] as const).map((comp) => (
                  <button
                    key={comp}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                      sentenceComplexity === comp
                        ? "bg-white text-gray-900 shadow-sm border border-black/5"
                        : "text-gray-400 hover:text-gray-800"
                    }`}
                    type="button"
                    onClick={() => setSentenceComplexity(comp)}
                  >
                    {comp}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 leading-normal">
                {sentenceComplexity === "simple" &&
                  "💡 Short, punchy sentences ideal for readability and quick skimming."}
                {sentenceComplexity === "moderate" &&
                  "💡 Balanced structure representing typical B2B SaaS and industry tutorials."}
                {sentenceComplexity === "advanced" &&
                  "💡 Multi-clause, detail-rich arguments ideal for technical deep dives."}
              </p>
            </div>

            {/* Formatting Constraints */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Structural Content Constraints
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  checked={alwaysIncludeTakeaways}
                  className="mt-1 w-4 h-4 rounded text-[#FF5B04] border-gray-300 focus:ring-[#FF5B04] cursor-pointer"
                  type="checkbox"
                  onChange={(e) => setAlwaysIncludeTakeaways(e.target.checked)}
                />
                <div>
                  <span className="text-xs font-bold text-gray-800 block group-hover:text-gray-900">
                    Always generate a 3-sentence "Key Takeaways" block
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Places a summarized highlight box at the top of every
                    generated post automatically.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  checked={alwaysIncludeFAQ}
                  className="mt-1 w-4 h-4 rounded text-[#FF5B04] border-gray-300 focus:ring-[#FF5B04] cursor-pointer"
                  type="checkbox"
                  onChange={(e) => setAlwaysIncludeFAQ(e.target.checked)}
                />
                <div>
                  <span className="text-xs font-bold text-gray-800 block group-hover:text-gray-900">
                    Always append an FAQ segment at the post footer
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Generates a structured 'Frequently Asked Questions' H2
                    header with Q&As at the end of drafts.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  checked={autoAppendCTA}
                  className="mt-1 w-4 h-4 rounded text-[#FF5B04] border-gray-300 focus:ring-[#FF5B04] cursor-pointer"
                  type="checkbox"
                  onChange={(e) => setAutoAppendCTA(e.target.checked)}
                />
                <div>
                  <span className="text-xs font-bold text-gray-800 block group-hover:text-gray-900">
                    Auto-append standard CTA footer block
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                    Injects the custom call-to-action text below into the
                    closing block of generated posts.
                  </span>
                </div>
              </label>
            </div>

            {/* Standard CTA Text */}
            <div className="space-y-1.5 max-w-2xl">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                Standard CTA Footnote Template
              </label>
              <textarea
                className="w-full bg-[#F7F7F6] border border-transparent rounded-xl p-4 text-sm focus:border-[#FF5B04]/30 focus:bg-white outline-none transition-all resize-none leading-relaxed text-gray-700 font-medium"
                placeholder="e.g. Schedule a 15-minute SaaS design consultation with the UI Pirate crew today at https://uipirate.com!"
                rows={3}
                value={defaultCTA}
                onChange={(e) => setDefaultCTA(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-[#F7F7F6] border-t border-black/5 px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-semibold">
              💡 Constraints are dynamically injected into active editor writer
              prompts.
            </span>
            <button
              className="bg-[#FF5B04] text-white text-xs font-bold px-6 h-9 rounded-lg hover:opacity-95 transition-opacity disabled:opacity-50"
              disabled={prefsSaving}
              type="submit"
            >
              {prefsSaving ? "Saving Guidelines..." : "Save Preferences"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Sub-components ── */

interface CardProps {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeColor?: "orange" | "emerald" | "blue" | "violet" | "fuchsia";
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
  badgeColor: "emerald" | "blue" | "violet" | "fuchsia";
  source: KeySource;
  description: string;
  sourceColors: { bg: string; border: string; dot: string; text: string };
  onManageKey: () => void;
}
const ProviderKeyCard = ({
  icon,
  title,
  badgeColor,
  source,
  description,
  sourceColors,
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
      {/* Manage button */}
      <button
        className="mt-3 w-full py-2 rounded-lg text-xs font-semibold font-geist text-gray-700 bg-gray-50 hover:bg-gray-100 border border-black/5 transition-colors flex items-center justify-center gap-1.5"
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
        {source ? "Update API Key" : "Add API Key"}
      </button>
    </SettingCard>
  );
};
