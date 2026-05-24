"use client";

import { useState, useEffect, useCallback } from "react";

interface Integration {
  platform: string;
  isActive: boolean;
  isConnected: boolean;
  siteUrl?: string;
  wpUsername?: string;
  mediumAuthorId?: string;
  ghostSiteUrl?: string;
  bufferProfileIds?: string[];
  lastTestedAt?: string | null;
}

interface ApiKeyMeta {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: ("read" | "write")[];
  lastUsedAt?: string | null;
  createdAt: string;
  isActive: boolean;
}

const PLATFORM_LABELS: Record<string, string> = {
  wordpress: "WordPress",
  medium: "Medium",
  ghost: "Ghost",
  buffer: "Buffer",
};

const PLATFORM_ICONS: Record<string, string> = {
  wordpress: "W",
  medium: "M",
  ghost: "G",
  buffer: "B",
};

const PLATFORM_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  wordpress: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100", accent: "#21759b" },
  medium: { bg: "bg-gray-50", text: "text-gray-900", border: "border-gray-100", accent: "#00ab6c" },
  ghost: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100", accent: "#30cf43" },
  buffer: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100", accent: "#FF5B04" },
};

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);

  // Modals state
  const [credentialsModal, setCredentialsModal] = useState<{
    open: boolean;
    platform: string;
  }>({ open: false, platform: "" });

  const [newKeyModal, setNewKeyModal] = useState(false);
  const [rawKeyReturned, setRawKeyReturned] = useState<string | null>(null);

  // Form states
  const [wpForm, setWpForm] = useState({ siteUrl: "", wpUsername: "", wpAppPassword: "" });
  const [mediumForm, setMediumForm] = useState({ mediumAuthorId: "", mediumToken: "" });
  const [ghostForm, setGhostForm] = useState({ ghostSiteUrl: "", ghostAdminKey: "" });
  const [bufferForm, setBufferForm] = useState({ bufferAccessToken: "", bufferProfileIds: "" });

  const [newKeyForm, setNewKeyForm] = useState({ name: "", scopeWrite: false });
  const [savingKey, setSavingKey] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [intRes, keysRes] = await Promise.all([
        fetch("/api/pirateCOS/integrations"),
        fetch("/api/pirateCOS/integrations/keys"),
      ]);

      const intData = await intRes.json();
      const keysData = await keysRes.json();

      if (intData.success) {
        setIntegrations(intData.integrations || []);
      }
      if (keysData.success) {
        setApiKeys(keysData.keys || []);
      }
    } catch (err) {
      console.error("Failed to load settings data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCredentialsModal = (platform: string) => {
    setErrorText(null);
    const doc = integrations.find((i) => i.platform === platform);

    if (platform === "wordpress") {
      setWpForm({
        siteUrl: doc?.siteUrl || "",
        wpUsername: doc?.wpUsername || "",
        wpAppPassword: "",
      });
    } else if (platform === "medium") {
      setMediumForm({
        mediumAuthorId: doc?.mediumAuthorId || "",
        mediumToken: "",
      });
    } else if (platform === "ghost") {
      setGhostForm({
        ghostSiteUrl: doc?.ghostSiteUrl || "",
        ghostAdminKey: "",
      });
    } else if (platform === "buffer") {
      setBufferForm({
        bufferAccessToken: "",
        bufferProfileIds: doc?.bufferProfileIds?.join(", ") || "",
      });
    }

    setCredentialsModal({ open: true, platform });
  };

  const closeCredentialsModal = () => {
    setCredentialsModal({ open: false, platform: "" });
    setErrorText(null);
  };

  const saveCredentials = async () => {
    const { platform } = credentialsModal;
    setSavingCredentials(true);
    setErrorText(null);

    let body: Record<string, any> = { platform };

    if (platform === "wordpress") {
      body = { ...body, ...wpForm };
    } else if (platform === "medium") {
      body = { ...body, ...mediumForm };
    } else if (platform === "ghost") {
      body = { ...body, ...ghostForm };
    } else if (platform === "buffer") {
      const profileIds = bufferForm.bufferProfileIds
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      body = { ...body, bufferAccessToken: bufferForm.bufferAccessToken, bufferProfileIds: profileIds };
    }

    try {
      const res = await fetch("/api/pirateCOS/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save integration settings");
      }

      await fetchData();
      closeCredentialsModal();
    } catch (err: any) {
      setErrorText(err.message || "Unknown error saving credentials");
    } finally {
      setSavingCredentials(false);
    }
  };

  const handleTestConnection = async (platform: string) => {
    setTestingPlatform(platform);
    try {
      const res = await fetch(`/api/pirateCOS/integrations/${platform}`, {
        method: "PATCH",
      });

      const data = await res.json();
      setTestResults((prev) => ({
        ...prev,
        [platform]: {
          success: res.ok && data.success,
          message: data.message || (res.ok ? "Connection OK" : "Connection failed"),
        },
      }));
      await fetchData();
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [platform]: { success: false, message: err.message || "Network error testing connection" },
      }));
    } finally {
      setTestingPlatform(null);
    }
  };

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${PLATFORM_LABELS[platform]}?`)) return;

    try {
      const res = await fetch(`/api/pirateCOS/integrations/${platform}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTestResults((prev) => {
          const next = { ...prev };
          delete next[platform];
          return next;
        });
        await fetchData();
      }
    } catch (err) {
      console.error("Disconnect platform error", err);
    }
  };

  const handleCreateApiKey = async () => {
    setSavingKey(true);
    setErrorText(null);

    const scopes = ["read"];
    if (newKeyForm.scopeWrite) scopes.push("write");

    try {
      const res = await fetch("/api/pirateCOS/integrations/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyForm.name,
          scopes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate API Key");
      }

      setRawKeyReturned(data.key);
      await fetchData();
      setNewKeyForm({ name: "", scopeWrite: false });
    } catch (err: any) {
      setErrorText(err.message || "Unknown error creating API key");
    } finally {
      setSavingKey(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API Key permanently? Programmatic scripts using it will lose access immediately.")) return;

    try {
      const res = await fetch(`/api/pirateCOS/integrations/keys/${keyId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error("Revocation error", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-sm text-gray-400 font-geist">
        Loading integrations settings center...
      </div>
    );
  }

  const currentPlatformInfo = credentialsModal.platform ? PLATFORM_COLORS[credentialsModal.platform] : null;

  return (
    <div className="space-y-8 px-8 py-4 font-geist text-gray-700 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <div className="pt-2">
        <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-1" style={{ color: "#FF5B04" }}>
          Admin Settings
        </p>
        <h1 className="text-2xl font-bold font-geist text-gray-900 tracking-tight">
          Integrations & Distribution
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure external publishing connections and programmatic API access keys.
        </p>
      </div>

      {/* PLATFORMS GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((platform) => {
          const connected = platform.isConnected && platform.isActive;
          const style = PLATFORM_COLORS[platform.platform] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-black/5" };
          const result = testResults[platform.platform];

          return (
            <div
              key={platform.platform}
              className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold font-jetbrains-mono ${style.bg} ${style.text} border ${style.border}`}
                    >
                      {PLATFORM_ICONS[platform.platform]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {PLATFORM_LABELS[platform.platform]}
                      </h3>
                      <p className="text-[10px] font-jetbrains-mono text-gray-400 uppercase tracking-wide">
                        {platform.platform === "buffer" ? "Social Distribution" : "Blog Publication"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-jetbrains-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                      connected ? "bg-green-50 text-green-700 border border-green-100" : "bg-black/[0.04] text-gray-400"
                    }`}
                  >
                    {connected ? "● Connected" : "○ Not Configured"}
                  </span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {platform.platform === "wordpress" && "Publish posts directly to self-hosted WordPress sites via WP REST API."}
                  {platform.platform === "medium" && "Distribute high-quality Markdown drafts directly to your Medium publication feed."}
                  {platform.platform === "ghost" && "Distribute posts into a Ghost Admin API platform using encrypted integrations."}
                  {platform.platform === "buffer" && "Queue status updates (excerpt + canonical URL link) directly to X/Twitter and LinkedIn."}
                </p>

                {connected && (
                  <div className="pt-2 border-t border-black/[0.03] space-y-1 text-xs">
                    {platform.platform === "wordpress" && (
                      <p className="text-gray-500 truncate">
                        Site: <span className="font-semibold text-gray-700">{platform.siteUrl}</span> · Admin: <span className="font-semibold text-gray-700">@{platform.wpUsername}</span>
                      </p>
                    )}
                    {platform.platform === "medium" && (
                      <p className="text-gray-500 truncate">
                        Author ID: <span className="font-semibold text-gray-700">{platform.mediumAuthorId || "Synced on test"}</span>
                      </p>
                    )}
                    {platform.platform === "ghost" && (
                      <p className="text-gray-500 truncate">
                        Site URL: <span className="font-semibold text-gray-700">{platform.ghostSiteUrl}</span>
                      </p>
                    )}
                    {platform.platform === "buffer" && (
                      <p className="text-gray-500 truncate">
                        Queue Profiles: <span className="font-semibold text-gray-700">{platform.bufferProfileIds?.join(", ") || "None connected"}</span>
                      </p>
                    )}
                    {platform.lastTestedAt && (
                      <p className="text-[10px] text-gray-400">
                        Last tested: {new Date(platform.lastTestedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {result && (
                  <div
                    className={`text-xs p-2.5 rounded-xl border leading-relaxed ${
                      result.success ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {result.success ? "✓ " : "✗ "}
                    {result.message}
                  </div>
                )}
              </div>

              <div className="bg-black/[0.01] px-5 py-3 border-t border-black/[0.04] flex items-center justify-end gap-2">
                {connected ? (
                  <>
                    <button
                      type="button"
                      disabled={testingPlatform !== null}
                      onClick={() => handleDisconnect(platform.platform)}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg transition-colors hover:bg-red-50/50"
                    >
                      Disconnect
                    </button>
                    <button
                      type="button"
                      disabled={testingPlatform !== null}
                      onClick={() => handleTestConnection(platform.platform)}
                      className="text-xs font-semibold text-gray-600 hover:text-gray-800 bg-white border border-black/5 shadow-sm px-3 py-1.5 rounded-lg hover:bg-black/[0.02] transition-all disabled:opacity-50"
                    >
                      {testingPlatform === platform.platform ? "Testing..." : "Test Connection"}
                    </button>
                    <button
                      type="button"
                      disabled={testingPlatform !== null}
                      onClick={() => openCredentialsModal(platform.platform)}
                      className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                      style={{ background: "#FF5B04" }}
                    >
                      Edit Config
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => openCredentialsModal(platform.platform)}
                    className="w-full text-xs font-semibold text-white py-2 rounded-xl text-center hover:opacity-90 transition-opacity"
                    style={{ background: "#FF5B04" }}
                  >
                    Connect {PLATFORM_LABELS[platform.platform]}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* API KEYS SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.05]">
          <div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider font-jetbrains-mono">
              Programmatic API Keys
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">
              Access keys to query published content from CI pipelines or Zapier automations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setRawKeyReturned(null);
              setErrorText(null);
              setNewKeyModal(true);
            }}
            className="text-xs font-semibold text-white px-4 py-2 rounded-xl flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            style={{ background: "#FF5B04" }}
          >
            + Create Key
          </button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-400">
            No API Keys created yet. Programmatic access is disabled.
          </div>
        ) : (
          <div className="divide-y divide-black/[0.03]">
            {apiKeys.map((key) => (
              <div key={key.id} className="px-6 py-4 flex items-center justify-between text-xs hover:bg-black/[0.005]">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">{key.name}</p>
                  <p className="font-jetbrains-mono text-gray-400 tracking-wide text-[10px]">
                    {key.keyPrefix}
                  </p>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-jetbrains-mono">
                      Scopes
                    </span>
                    <span className="font-semibold text-gray-700">
                      {key.scopes.join(", ")}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-jetbrains-mono">
                      Created At
                    </span>
                    <span className="text-gray-500">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-jetbrains-mono">
                      Last Used
                    </span>
                    <span className="text-gray-500 font-medium">
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : "Never"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRevokeKey(key.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STORAGE & SECURITY INFO NOTE */}
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

      {/* CREDENTIAL EDIT MODAL */}
      {credentialsModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={closeCredentialsModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-black/5 w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-0.5" style={{ color: "#FF5B04" }}>
                  Integrations Center
                </p>
                <h2 className="text-lg font-bold font-geist text-gray-900">
                  Connect {PLATFORM_LABELS[credentialsModal.platform]}
                </h2>
              </div>
              <button
                className="text-gray-400 hover:text-gray-700 transition-colors mt-1 flex items-center justify-center"
                onClick={closeCredentialsModal}
              >
                <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="16">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* Platform Banner strip */}
            {currentPlatformInfo && (
              <div className={`flex items-start gap-3 px-4 py-3 rounded-xl mb-5 ${currentPlatformInfo.bg} border ${currentPlatformInfo.border}`}>
                <span className={`text-lg font-bold leading-none mt-0.5 flex-shrink-0 ${currentPlatformInfo.text}`}>
                  {PLATFORM_ICONS[credentialsModal.platform]}
                </span>
                <div>
                  <p className={`text-xs font-bold font-geist mb-0.5 ${currentPlatformInfo.text}`}>
                    {PLATFORM_LABELS[credentialsModal.platform]} Integration
                  </p>
                  <p className="text-[11px] text-gray-500 font-geist leading-relaxed">
                    Provide credentials to enable secure, tenant-isolated content distribution.
                  </p>
                </div>
              </div>
            )}

            {/* FORM BODY BY PLATFORM */}
            <div className="space-y-4 mb-5">
              {credentialsModal.platform === "wordpress" && (
                <>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      WordPress Site URL
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="https://myblog.com"
                      value={wpForm.siteUrl}
                      onChange={(e) => setWpForm((p) => ({ ...p, siteUrl: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      WordPress Username
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="admin"
                      value={wpForm.wpUsername}
                      onChange={(e) => setWpForm((p) => ({ ...p, wpUsername: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      WordPress Application Password
                    </label>
                    <input
                      type="password"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="xxxx xxxx xxxx xxxx"
                      value={wpForm.wpAppPassword}
                      onChange={(e) => setWpForm((p) => ({ ...p, wpAppPassword: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {credentialsModal.platform === "medium" && (
                <>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Medium Author ID <span className="normal-case font-geist text-gray-300">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="e.g. user_id (autofetched if blank)"
                      value={mediumForm.mediumAuthorId}
                      onChange={(e) => setMediumForm((p) => ({ ...p, mediumAuthorId: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Medium Integration Token
                    </label>
                    <input
                      type="password"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="Paste your Medium Token..."
                      value={mediumForm.mediumToken}
                      onChange={(e) => setMediumForm((p) => ({ ...p, mediumToken: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {credentialsModal.platform === "ghost" && (
                <>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Ghost Site URL
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="https://myghostblog.com"
                      value={ghostForm.ghostSiteUrl}
                      onChange={(e) => setGhostForm((p) => ({ ...p, ghostSiteUrl: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Ghost Admin API Key
                    </label>
                    <input
                      type="password"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="id:secret"
                      value={ghostForm.ghostAdminKey}
                      onChange={(e) => setGhostForm((p) => ({ ...p, ghostAdminKey: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {credentialsModal.platform === "buffer" && (
                <>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Buffer Access Token
                    </label>
                    <input
                      type="password"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="Buffer OAuth Token..."
                      value={bufferForm.bufferAccessToken}
                      onChange={(e) => setBufferForm((p) => ({ ...p, bufferAccessToken: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Buffer Social Profile IDs <span className="normal-case font-geist text-gray-300">(Comma separated)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2 border border-black/10 outline-none"
                      placeholder="profile1, profile2"
                      value={bufferForm.bufferProfileIds}
                      onChange={(e) => setBufferForm((p) => ({ ...p, bufferProfileIds: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Errors block */}
            {errorText && (
              <p className="text-xs text-red-500 font-medium mb-3">{errorText}</p>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-2 rounded-xl text-xs font-semibold font-geist text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={savingCredentials}
                onClick={closeCredentialsModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 py-2 rounded-xl text-xs font-semibold font-geist text-white transition-all hover:opacity-90"
                style={{ background: "#FF5B04" }}
                disabled={savingCredentials}
                onClick={saveCredentials}
              >
                {savingCredentials ? "Saving..." : "Save Credentials"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE API KEY MODAL */}
      {newKeyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => {
            if (!savingKey) setNewKeyModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl border border-black/5 w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {rawKeyReturned ? (
              // KEY RETURNING MODAL
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-3xl">🔑</span>
                  <h3 className="font-bold text-gray-900 font-geist text-lg">
                    API Key Generated Successfully
                  </h3>
                  <p className="text-xs text-gray-400 font-geist">
                    Copy the key below. It will **never** be shown again.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    className="w-full text-xs font-jetbrains-mono bg-black/5 rounded-xl px-4 py-3 pr-20 outline-none border border-black/5"
                    value={rawKeyReturned}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(rawKeyReturned);
                      alert("Copied to clipboard!");
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF5B04] text-white text-[10px] font-semibold px-2.5 py-1.5 rounded-lg hover:opacity-90"
                  >
                    Copy
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewKeyModal(false);
                    setRawKeyReturned(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center hover:opacity-90"
                  style={{ background: "#FF5B04" }}
                >
                  I've Copied It, Close
                </button>
              </div>
            ) : (
              // NAME REQUEST MODAL
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-jetbrains-mono uppercase tracking-widest mb-0.5" style={{ color: "#FF5B04" }}>
                      Security Center
                    </p>
                    <h2 className="text-lg font-bold font-geist text-gray-900">
                      Create API Key
                    </h2>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-700 transition-colors mt-1 flex items-center justify-center"
                    onClick={() => setNewKeyModal(false)}
                  >
                    <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="16">
                      <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1">
                      Key Name
                    </label>
                    <input
                      type="text"
                      className="w-full text-sm font-geist bg-gray-50 rounded-lg px-3 py-2.5 border border-black/10 outline-none"
                      placeholder="e.g. CI Pipeline, Zapier Integration"
                      value={newKeyForm.name}
                      onChange={(e) => setNewKeyForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-jetbrains-mono uppercase tracking-wider text-gray-400 block mb-1.5">
                      Permissions Scopes
                    </label>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 text-gray-500 cursor-not-allowed">
                        <input type="checkbox" checked disabled className="rounded text-[#FF5B04]" />
                        <span>read (Required) · Read published blog list & detail</span>
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKeyForm.scopeWrite}
                          onChange={(e) => setNewKeyForm((p) => ({ ...p, scopeWrite: e.target.checked }))}
                          className="rounded text-[#FF5B04] focus:ring-[#FF5B04]/30"
                        />
                        <span>write · Create new blog drafts programmatically</span>
                      </label>
                    </div>
                  </div>
                </div>

                {errorText && (
                  <p className="text-xs text-red-500 font-medium">{errorText}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-xl text-xs font-semibold font-geist text-gray-600 bg-gray-100 hover:bg-gray-200"
                    disabled={savingKey}
                    onClick={() => setNewKeyModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 py-2 rounded-xl text-xs font-semibold font-geist text-white hover:opacity-90"
                    style={{ background: "#FF5B04" }}
                    disabled={savingKey || !newKeyForm.name.trim()}
                    onClick={handleCreateApiKey}
                  >
                    {savingKey ? "Generating..." : "Generate Key"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
