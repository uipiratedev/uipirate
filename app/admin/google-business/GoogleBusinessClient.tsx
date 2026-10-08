"use client";

import { useState } from "react";

import { useApi } from "@/lib/admin/useApi";
import { PageHeader, Card, StatePanel } from "@/components/admin/ui";
import { KpiRow } from "@/components/admin/KpiRow";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { fmtInt } from "@/components/admin/format";

type Status = "queued" | "publishing" | "published" | "failed" | "skipped";

interface Row {
  slug: string;
  title: string;
  postType: string | null;
  status: Status;
  origin: "new" | "backlog";
  attempts: number;
  message: string | null;
  skipKind: "manual" | "ineligible" | null;
  publishedAt: string | null;
  postPublishedAt: string | null;
}

interface Data {
  configured: boolean;
  publishingEnabled: boolean;
  nextBacklogAt: string | null;
  counts: Partial<Record<Status, number>>;
  rows: Row[];
}

interface Preview {
  slug: string;
  summary: string;
  url: string;
  image?: string;
}

const STATUS_STYLE: Record<Status, string> = {
  queued: "bg-sky-50 text-sky-700 ring-sky-200",
  publishing: "bg-amber-50 text-amber-700 ring-amber-200",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  skipped: "bg-gray-100 text-gray-600 ring-gray-200",
};

const fmtDay = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

const btn =
  "rounded-md px-2.5 py-1 text-xs font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-40";

