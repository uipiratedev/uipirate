"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { PageHeader, Card, StatePanel } from "@/components/admin/ui";

interface ServiceItem {
  structuredServiceItem?: { serviceTypeId: string };
  freeFormServiceItem?: { label: { displayName: string; description?: string } };
}

interface Plan {
  keep: string[];
  described: string[];
  remove: string[];
  add: Array<{ name: string; description: string }>;
  same: string[];
}

interface Data {
  profile: {
    title: string;
    description: string;
    website: string;
    primaryCategory: string;
    additionalCategories: string[];
    services: ServiceItem[];
  };
  servicePlan: Plan;
}

const btn =
  "rounded-md px-3 py-1.5 text-xs font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-40";

export default function ProfileClient() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [desc, setDesc] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const j = await (await fetch("/api/admin/gbp/profile", { cache: "no-store" })).json();

      if (!j.ok) setError([j.error, j.hint].filter(Boolean).join(" — ") || "Could not load the profile.");
      else setData(j);
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function apply(action: "apply-services" | "apply-description") {
    setBusy(true);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/gbp/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, description: desc }),
      });
      const j = await res.json();

      if (j.ok) {
        setNotice({ tone: "ok", text: "Updated on Google. It can take a few minutes to show publicly." });
        setDesc(null);
        await load();
      } else setNotice({ tone: "err", text: [j.error, j.hint].filter(Boolean).join(" — ") });
    } catch {
      setNotice({ tone: "err", text: "Network error — try again." });
    } finally {
      setBusy(false);
    }
  }

  const plan = data?.servicePlan;
  const nothingToDo =
    plan && !plan.remove.length && !plan.add.length && !plan.described.length;
  const live = data?.profile.services ?? [];

  return (
    <>
      <PageHeader
        description="What your Google listing says about the business, compared with your website. Nothing changes until you press Apply."
        title="Business details"
        actions={
          <Link
            className={`${btn} bg-white text-gray-700 ring-gray-200 hover:bg-gray-50`}
            href="/admin/google-business"
          >
            ← Posts
          </Link>
        }
      />

      {notice && (
        <div
          className={`mb-4 rounded-xl border p-3.5 text-sm font-semibold ${
            notice.tone === "ok"
              ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
              : "border-red-200 bg-red-50/70 text-red-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      <StatePanel error={error} loading={loading} onRetry={load}>
        {data && plan && (
          <div className="space-y-5">
            <Card
              subtitle="Taken from the service pages and home page of uipirate.com"
              title="Services"
            >
              {nothingToDo ? (
                <p className="text-sm text-emerald-700">
                  The listing already matches your website. Nothing to change.
                </p>
              ) : (
                <div className="space-y-4 text-sm">
                  {plan.remove.length > 0 && (
                    <div>
                      <p className="font-semibold text-red-700">Will be removed ({plan.remove.length})</p>
                      <p className="mt-1 text-gray-600">{plan.remove.join(" · ")}</p>
                    </div>
                  )}
                  {plan.add.length > 0 && (
                    <div>
                      <p className="font-semibold text-emerald-700">Will be added or updated ({plan.add.length})</p>
                      <ul className="mt-1 space-y-1.5">
                        {plan.add.map((s) => (
                          <li key={s.name}>
                            <span className="font-medium text-gray-900">{s.name}</span>
                            <span className="block text-xs text-gray-500">{s.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {plan.described.length > 0 && (
                    <div>
                      <p className="font-semibold text-emerald-700">
                        Standard services that get a description ({plan.described.length})
                      </p>
                      <p className="mt-1 text-gray-600">{plan.described.join(" · ")}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-700">Kept as they are</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Google&apos;s standard services: {plan.keep.join(", ") || "none"}
                    </p>
                  </div>
                  <button
                    className={`${btn} bg-gray-900 text-white ring-gray-900 hover:bg-gray-800`}
                    disabled={busy}
                    type="button"
                    onClick={() => {
                      if (window.confirm("Replace the services on your public Google listing with these?"))
                        apply("apply-services");
                    }}
                  >
                    {busy ? "Applying…" : "Apply to Google"}
                  </button>
                  <p className="text-[11px] text-gray-400">
                    The current list is saved first, so it can be put back.
                  </p>
                </div>
              )}

              <details className="mt-4 text-xs text-gray-500">
                <summary className="cursor-pointer font-semibold">Live on Google now ({live.length})</summary>
                <ul className="mt-2 list-disc space-y-0.5 pl-5">
                  {live.map((s, i) => (
                    <li key={i}>
                      {s.freeFormServiceItem
                        ? s.freeFormServiceItem.label.displayName
                        : s.structuredServiceItem?.serviceTypeId.replace("job_type_id:", "")}
                    </li>
                  ))}
                </ul>
              </details>
            </Card>

            <Card subtitle="750 characters at most. No links or phone numbers." title="Description">
              <textarea
                className="h-44 w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                maxLength={750}
                value={desc ?? data.profile.description}
                onChange={(e) => setDesc(e.target.value)}
              />
              <div className="mt-2 flex items-center gap-3">
                <button
                  className={`${btn} bg-gray-900 text-white ring-gray-900 hover:bg-gray-800`}
                  disabled={busy || desc === null || desc === data.profile.description}
                  type="button"
                  onClick={() => apply("apply-description")}
                >
                  {busy ? "Applying…" : "Apply to Google"}
                </button>
                <span className="text-[11px] text-gray-400">
                  {(desc ?? data.profile.description).length} / 750
                </span>
              </div>
            </Card>

            <Card title="Categories">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Primary:</span> {data.profile.primaryCategory || "—"}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                <span className="font-semibold">Also:</span>{" "}
                {data.profile.additionalCategories.join(", ") || "—"}
              </p>
              <p className="mt-2 text-[11px] text-gray-400">
                Categories are read-only here; change them in Business Profile.
              </p>
            </Card>
          </div>
        )}
      </StatePanel>
    </>
  );
}
