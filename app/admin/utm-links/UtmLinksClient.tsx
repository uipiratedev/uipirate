"use client";

import { useMemo, useState } from "react";

import { PageHeader, Card } from "@/components/admin/ui";
import {
  UTM_PRESETS,
  buildUtmUrl,
  slugifyUtm,
} from "@/lib/analytics/utm";

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-gray-400">{hint}</span> : null}
    </label>
  );
}

export default function UtmLinksClient() {
  const [url, setUrl] = useState("/design-tokens-how-to-build-an-enterprise-grade-token-system");
  const [source, setSource] = useState("reddit");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  const built = useMemo(
    () => buildUtmUrl({ url, source, medium, campaign, content }),
    [url, source, medium, campaign, content],
  );

  const copy = async () => {
    if (!built) return;

    try {
      await navigator.clipboard.writeText(built);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the link is
      // still selectable in the box below.
    }
  };

  return (
    <>
      <PageHeader
        description="Links shared from apps like Reddit and WhatsApp often lose their source and land as Direct. A tagged link keeps it."
        title="UTM link builder"
      />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card subtitle="Pick where you will post it" title="Build a link">
            <div className="mb-4 flex flex-wrap gap-2">
              {UTM_PRESETS.map((p) => {
                const active =
                  slugifyUtm(source) === p.source && slugifyUtm(medium) === p.medium;

                return (
                  <button
                    key={p.label}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                      active
                        ? "bg-gray-900 text-white ring-gray-900"
                        : "bg-white text-gray-700 ring-gray-200 hover:bg-gray-50"
                    }`}
                    type="button"
                    onClick={() => {
                      setSource(p.source);
                      setMedium(p.medium);
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <Field hint="A path like /pricing, or a full URL" label="Page">
                <input
                  className={inputCls}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field hint="Where the link is posted" label="Source">
                  <input className={inputCls} value={source} onChange={(e) => setSource(e.target.value)} />
                </Field>
                <Field hint="Kind of placement" label="Medium">
                  <input className={inputCls} value={medium} onChange={(e) => setMedium(e.target.value)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field hint="Optional — group a push, e.g. oct-launch" label="Campaign">
                  <input className={inputCls} value={campaign} onChange={(e) => setCampaign(e.target.value)} />
                </Field>
                <Field hint="Optional — tell two posts apart" label="Content">
                  <input className={inputCls} value={content} onChange={(e) => setContent(e.target.value)} />
                </Field>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card subtitle="Updates as you type" title="Your link">
            {built ? (
              <>
                <textarea
                  readOnly
                  className={`${inputCls} h-32 resize-none font-mono text-xs`}
                  value={built}
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                  type="button"
                  onClick={copy}
                >
                  {copied ? "Copied" : "Copy link"}
                </button>
              </>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">
                Enter a page, a source and a medium to build the link.
              </p>
            )}

            <p className="mt-4 border-t border-gray-100 pt-3 text-xs leading-relaxed text-gray-500">
              Use <strong>one</strong> spelling per source. <code>Reddit</code>{" "}
              and <code>reddit</code> are merged here, but a typo like{" "}
              <code>redit</code> would appear as a separate source.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