export default function GoogleBusinessClient() {
  const { data, loading, error, refetch } = useApi<Data>(
    "/api/admin/gbp",
    undefined,
    false,
  );

  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "err"; text: string; hint?: string } | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [found, setFound] = useState<Array<{ account: { id: string; name: string }; locations: Array<{ id: string; title: string }> }> | null>(null);

  async function act(action: string, slug?: string, key = `${action}:${slug ?? ""}`) {
    setBusy(key);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/gbp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, slug }),
      });
      const j = await res.json();

      if (action === "preview" && j.ok && j.dryRun) {
        setPreview({
          slug: j.slug,
          summary: j.payload.summary,
          url: j.payload.callToAction.url,
          image: j.payload.media?.[0]?.sourceUrl,
        });
      } else if (action === "check" && j.ok) {
        setFound(j.locations);
        setNotice({ tone: "ok", text: `Connected. ${j.accounts.length} account(s) visible.` });
      } else if (j.ok === false) {
        setNotice({ tone: "err", text: j.message || j.error || "That did not work.", hint: j.hint });
      } else if (action === "publish") {
        setNotice({ tone: "ok", text: "Published to your Google Business Profile." });
      } else if (action === "sync") {
        setNotice({ tone: "ok", text: `Synced ${j.total} posts — ${j.created} new, ${j.released} released.` });
      }
    } catch {
      setNotice({ tone: "err", text: "Network error — try again." });
    } finally {
      setBusy(null);
      refetch();
    }
  }

  const columns: Column<Row>[] = [
    {
      key: "title",
      header: "Post",
      render: (r) => (
        <span className="block max-w-[24rem]">
          <span className="block truncate font-medium text-gray-900" title={r.title}>
            {r.title || r.slug}
          </span>
          <span className="block truncate text-xs text-gray-400">{r.slug}</span>
          {r.message ? (
            <span className={`mt-0.5 block text-xs ${r.status === "failed" ? "text-red-600" : "text-gray-500"}`}>
              {r.message}
            </span>
          ) : null}
        </span>
      ),
      sortValue: (r) => r.title,
    },
    {
      key: "postType",
      header: "Type",
      render: (r) => r.postType ?? "blog",
      sortValue: (r) => r.postType ?? "blog",
    },
    {
      key: "origin",
      header: "Lane",
      render: (r) => (r.origin === "new" ? "New" : "Backlog"),
      sortValue: (r) => r.origin,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ${STATUS_STYLE[r.status]}`}>
          {r.status}
        </span>
      ),
      sortValue: (r) => r.status,
    },
    {
      key: "publishedAt",
      header: "Posted",
      render: (r) => fmtDay(r.publishedAt),
      sortValue: (r) => r.publishedAt ?? "",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => {
        const canSend = r.status === "queued" || r.status === "failed";
        const b = (a: string) => busy === `${a}:${r.slug}`;

        return (
          <span className="flex justify-end gap-1.5">
            {r.status !== "published" && (
              <button
                className={`${btn} bg-white text-gray-700 ring-gray-200 hover:bg-gray-50`}
                disabled={!!busy}
                type="button"
                onClick={() => act("preview", r.slug)}
              >
                {b("preview") ? "…" : "Preview"}
              </button>
            )}
            {canSend && (
              <button
                className={`${btn} bg-gray-900 text-white ring-gray-900 hover:bg-gray-800`}
                disabled={!!busy || !data?.configured}
                title={data?.configured ? "" : "Set GBP_ACCOUNT_ID and GBP_LOCATION_ID first"}
                type="button"
                onClick={() => {
                  if (window.confirm(`Publish "${r.title || r.slug}" to your public Google Business Profile now?`))
                    act("publish", r.slug);
                }}
              >
                {b("publish") ? "Posting…" : "Publish now"}
              </button>
            )}
            {canSend && (
              <button
                className={`${btn} bg-white text-gray-600 ring-gray-200 hover:bg-gray-50`}
                disabled={!!busy}
                type="button"
                onClick={() => act("skip", r.slug)}
              >
                Skip
              </button>
            )}
            {(r.status === "skipped" || r.status === "failed") && (
              <button
                className={`${btn} bg-white text-gray-600 ring-gray-200 hover:bg-gray-50`}
                disabled={!!busy}
                type="button"
                onClick={() => act("requeue", r.slug)}
              >
                Re-queue
              </button>
            )}
          </span>
        );
      },
    },
  ];

  const c = data?.counts ?? {};

  return (
    <>
      <PageHeader
        description="Posts your articles and case studies to your Google Business Profile. New ones go out within a day; the existing backlog drips out about twice a week."
        title="Google Business Profile"
        actions={
          <div className="flex gap-2">
            <button
              className={`${btn} bg-white text-gray-700 ring-gray-200 hover:bg-gray-50`}
              disabled={!!busy}
              type="button"
              onClick={() => act("check")}
            >
              {busy === "check:" ? "Checking…" : "Check connection"}
            </button>
            <button
              className={`${btn} bg-gray-900 text-white ring-gray-900 hover:bg-gray-800`}
              disabled={!!busy}
              type="button"
              onClick={() => act("sync")}
            >
              {busy === "sync:" ? "Syncing…" : "Sync now"}
            </button>
          </div>
        }
      />

      {notice && (
        <div
          className={`mb-4 rounded-xl border p-3.5 text-sm ${
            notice.tone === "ok"
              ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
              : "border-red-200 bg-red-50/70 text-red-800"
          }`}
        >
          <span className="font-semibold">{notice.text}</span>
          {notice.hint ? <span className="mt-1 block text-xs opacity-90">{notice.hint}</span> : null}
        </div>
      )}

      <StatePanel error={error} loading={loading} onRetry={refetch}>
        {data && !data.configured && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900">
            <p className="font-semibold">Not connected yet — nothing can be posted.</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-relaxed">
              <li>In Google Cloud, enable <strong>My Business Account Management API</strong>, <strong>My Business Business Information API</strong> and <strong>Google My Business API</strong>.</li>
              <li>In Business Profile → <em>People and access</em>, add the service account's email as a <strong>Manager</strong>.</li>
              <li>Press <strong>Check connection</strong> above — it lists your account and location ids.</li>
              <li>Set <code>GBP_ACCOUNT_ID</code> and <code>GBP_LOCATION_ID</code> in Vercel, then redeploy.</li>
            </ol>
          </div>
        )}

        {data?.configured && !data.publishingEnabled && (
          <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-900">
            <span className="font-semibold">Automatic posting is off.</span> The daily job syncs the queue
            but posts nothing. You can still publish manually. Set <code>GBP_PUBLISH_ENABLED=1</code> to
            turn the schedule on.
          </div>
        )}

        {found && found.length > 0 && (
          <Card subtitle="Copy these into GBP_ACCOUNT_ID and GBP_LOCATION_ID" title="Your profile ids">
            <ul className="space-y-1.5 text-sm">
              {found.map((f) => (
                <li key={f.account.id} className="font-mono text-xs">
                  <span className="text-gray-500">{f.account.name}</span> — account <strong>{f.account.id}</strong>
                  {f.locations.map((l) => (
                    <span key={l.id} className="ml-3 block">
                      {l.title}: location <strong>{l.id}</strong>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <div className={found?.length ? "mt-5" : ""}>
          <KpiRow
            items={[
              { label: "Published", value: fmtInt(c.published ?? 0), hint: "Live on Google" },
              { label: "Queued", value: fmtInt(c.queued ?? 0), hint: "Waiting their turn" },
              { label: "Failed", value: fmtInt(c.failed ?? 0), hint: "Needs a look" },
              { label: "Skipped", value: fmtInt(c.skipped ?? 0), hint: "Held drafts & manual skips" },
              {
                label: "Next backlog post",
                value: data?.nextBacklogAt ? fmtDay(data.nextBacklogAt) : "—",
                hint: "About two a week",
              },
            ]}
          />
        </div>

        <div className="mt-5">
          <Card subtitle="Held drafts are never posted, even manually" title="Queue">
            <DataTable
              columns={columns}
              initialSort={{ key: "status", dir: "asc" }}
              rowKey={(r) => r.slug}
              rows={data?.rows ?? []}
            />
          </Card>
        </div>
      </StatePanel>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          onClick={() => setPreview(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Exactly what Google will receive
            </p>
            {preview.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="" className="mt-3 max-h-56 w-full rounded-lg object-cover" src={preview.image} />
            ) : (
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                No usable image — this post will go out text-only.
              </p>
            )}
            <p className="mt-3 whitespace-pre-wrap text-sm text-gray-900">{preview.summary}</p>
            <p className="mt-3 break-all rounded-lg bg-gray-50 p-2.5 font-mono text-[11px] text-gray-600">
              <span className="font-sans font-semibold">Learn more →</span> {preview.url}
            </p>
            <button
              className={`${btn} mt-4 bg-gray-900 text-white ring-gray-900`}
              type="button"
              onClick={() => setPreview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
